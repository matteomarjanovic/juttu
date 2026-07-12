import type {
	AtUri,
	BlobRef,
	BskyPost,
	CurrentUser,
	DocumentRecord,
	JuttuConfig,
	LocalCounts,
	PaginationState,
	SortOption,
	ThreadViewPost,
	ViewerState
} from './types';
import {
	TOP_LEVEL_PAGE_SIZE,
	NESTED_PAGE_SIZE,
	LOGIN_POLL_INTERVAL_MS,
	LOGIN_POLL_TIMEOUT_MS,
	POST_REFETCH_DELAY_MS,
	SVG_LIKE,
	SVG_REPOST,
	SVG_REPLY,
	SVG_BSKY,
	STYLES
} from './constants';
import {
	parseAtUri,
	resolveDid,
	resolveHandle,
	fetchDocumentRecord,
	fetchPublicationRecord,
	fetchPublicationUri,
	getOgImageUrl,
	getPageTitle,
	getPageDescription,
	fetchThread,
	fetchViewerStates,
	checkCurrentUser,
	fetchUserProfile,
	formatRelativeTime,
	renderRichText,
	getTopLevelReplies,
	sortReplies,
	collectViewerState,
	findPostInThread,
	buildSegments
} from './api';

// ─── Widget Class ─────────────────────────────────────────────────────────────

export class JuttuWidget {
	private config: JuttuConfig;
	private container: HTMLElement;
	private threadData: ThreadViewPost | null = null;
	private currentUser: CurrentUser | null = null;
	private rootPostUri: string | null = null;
	private rootPostCid: string | null = null;
	private sortOrder: SortOption = 'newest';
	private pagination: PaginationState = {
		visibleTopLevel: TOP_LEVEL_PAGE_SIZE,
		visibleReplies: new Map()
	};
	private viewerState: Map<string, ViewerState> = new Map();
	private localCounts: Map<string, LocalCounts> = new Map();
	private pendingActions: Set<string> = new Set();
	private openReplyFormUri: string | null = null;
	private loginPopup: Window | null = null;
	private loginPollInterval: ReturnType<typeof setInterval> | null = null;
	private loginPollStartTime = 0;
	private popupClosedAt = 0;
	private pendingAction: (() => Promise<void>) | null = null;
	private mentionDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private activeSuggestionsTextarea: HTMLTextAreaElement | null = null;
	// Document linking state
	private documentAtUri: AtUri | null = null;
	private documentRecord: DocumentRecord | null = null;
	private linkingStep: 'setup' | 'login' | 'create-publication' | 'metadata' | 'choose-method' | 'write-post' | 'select-post' = 'setup';
	private linkingTitle = '';
	private linkingDescription = '';
	// Document path, editable only when linked to a publication (see makeLinkingMetadata).
	private linkingPath = '';
	// Whether to upload the page's og:image as the document's coverImage.
	private includeCoverImage = true;
	private userPosts: Array<{ uri: string; cid: string; text: string; createdAt: string }> = [];
	// Publication the document belongs to (a site.standard.publication AT URI). Resolved from
	// the site's /.well-known file; used as the document's `site` field when creating a record.
	private publicationUri: string | null = null;
	// Set when the well-known file declares a publication that is missing from the owner's repo.
	private pendingPublicationUri: AtUri | null = null;
	// Handle of the article owner (the DID in the <link> tag), resolved for the setup login button.
	private authorHandle: string | null = null;
	// Intent of the in-progress login: 'setup' needs owner scopes, 'comment' only reader scopes.
	private loginIntent: 'comment' | 'setup' = 'comment';

	private static readonly POPUP_FEATURES = 'width=500,height=600,menubar=no,toolbar=no,location=no,status=no';

	constructor(container: HTMLElement, config: JuttuConfig) {
		this.container = container;
		this.config = config;
		this.injectStyles();
		this.init();
	}

	private injectStyles(): void {
		if (document.getElementById('juttu-styles')) return;
		const style = document.createElement('style');
		style.id = 'juttu-styles';
		style.textContent = STYLES;
		document.head.appendChild(style);
	}

	private async init(): Promise<void> {
		this.renderLoading();
		try {
			const linkEl = document.querySelector('link[rel="site.standard.document"]');
			if (!linkEl) {
				this.renderError(
					'Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.'
				);
				return;
			}
			const href = linkEl.getAttribute('href');
			if (!href || !href.startsWith('at://')) {
				this.renderError(
					'Invalid <link rel="site.standard.document" href> — must be an AT URI (at://).'
				);
				return;
			}
			const atUri = parseAtUri(href);
			if (!atUri) {
				this.renderError('Could not parse AT URI from link tag.');
				return;
			}
			const pdsUrl = await resolveDid(atUri.did);
			const docRecord = await fetchDocumentRecord(pdsUrl, atUri);
			if (docRecord?.bskyPostRef?.uri) {
				this.rootPostUri = docRecord.bskyPostRef.uri;
				this.rootPostCid = docRecord.bskyPostRef.cid;
				this.threadData = await fetchThread(docRecord.bskyPostRef.uri);
				collectViewerState(this.threadData, this.viewerState);
				this.syncLocalCounts(this.threadData);
				this.renderWidget();
			} else {
				// No bskyPostRef (or no record) — enter document linking flow
				this.documentAtUri = atUri;
				this.documentRecord = docRecord;
				this.authorHandle = await resolveHandle(atUri.did);
				this.linkingStep = 'setup';
				this.renderLinkingUI();
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			this.renderError(`Could not load comments: ${message}`);
		}
	}

	// ─── Render ─────────────────────────────────────────────────────────────────

	private syncLocalCounts(thread: ThreadViewPost): void {
		const walk = (node: ThreadViewPost): void => {
			const { post } = node;
			this.localCounts.set(post.uri, {
				likes: post.likeCount ?? 0,
				reposts: post.repostCount ?? 0,
				replies: post.replyCount ?? 0
			});
			for (const reply of node.replies ?? []) {
				if (reply.$type === 'app.bsky.feed.defs#threadViewPost') walk(reply as ThreadViewPost);
			}
		};
		walk(thread);
	}

	private renderLoading(): void {
		this.container.innerHTML = '';
		const wrapper = this.makeRoot();
		const loading = document.createElement('div');
		loading.className = 'juttu-loading';
		loading.textContent = 'Loading comments…';
		wrapper.appendChild(loading);
		this.container.appendChild(wrapper);
	}

	private renderError(message: string): void {
		this.container.innerHTML = '';
		const wrapper = this.makeRoot();
		const error = document.createElement('div');
		error.className = 'juttu-error';
		error.textContent = `Juttu: ${message}`;
		wrapper.appendChild(error);
		this.container.appendChild(wrapper);
	}

	private detectTheme(): 'light' | 'dark' {
		const tempDiv = document.createElement('div');
		this.container.appendChild(tempDiv);
		const color = window.getComputedStyle(tempDiv).color;
		this.container.removeChild(tempDiv);

		const rgb = color.match(/\d+/g);
		if (!rgb || rgb.length < 3) return 'light';

		const [r, g, b] = rgb.map(Number);
		// If inherited text color is dark (each channel <= 120), the site background is light
		return (r <= 120 && g <= 120 && b <= 120) ? 'light' : 'dark';
	}

	private makeRoot(): HTMLElement {
		const root = document.createElement('div');
		root.className = 'juttu-comments';
		const theme = this.config.theme === 'auto' ? this.detectTheme() : this.config.theme;
		root.setAttribute('data-juttu-theme', theme);
		return root;
	}

	private renderWidget(): void {
		this.container.innerHTML = '';
		const root = this.makeRoot();

		const topLevelReplies = this.threadData ? getTopLevelReplies(this.threadData) : [];
		root.appendChild(this.renderHeader(topLevelReplies.length));
		root.appendChild(this.renderComposer());
		root.appendChild(this.renderThread(topLevelReplies));

		const footer = document.createElement('div');
		footer.className = 'juttu-footer';
		const poweredBy = document.createElement('a');
		poweredBy.className = 'juttu-powered-by';
		poweredBy.href = 'https://juttu.app';
		poweredBy.target = '_blank';
		poweredBy.rel = 'noopener noreferrer';
		poweredBy.textContent = 'Powered by Juttu';
		footer.appendChild(poweredBy);
		root.appendChild(footer);

		root.addEventListener('click', (e) => this.handleClick(e));
		root.addEventListener('input', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('juttu-compose-input')) {
				const submitBtn = root.querySelector<HTMLButtonElement>('.juttu-submit-btn');
				if (submitBtn) submitBtn.disabled = !(target as HTMLTextAreaElement).value.trim();
			}
			if (target.classList.contains('juttu-reply-input')) {
				const form = target.closest('.juttu-reply-form');
				const btn = form?.querySelector<HTMLButtonElement>('.juttu-reply-submit');
				if (btn) btn.disabled = !(target as HTMLTextAreaElement).value.trim();
			}
		});
		this.container.appendChild(root);
	}

	private handleClick(e: MouseEvent): void {
		const target = e.target as HTMLElement;

		// Sort
		const sortBtn = target.closest<HTMLElement>('.juttu-sort-btn');
		if (sortBtn) {
			const order = sortBtn.dataset.sort as SortOption | undefined;
			if (order) this.setSortOrder(order);
			return;
		}

		// Pagination
		if (target.closest('.juttu-load-more-btn')) {
			this.pagination.visibleTopLevel += TOP_LEVEL_PAGE_SIZE;
			this.renderWidget();
			return;
		}
		const showRepliesBtn = target.closest<HTMLElement>('.juttu-show-replies-btn');
		if (showRepliesBtn) {
			const uri = showRepliesBtn.dataset.uri;
			if (uri) {
				const current = this.pagination.visibleReplies.get(uri) ?? NESTED_PAGE_SIZE;
				this.pagination.visibleReplies.set(uri, current + NESTED_PAGE_SIZE);
				this.renderWidget();
			}
			return;
		}

		// Login link / Logout
		if (target.closest('.juttu-login-link')) { this.resolveAuth(); return; }
		if (target.closest('.juttu-logout-btn')) { this.handleLogout(); return; }

		// Like
		const likeBtn = target.closest<HTMLElement>('.juttu-like-btn');
		if (likeBtn) { this.resolveAuth(() => this.handleLike(likeBtn)); return; }

		// Repost
		const repostBtn = target.closest<HTMLElement>('.juttu-repost-btn');
		if (repostBtn) { this.resolveAuth(() => this.handleRepost(repostBtn)); return; }

		// Reply toggle
		const replyBtn = target.closest<HTMLElement>('.juttu-reply-btn');
		if (replyBtn) {
			const uri = replyBtn.dataset.uri;
			if (uri) this.handleToggleReplyForm(uri);
			return;
		}

		// Reply form actions
		if (target.closest('.juttu-reply-cancel')) { this.closeReplyForm(); return; }
		if (target.closest('.juttu-reply-submit')) {
			if (this.openReplyFormUri) { this.resolveAuth(() => this.handleSubmitReply(this.openReplyFormUri!)); }
			return;
		}

		// Top-level post
		if (target.closest('.juttu-submit-btn')) { this.resolveAuth(() => this.handlePost()); return; }
	}

	private setSortOrder(order: SortOption): void {
		this.sortOrder = order;
		this.pagination.visibleTopLevel = TOP_LEVEL_PAGE_SIZE;
		this.pagination.visibleReplies.clear();
		this.renderWidget();
	}

	private renderHeader(commentCount: number): HTMLElement {
		const header = document.createElement('div');
		header.className = 'juttu-header';

		const title = document.createElement('h2');
		title.className = 'juttu-title';
		title.textContent = `${commentCount} Comment${commentCount !== 1 ? 's' : ''}`;
		header.appendChild(title);

		return header;
	}

	private makeSortControls(): HTMLElement {
		const sortControls = document.createElement('div');
		sortControls.className = 'juttu-sort-controls';
		for (const { value, label } of [
			{ value: 'newest' as SortOption, label: 'Newest' },
			{ value: 'oldest' as SortOption, label: 'Oldest' },
			{ value: 'most-liked' as SortOption, label: 'Top' }
		]) {
			const btn = document.createElement('button');
			btn.className = 'juttu-sort-btn' + (this.sortOrder === value ? ' juttu-sort-btn--active' : '');
			btn.dataset.sort = value;
			btn.textContent = label;
			sortControls.appendChild(btn);
		}
		return sortControls;
	}

	private renderComposer(): HTMLElement {
		const composer = document.createElement('div');
		composer.className = 'juttu-composer';
		composer.appendChild(this.makeComposeArea());
		return composer;
	}

	private makeComposeArea(): HTMLElement {
		const area = document.createElement('div');
		area.className = 'juttu-compose-area';

		if (this.currentUser) {
			const userRow = document.createElement('div');
			userRow.className = 'juttu-compose-user';

			if (this.currentUser.avatar) {
				const img = document.createElement('img');
				img.className = 'juttu-compose-avatar';
				img.src = this.currentUser.avatar;
				img.alt = this.currentUser.handle;
				userRow.appendChild(img);
			} else {
				const ph = document.createElement('div');
				ph.className = 'juttu-avatar-placeholder';
				userRow.appendChild(ph);
			}

			const authorInfo = document.createElement('div');
			authorInfo.className = 'juttu-author-info';
			if (this.currentUser.displayName) {
				const name = document.createElement('span');
				name.className = 'juttu-display-name';
				name.textContent = this.currentUser.displayName;
				authorInfo.appendChild(name);
			}
			const handle = document.createElement('span');
			handle.className = 'juttu-handle';
			handle.textContent = `@${this.currentUser.handle}`;
			authorInfo.appendChild(handle);
			userRow.appendChild(authorInfo);

			const logoutBtn = document.createElement('button');
			logoutBtn.className = 'juttu-logout-btn';
			logoutBtn.textContent = 'Logout';
			userRow.appendChild(logoutBtn);
			area.appendChild(userRow);
		} else {
			const loginLink = document.createElement('button');
			loginLink.className = 'juttu-login-link';
			loginLink.textContent = 'Login to comment';
			area.appendChild(loginLink);
		}

		const textarea = document.createElement('textarea');
		textarea.className = 'juttu-compose-input';
		textarea.placeholder = 'Write a comment…';
		textarea.rows = 3;
		const { wrap, backdrop } = this.buildEditorWrap(textarea);
		area.appendChild(wrap);
		setTimeout(() => this.syncBackdropStyles(backdrop, textarea), 0);
		textarea.addEventListener('input', () => {
			this.updateBackdrop(backdrop, textarea.value);
			this.handleMentionInput(textarea);
		});
		textarea.addEventListener('scroll', () => this.syncScroll(backdrop, textarea));
		textarea.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.dismissAutocomplete(textarea); });

		const actions = document.createElement('div');
		actions.className = 'juttu-compose-actions';
		actions.appendChild(this.makeSortControls());

		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-submit-btn';
		submitBtn.textContent = 'Post comment';
		submitBtn.disabled = true;
		actions.appendChild(submitBtn);

		area.appendChild(actions);

		return area;
	}

	private renderThread(topLevelReplies: ThreadViewPost[]): HTMLElement {
		const thread = document.createElement('div');
		thread.className = 'juttu-thread';

		const sorted = sortReplies(topLevelReplies, this.sortOrder);
		const visible = sorted.slice(0, this.pagination.visibleTopLevel);
		for (const reply of visible) thread.appendChild(this.renderComment(reply, 0));

		if (sorted.length > this.pagination.visibleTopLevel) {
			const loadMore = document.createElement('div');
			loadMore.className = 'juttu-load-more';
			const btn = document.createElement('button');
			btn.className = 'juttu-load-more-btn';
			const remaining = sorted.length - this.pagination.visibleTopLevel;
			btn.textContent = `Load ${Math.min(remaining, TOP_LEVEL_PAGE_SIZE)} more comments`;
			loadMore.appendChild(btn);
			thread.appendChild(loadMore);
		}
		return thread;
	}

	private renderComment(threadView: ThreadViewPost, depth: number): HTMLElement {
		const { post } = threadView;
		const postRkey = post.uri.split('/').pop() ?? '';
		const bskyPostUrl = `https://bsky.app/profile/${post.author.did}/post/${postRkey}`;
		const bskyProfileUrl = `https://bsky.app/profile/${post.author.handle}`;

		const comment = document.createElement('div');
		comment.className = 'juttu-comment';
		comment.dataset.uri = post.uri;
		comment.dataset.cid = post.cid;

		// Header
		const header = document.createElement('div');
		header.className = 'juttu-comment-header';

		if (post.author.avatar) {
			const avatarLink = document.createElement('a');
			avatarLink.className = 'juttu-avatar-link';
			avatarLink.href = bskyProfileUrl;
			avatarLink.target = '_blank';
			avatarLink.rel = 'noopener noreferrer';
			const img = document.createElement('img');
			img.className = 'juttu-avatar';
			img.src = post.author.avatar;
			img.alt = post.author.handle;
			img.loading = 'lazy';
			avatarLink.appendChild(img);
			header.appendChild(avatarLink);
		} else {
			const ph = document.createElement('div');
			ph.className = 'juttu-avatar-placeholder';
			header.appendChild(ph);
		}

		const authorInfo = document.createElement('div');
		authorInfo.className = 'juttu-author-info';

		const displayName = document.createElement('a');
		displayName.className = 'juttu-display-name';
		displayName.href = bskyProfileUrl;
		displayName.target = '_blank';
		displayName.rel = 'noopener noreferrer';
		displayName.textContent = post.author.displayName || post.author.handle;
		authorInfo.appendChild(displayName);

		const handle = document.createElement('a');
		handle.className = 'juttu-handle';
		handle.href = bskyProfileUrl;
		handle.target = '_blank';
		handle.rel = 'noopener noreferrer';
		handle.textContent = `@${post.author.handle}`;
		authorInfo.appendChild(handle);

		header.appendChild(authorInfo);

		const timeLink = document.createElement('a');
		timeLink.className = 'juttu-time-link';
		timeLink.href = bskyPostUrl;
		timeLink.target = '_blank';
		timeLink.rel = 'noopener noreferrer';
		timeLink.textContent = formatRelativeTime(post.indexedAt);
		timeLink.title = new Date(post.indexedAt).toLocaleString();
		header.appendChild(timeLink);
		comment.appendChild(header);

		// Body
		const body = document.createElement('div');
		body.className = 'juttu-comment-body';
		const p = document.createElement('p');
		p.style.margin = '0';
		p.appendChild(renderRichText(post.record.text, post.record.facets));
		body.appendChild(p);
		comment.appendChild(body);

		// Images
		if (post.embed?.$type === 'app.bsky.embed.images#view' && post.embed.images?.length) {
			const images = document.createElement('div');
			images.className = 'juttu-comment-images';
			for (const image of post.embed.images) {
				const link = document.createElement('a');
				link.className = 'juttu-comment-image-link';
				link.href = bskyPostUrl;
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				const img = document.createElement('img');
				img.className = 'juttu-comment-image';
				img.src = image.thumb;
				img.alt = image.alt || 'Embedded image';
				img.loading = 'lazy';
				link.appendChild(img);
				images.appendChild(link);
			}
			comment.appendChild(images);
		}

		// Actions — use live viewerState, not stale post.viewer
		const state = this.viewerState.get(post.uri) ?? {};
		const isLiked = !!state.likeUri;
		const isReposted = !!state.repostUri;
		const counts = this.localCounts.get(post.uri) ?? { likes: post.likeCount ?? 0, reposts: post.repostCount ?? 0, replies: post.replyCount ?? 0 };

		const actions = document.createElement('div');
		actions.className = 'juttu-comment-actions';

		const likeBtn = document.createElement('button');
		likeBtn.className = 'juttu-like-btn';
		likeBtn.dataset.liked = String(isLiked);
		likeBtn.dataset.uri = post.uri;
		likeBtn.dataset.cid = post.cid;
		likeBtn.title = 'Like';
		likeBtn.innerHTML = SVG_LIKE;
		const likeCount = document.createElement('span');
		likeCount.className = 'juttu-like-count';
		likeCount.textContent = String(counts.likes);
		likeBtn.appendChild(likeCount);
		actions.appendChild(likeBtn);

		const repostBtn = document.createElement('button');
		repostBtn.className = 'juttu-repost-btn';
		repostBtn.dataset.reposted = String(isReposted);
		repostBtn.dataset.uri = post.uri;
		repostBtn.dataset.cid = post.cid;
		repostBtn.title = 'Repost';
		repostBtn.innerHTML = SVG_REPOST;
		const repostCount = document.createElement('span');
		repostCount.className = 'juttu-repost-count';
		repostCount.textContent = String(counts.reposts);
		repostBtn.appendChild(repostCount);
		actions.appendChild(repostBtn);

		const replyBtn = document.createElement('button');
		replyBtn.className = 'juttu-reply-btn';
		replyBtn.dataset.uri = post.uri;
		replyBtn.title = 'Reply';
		replyBtn.innerHTML = SVG_REPLY;
		const replyCount = document.createElement('span');
		replyCount.className = 'juttu-reply-count';
		replyCount.textContent = String(counts.replies);
		replyBtn.appendChild(replyCount);
		actions.appendChild(replyBtn);

		const bskyLink = document.createElement('a');
		bskyLink.className = 'juttu-bsky-link';
		bskyLink.href = bskyPostUrl;
		bskyLink.target = '_blank';
		bskyLink.rel = 'noopener noreferrer';
		bskyLink.title = 'View on Bluesky';
		bskyLink.innerHTML = SVG_BSKY;
		actions.appendChild(bskyLink);

		comment.appendChild(actions);

		// Nested replies
		const nestedReplies = (threadView.replies ?? []).filter(
			(r): r is ThreadViewPost => r.$type === 'app.bsky.feed.defs#threadViewPost'
		);
		if (nestedReplies.length > 0) {
			const repliesContainer = document.createElement('div');
			repliesContainer.className = 'juttu-replies';
			const visibleCount = this.pagination.visibleReplies.get(post.uri) ?? NESTED_PAGE_SIZE;
			const sorted = sortReplies(nestedReplies, this.sortOrder);
			for (const reply of sorted.slice(0, visibleCount)) {
				repliesContainer.appendChild(this.renderComment(reply, depth + 1));
			}
			const hiddenCount = sorted.length - visibleCount;
			if (hiddenCount > 0) {
				const showMore = document.createElement('button');
				showMore.className = 'juttu-show-replies-btn';
				showMore.dataset.uri = post.uri;
				showMore.textContent = `Show ${Math.min(hiddenCount, NESTED_PAGE_SIZE)} more repl${hiddenCount === 1 ? 'y' : 'ies'}`;
				repliesContainer.appendChild(showMore);
			}
			comment.appendChild(repliesContainer);
		}

		return comment;
	}

	// ─── Login ───────────────────────────────────────────────────────────────────

	private getComposer(): HTMLElement | null {
		return (
			this.container.querySelector<HTMLElement>('.juttu-composer') ??
			this.container.querySelector<HTMLElement>('.juttu-linking')
		);
	}

	private openLoginPopup(intent: 'comment' | 'setup' = 'comment', hint?: string): void {
		if (this.loginPollInterval !== null) {
			try { this.loginPopup?.focus(); } catch { /* ignore */ }
			return;
		}
		this.loginIntent = intent;

		if (intent === 'setup' && hint) {
			// Owner login: the DID is already known, so kick off the OAuth flow directly and
			// skip the generic handle-entry page. Open the popup synchronously (so it isn't
			// blocked), then point it at the auth-server redirect once we have it.
			this.loginPopup = window.open('about:blank', 'juttu-auth', JuttuWidget.POPUP_FEATURES);
			try { this.loginPopup?.document.write('<p style="font-family:system-ui;padding:1rem">Signing in…</p>'); } catch { /* ignore */ }
			this.beginOwnerLogin(hint);
			return;
		}

		// Reader login: the generic page collects a handle.
		this.loginPopup = window.open(
			`${this.config.apiUrl}/login?intent=comment`,
			'juttu-auth',
			JuttuWidget.POPUP_FEATURES
		);
		this.startLoginPolling();
	}

	private async beginOwnerLogin(did: string): Promise<void> {
		try {
			const res = await fetch(`${this.config.apiUrl}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ handle: did, intent: 'setup' })
			}).then(this.checkApiResponse);
			const data = await res.json() as { redirect_url: string };
			if (!this.loginPopup || this.loginPopup.closed) throw new Error('Popup was blocked — allow popups and try again');
			this.loginPopup.location.href = data.redirect_url;
			this.startLoginPolling();
		} catch (err) {
			try { this.loginPopup?.close(); } catch { /* ignore */ }
			this.loginPopup = null;
			const errEl = document.createElement('p');
			errEl.className = 'juttu-linking-error';
			errEl.textContent = err instanceof Error ? err.message : 'Login failed';
			this.container.querySelector('.juttu-linking')?.appendChild(errEl);
		}
	}

	private startLoginPolling(): void {
		this.loginPollStartTime = Date.now();
		this.popupClosedAt = 0;
		this.loginPollInterval = setInterval(() => this.pollForLogin(), LOGIN_POLL_INTERVAL_MS);
	}

	private async pollForLogin(): Promise<void> {
		const elapsed = Date.now() - this.loginPollStartTime;
		if (elapsed > LOGIN_POLL_TIMEOUT_MS) {
			this.cancelLogin();
			return;
		}
		const user = await checkCurrentUser(this.config.apiUrl);
		// During an owner setup login, an existing reader session would be detected immediately;
		// wait until the session actually carries owner scopes before completing.
		if (user && (this.loginIntent !== 'setup' || user.scopeTier === 'owner')) {
			await this.completeLogin(user);
		} else if (this.loginPopup?.closed) {
			// The popup closes itself after the OAuth callback sets the session cookie.
			// Give a grace period for the cookie to become readable before giving up.
			if (!this.popupClosedAt) this.popupClosedAt = Date.now();
			if (Date.now() - this.popupClosedAt > 5000) this.cancelLogin();
		}
	}

	private async completeLogin(user: CurrentUser): Promise<void> {
		if (this.loginPollInterval !== null) {
			clearInterval(this.loginPollInterval);
			this.loginPollInterval = null;
		}
		try { this.loginPopup?.close(); } catch { /* cross-origin popup close may throw */ }
		this.loginPopup = null;

		// Fetch profile (avatar + display name) from Bluesky public API
		const profile = await fetchUserProfile(user.handle);
		this.currentUser = { ...user, ...profile };

		if (this.documentAtUri) {
			// Linking mode: advance to the appropriate step
			await this.advanceLinkingAfterAuth();
		} else {
			// Normal mode: swap composer in-place, then run any pending action
			const composer = this.getComposer();
			if (composer) {
				this.clearMentionState();
				composer.innerHTML = '';
				composer.appendChild(this.makeComposeArea());
			}
			const pending = this.pendingAction;
			this.pendingAction = null;
			await pending?.();

			// Refresh viewer state so already-liked/reposted buttons show as colored
			if (this.rootPostUri) {
				const incoming = await fetchViewerStates(this.config.apiUrl, this.rootPostUri);
				for (const [uri, state] of incoming) {
					const existing = this.viewerState.get(uri);
					if (existing?.likeUri === 'pending' || existing?.repostUri === 'pending') continue;
					this.viewerState.set(uri, state);
				}
				this.renderWidget();
			}
		}
	}

	private cancelLogin(): void {
		this.pendingAction = null;
		if (this.loginPollInterval !== null) {
			clearInterval(this.loginPollInterval);
			this.loginPollInterval = null;
		}
		try { this.loginPopup?.close(); } catch { /* ignore */ }
		this.loginPopup = null;

		if (this.documentAtUri) {
			// Linking mode: stay on login step so user can retry
			this.linkingStep = 'login';
			this.renderLinkingUI();
		} else {
			const composer = this.getComposer();
			if (composer) {
				this.clearMentionState();
				composer.innerHTML = '';
				composer.appendChild(this.makeComposeArea());
			}
		}
	}

	// ─── Publication resolution ───────────────────────────────────────────────────

	// Called once the owner is authenticated in linking mode. Mode A (record exists) goes
	// straight to picking a post. Mode B (we'll create the record) first resolves the site's
	// publication so the new document is linked to it.
	private async advanceLinkingAfterAuth(): Promise<void> {
		if (this.currentUser?.scopeTier !== 'owner') {
			// Authenticated, but the session lacks write scopes (e.g. a prior reader login).
			// Route through an elevated login to obtain owner scopes before linking.
			this.linkingStep = 'login';
			this.renderLinkingUI();
			return;
		}
		if (this.documentRecord) {
			this.linkingStep = 'choose-method';
			this.renderLinkingUI();
			return;
		}
		await this.resolvePublication();
		this.renderLinkingUI();
	}

	// Reads the site's publication from the well-known file and sets the next linking step.
	// If the file declares a publication that the owner hasn't created yet, offer to create it;
	// otherwise continue to the article-details step. Any failure falls back to a loose document.
	private async resolvePublication(): Promise<void> {
		this.publicationUri = null;
		this.pendingPublicationUri = null;
		try {
			const uri = await fetchPublicationUri();
			const atUri = uri ? parseAtUri(uri) : null;
			if (atUri) {
				const pds = await resolveDid(atUri.did);
				const exists = (await fetchPublicationRecord(pds, atUri)) !== null;
				if (exists) {
					this.publicationUri = uri;
				} else if (atUri.did === this.currentUser?.did) {
					this.pendingPublicationUri = atUri;
					this.linkingStep = 'create-publication';
					return;
				}
			}
		} catch {
			// Network/resolution error — fall back to a loose document (site = origin).
		}
		this.linkingStep = 'metadata';
	}

	// ─── Logout ──────────────────────────────────────────────────────────────────

	private async handleLogout(): Promise<void> {
		try {
			await fetch(`${this.config.apiUrl}/auth/logout`, {
				method: 'POST',
				credentials: 'include'
			});
		} catch { /* ignore network errors on logout */ }

		this.currentUser = null;
		this.viewerState.clear();
		this.clearMentionState();
		this.renderWidget();
	}

	// ─── Auth guard ──────────────────────────────────────────────────────────────

	private async resolveAuth(action?: () => Promise<void>): Promise<void> {
		if (this.currentUser) {
			await action?.();
			return;
		}
		const user = await checkCurrentUser(this.config.apiUrl);
		if (user) {
			const profile = await fetchUserProfile(user.handle);
			this.currentUser = { ...user, ...profile };
			if (this.documentAtUri) {
				await this.advanceLinkingAfterAuth();
			} else {
				const composer = this.getComposer();
				if (composer) {
					this.clearMentionState();
					composer.innerHTML = '';
					composer.appendChild(this.makeComposeArea());
				}
				await action?.();

				// Refresh viewer state so already-liked/reposted buttons show as colored
				if (this.rootPostUri) {
					const incoming = await fetchViewerStates(this.config.apiUrl, this.rootPostUri);
					for (const [uri, state] of incoming) {
						const existing = this.viewerState.get(uri);
						if (existing?.likeUri === 'pending' || existing?.repostUri === 'pending') continue;
						this.viewerState.set(uri, state);
					}
					this.renderWidget();
				}
			}
		} else {
			if (this.documentAtUri) {
				this.linkingStep = 'login';
				this.renderLinkingUI();
			} else {
				this.pendingAction = action ?? null;
				this.openLoginPopup();
			}
		}
	}

	// ─── Like ────────────────────────────────────────────────────────────────────

	private async handleLike(btn: HTMLElement): Promise<void> {
		const uri = btn.dataset.uri;
		const cid = btn.dataset.cid;
		if (!uri || !cid) return;

		const actionKey = `like:${uri}`;
		if (this.pendingActions.has(actionKey)) return;
		this.pendingActions.add(actionKey);

		const state = this.viewerState.get(uri) ?? {};
		const wasLiked = !!state.likeUri;
		const counts = this.localCounts.get(uri);
		const prevLikes = counts?.likes ?? 0;

		// Optimistic update
		const newLiked = !wasLiked;
		const newLikes = Math.max(0, prevLikes + (newLiked ? 1 : -1));
		btn.dataset.liked = String(newLiked);
		const countSpan = btn.querySelector<HTMLElement>('.juttu-like-count');
		if (countSpan) countSpan.textContent = String(newLikes);
		if (counts) counts.likes = newLikes;
		this.viewerState.set(uri, { ...state, likeUri: newLiked ? 'pending' : undefined });

		try {
			if (wasLiked && state.likeUri) {
				const rkey = state.likeUri.split('/').pop()!;
				await fetch(`${this.config.apiUrl}/bsky/like`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ rkey })
				}).then(this.checkApiResponse);
				this.viewerState.set(uri, { ...state, likeUri: undefined });
			} else {
				const res = await fetch(`${this.config.apiUrl}/bsky/like`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ uri, cid })
				}).then(this.checkApiResponse);
				const data = await res.json() as { uri: string };
				this.viewerState.set(uri, { ...state, likeUri: data.uri });
			}
		} catch (err) {
			// Roll back
			btn.dataset.liked = String(wasLiked);
			if (counts) counts.likes = prevLikes;
			if (countSpan) countSpan.textContent = String(prevLikes);
			this.viewerState.set(uri, state);
			this.showActionError(btn, err instanceof Error ? err.message : 'Action failed');
		} finally {
			this.pendingActions.delete(actionKey);
		}
	}

	// ─── Repost ──────────────────────────────────────────────────────────────────

	private async handleRepost(btn: HTMLElement): Promise<void> {
		const uri = btn.dataset.uri;
		const cid = btn.dataset.cid;
		if (!uri || !cid) return;

		const actionKey = `repost:${uri}`;
		if (this.pendingActions.has(actionKey)) return;
		this.pendingActions.add(actionKey);

		const state = this.viewerState.get(uri) ?? {};
		const wasReposted = !!state.repostUri;
		const counts = this.localCounts.get(uri);
		const prevReposts = counts?.reposts ?? 0;

		// Optimistic update
		const newReposted = !wasReposted;
		const newReposts = Math.max(0, prevReposts + (newReposted ? 1 : -1));
		btn.dataset.reposted = String(newReposted);
		const countSpan = btn.querySelector<HTMLElement>('.juttu-repost-count');
		if (countSpan) countSpan.textContent = String(newReposts);
		if (counts) counts.reposts = newReposts;
		this.viewerState.set(uri, { ...state, repostUri: newReposted ? 'pending' : undefined });

		try {
			if (wasReposted && state.repostUri) {
				const rkey = state.repostUri.split('/').pop()!;
				await fetch(`${this.config.apiUrl}/bsky/repost`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ rkey })
				}).then(this.checkApiResponse);
				this.viewerState.set(uri, { ...state, repostUri: undefined });
			} else {
				const res = await fetch(`${this.config.apiUrl}/bsky/repost`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ uri, cid })
				}).then(this.checkApiResponse);
				const data = await res.json() as { uri: string };
				this.viewerState.set(uri, { ...state, repostUri: data.uri });
			}
		} catch (err) {
			// Roll back
			btn.dataset.reposted = String(wasReposted);
			if (counts) counts.reposts = prevReposts;
			if (countSpan) countSpan.textContent = String(prevReposts);
			this.viewerState.set(uri, state);
			this.showActionError(btn, err instanceof Error ? err.message : 'Action failed');
		} finally {
			this.pendingActions.delete(actionKey);
		}
	}

	// ─── Reply form ──────────────────────────────────────────────────────────────

	private handleToggleReplyForm(uri: string): void {
		if (this.openReplyFormUri === uri) {
			this.closeReplyForm();
			return;
		}
		this.closeReplyForm();

		const comment = this.container.querySelector<HTMLElement>(`.juttu-comment[data-uri="${CSS.escape(uri)}"]`);
		if (!comment) return;

		const form = document.createElement('div');
		form.className = 'juttu-reply-form';

		const textarea = document.createElement('textarea');
		textarea.className = 'juttu-reply-input';
		textarea.placeholder = 'Write a reply…';
		textarea.rows = 2;
		const { wrap: replyWrap, backdrop: replyBackdrop } = this.buildEditorWrap(textarea);
		form.appendChild(replyWrap);
		setTimeout(() => this.syncBackdropStyles(replyBackdrop, textarea), 0);
		textarea.addEventListener('input', () => {
			this.updateBackdrop(replyBackdrop, textarea.value);
			this.handleMentionInput(textarea);
		});
		textarea.addEventListener('scroll', () => this.syncScroll(replyBackdrop, textarea));
		textarea.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.dismissAutocomplete(textarea); });

		const formActions = document.createElement('div');
		formActions.className = 'juttu-reply-form-actions';

		const hint = document.createElement('span');
		hint.className = 'juttu-reply-hint';
		hint.textContent = 'Reply posts to Bluesky';
		formActions.appendChild(hint);

		const cancelBtn = document.createElement('button');
		cancelBtn.className = 'juttu-reply-cancel';
		cancelBtn.textContent = 'Cancel';
		formActions.appendChild(cancelBtn);

		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-reply-submit';
		submitBtn.textContent = 'Reply';
		submitBtn.disabled = true;
		formActions.appendChild(submitBtn);

		form.appendChild(formActions);

		// Insert after .juttu-comment-actions
		const actionsEl = comment.querySelector('.juttu-comment-actions');
		if (actionsEl?.nextSibling) {
			comment.insertBefore(form, actionsEl.nextSibling);
		} else {
			comment.appendChild(form);
		}

		this.openReplyFormUri = uri;
		textarea.focus();
	}

	private closeReplyForm(): void {
		if (!this.openReplyFormUri) return;
		const form = this.container.querySelector('.juttu-reply-form');
		form?.remove();
		this.openReplyFormUri = null;
	}

	// ─── Post comment ────────────────────────────────────────────────────────────

	private async handlePost(): Promise<void> {
		const textarea = this.container.querySelector<HTMLTextAreaElement>('.juttu-compose-input');
		const submitBtn = this.container.querySelector<HTMLButtonElement>('.juttu-submit-btn');
		if (!textarea || !submitBtn) return;

		const text = textarea.value.trim();
		if (!text || !this.rootPostUri || !this.rootPostCid) return;

		submitBtn.disabled = true;
		submitBtn.textContent = 'Posting…';
		this.container.querySelector('.juttu-post-error')?.remove();

		try {
			const res = await fetch(`${this.config.apiUrl}/bsky/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					text,
					reply: {
						root: { uri: this.rootPostUri, cid: this.rootPostCid },
						parent: { uri: this.rootPostUri, cid: this.rootPostCid }
					}
				})
			}).then(this.checkApiResponse);
			const data = await res.json() as { uri: string; cid: string };

			textarea.value = '';
			const backdrop = textarea.closest<HTMLElement>('.juttu-editor-wrap')?.querySelector<HTMLElement>('.juttu-editor-backdrop');
			if (backdrop) this.updateBackdrop(backdrop, '');
			submitBtn.disabled = true;
			submitBtn.textContent = 'Post comment';

			// Inject synthetic comment immediately (read-your-own-writes)
			if (this.threadData && this.currentUser) {
				const synthetic = this.makeSyntheticReply(data.uri, data.cid, text);
				if (!this.threadData.replies) this.threadData.replies = [];
				this.threadData.replies.push(synthetic);
				this.syncLocalCounts(this.threadData);
				this.renderWidget();
			}
			setTimeout(() => this.refetchAndRender(), POST_REFETCH_DELAY_MS);
		} catch (err) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Post comment';
			const errEl = document.createElement('div');
			errEl.className = 'juttu-post-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to post';
			submitBtn.insertAdjacentElement('afterend', errEl);
		}
	}

	// ─── Post reply ──────────────────────────────────────────────────────────────

	private async handleSubmitReply(parentUri: string): Promise<void> {
		const form = this.container.querySelector<HTMLElement>('.juttu-reply-form');
		if (!form) return;
		const textarea = form.querySelector<HTMLTextAreaElement>('.juttu-reply-input');
		const submitBtn = form.querySelector<HTMLButtonElement>('.juttu-reply-submit');
		if (!textarea || !submitBtn) return;

		const text = textarea.value.trim();
		if (!text || !this.rootPostUri || !this.rootPostCid) return;

		const parentPost = findPostInThread(this.threadData, parentUri);
		if (!parentPost) return;

		submitBtn.disabled = true;
		submitBtn.textContent = 'Replying…';
		form.querySelector('.juttu-reply-error')?.remove();

		try {
			const res = await fetch(`${this.config.apiUrl}/bsky/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					text,
					reply: {
						root: { uri: this.rootPostUri, cid: this.rootPostCid },
						parent: { uri: parentPost.uri, cid: parentPost.cid }
					}
				})
			}).then(this.checkApiResponse);
			const data = await res.json() as { uri: string; cid: string };

			this.closeReplyForm();

			// Inject synthetic reply immediately (read-your-own-writes)
			if (this.threadData && this.currentUser) {
				const parentThread = this.findThreadNode(this.threadData, parentUri);
				if (parentThread) {
					const synthetic = this.makeSyntheticReply(data.uri, data.cid, text);
					if (!parentThread.replies) parentThread.replies = [];
					parentThread.replies.push(synthetic);
					this.syncLocalCounts(this.threadData);
					this.renderWidget();
				}
			}
			setTimeout(() => this.refetchAndRender(), POST_REFETCH_DELAY_MS);
		} catch (err) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Reply';
			const errEl = document.createElement('div');
			errEl.className = 'juttu-reply-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to post reply';
			form.appendChild(errEl);
		}
	}

	private makeSyntheticReply(uri: string, cid: string, text: string): ThreadViewPost {
		const user = this.currentUser!;
		return {
			$type: 'app.bsky.feed.defs#threadViewPost',
			post: {
				uri,
				cid,
				author: {
					did: user.did,
					handle: user.handle,
					displayName: user.displayName,
					avatar: user.avatar
				},
				record: { text, createdAt: new Date().toISOString() },
				indexedAt: new Date().toISOString(),
				likeCount: 0,
				repostCount: 0,
				replyCount: 0
			},
			replies: []
		};
	}

	private findThreadNode(thread: ThreadViewPost, uri: string): ThreadViewPost | null {
		if (thread.post.uri === uri) return thread;
		for (const reply of thread.replies ?? []) {
			if (reply.$type === 'app.bsky.feed.defs#threadViewPost') {
				const found = this.findThreadNode(reply as ThreadViewPost, uri);
				if (found) return found;
			}
		}
		return null;
	}

	// ─── Re-fetch after posting ──────────────────────────────────────────────────

	private async refetchAndRender(): Promise<void> {
		if (!this.rootPostUri) return;
		try {
			const thread = await fetchThread(this.rootPostUri);
			this.threadData = thread;

			// Merge viewer state: keep locally-touched entries, adopt server for untouched posts
			const serverState: Map<string, ViewerState> = new Map();
			collectViewerState(thread, serverState);
			const merged: Map<string, ViewerState> = new Map();
			for (const [uri, server] of serverState) {
				const local = this.viewerState.get(uri);
				if (local && (local.likeUri !== undefined || local.repostUri !== undefined)) {
					// We have local state for this post — keep it unless it's still 'pending'
					merged.set(uri, {
						likeUri: local.likeUri === 'pending' ? server.likeUri : local.likeUri,
						repostUri: local.repostUri === 'pending' ? server.repostUri : local.repostUri
					});
				} else {
					merged.set(uri, server);
				}
			}
			this.viewerState = merged;

			// Sync counts from server, but preserve local deltas for posts we've touched
			const prevCounts = this.localCounts;
			this.syncLocalCounts(thread);
			for (const [uri, local] of this.viewerState) {
				if (!local.likeUri && !local.repostUri) continue;
				const prev = prevCounts.get(uri);
				const now = this.localCounts.get(uri);
				if (prev && now) {
					// If we locally adjusted likes/reposts, carry the delta forward
					// when the server hasn't caught up yet
					const serverLikes = (findPostInThread(thread, uri)?.likeCount ?? 0);
					const serverReposts = (findPostInThread(thread, uri)?.repostCount ?? 0);
					if (now.likes === serverLikes && prev.likes !== serverLikes) {
						now.likes = prev.likes;
					}
					if (now.reposts === serverReposts && prev.reposts !== serverReposts) {
						now.reposts = prev.reposts;
					}
				}
			}

			this.renderWidget();
		} catch { /* silently ignore — stale view is acceptable */ }
	}

	// ─── Editor backdrop + mention autocomplete ──────────────────────────────────

	private buildEditorWrap(textarea: HTMLTextAreaElement): { wrap: HTMLElement; backdrop: HTMLElement } {
		const wrap = document.createElement('div');
		wrap.className = 'juttu-editor-wrap';
		const backdrop = document.createElement('div');
		backdrop.className = 'juttu-editor-backdrop';
		backdrop.setAttribute('aria-hidden', 'true');
		wrap.appendChild(backdrop);
		wrap.appendChild(textarea);
		return { wrap, backdrop };
	}

	private syncBackdropStyles(backdrop: HTMLElement, textarea: HTMLTextAreaElement): void {
		const cs = window.getComputedStyle(textarea);
		for (const prop of [
			'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
			'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
			'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'
		] as const) {
			backdrop.style[prop] = cs[prop];
		}
	}

	private updateBackdrop(backdrop: HTMLElement, text: string): void {
		while (backdrop.firstChild) backdrop.removeChild(backdrop.firstChild);
		for (const seg of buildSegments(text)) {
			if (seg.type === 'plain') {
				backdrop.appendChild(document.createTextNode(seg.text));
			} else {
				const span = document.createElement('span');
				span.className = `juttu-editor-highlight-${seg.type}`;
				span.textContent = seg.text;
				backdrop.appendChild(span);
			}
		}
		// Trailing newline ensures backdrop height matches textarea when text ends with newline
		backdrop.appendChild(document.createTextNode('\n'));
	}

	private syncScroll(backdrop: HTMLElement, textarea: HTMLTextAreaElement): void {
		backdrop.scrollTop = textarea.scrollTop;
	}

	private clearMentionState(): void {
		if (this.mentionDebounceTimer !== null) {
			clearTimeout(this.mentionDebounceTimer);
			this.mentionDebounceTimer = null;
		}
		this.activeSuggestionsTextarea = null;
	}

	private handleMentionInput(textarea: HTMLTextAreaElement): void {
		const cursor = textarea.selectionStart ?? textarea.value.length;
		const before = textarea.value.slice(0, cursor);
		const match = before.match(/@([a-zA-Z0-9][a-zA-Z0-9.-]*)$/);
		if (match) {
			this.activeSuggestionsTextarea = textarea;
			if (this.mentionDebounceTimer !== null) clearTimeout(this.mentionDebounceTimer);
			this.mentionDebounceTimer = setTimeout(() => {
				void this.fetchMentionSuggestions(match[1], textarea);
			}, 300);
		} else {
			this.dismissAutocomplete(textarea);
		}
	}

	private async fetchMentionSuggestions(query: string, textarea: HTMLTextAreaElement): Promise<void> {
		if (this.activeSuggestionsTextarea !== textarea) return;
		try {
			const res = await fetch(
				`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${encodeURIComponent(query)}&limit=4`
			);
			if (!res.ok || this.activeSuggestionsTextarea !== textarea) return;
			const data = await res.json() as { actors: Array<{ did: string; handle: string; displayName?: string; avatar?: string }> };
			this.renderAutocomplete(data.actors, textarea);
		} catch {
			this.dismissAutocomplete(textarea);
		}
	}

	private renderAutocomplete(
		actors: Array<{ did: string; handle: string; displayName?: string; avatar?: string }>,
		textarea: HTMLTextAreaElement
	): void {
		const wrap = textarea.closest<HTMLElement>('.juttu-editor-wrap');
		if (!wrap) return;
		wrap.querySelector('.juttu-autocomplete')?.remove();
		if (actors.length === 0) return;

		const ul = document.createElement('ul');
		ul.className = 'juttu-autocomplete';

		for (const actor of actors) {
			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.className = 'juttu-autocomplete-item';
			btn.type = 'button';

			if (actor.avatar) {
				const img = document.createElement('img');
				img.className = 'juttu-autocomplete-avatar';
				img.src = actor.avatar;
				img.alt = '';
				btn.appendChild(img);
			} else {
				const ph = document.createElement('div');
				ph.className = 'juttu-autocomplete-avatar';
				ph.style.background = 'var(--juttu-border-color)';
				btn.appendChild(ph);
			}

			const info = document.createElement('div');
			if (actor.displayName) {
				const name = document.createElement('div');
				name.style.fontWeight = '600';
				name.textContent = actor.displayName;
				info.appendChild(name);
			}
			const handleEl = document.createElement('div');
			handleEl.className = 'juttu-autocomplete-handle';
			handleEl.textContent = `@${actor.handle}`;
			info.appendChild(handleEl);
			btn.appendChild(info);

			btn.addEventListener('mousedown', (e) => {
				e.preventDefault();
				this.applyMentionSuggestion(actor.handle, textarea);
			});

			li.appendChild(btn);
			ul.appendChild(li);
		}

		wrap.appendChild(ul);
	}

	private applyMentionSuggestion(handle: string, textarea: HTMLTextAreaElement): void {
		const cursor = textarea.selectionStart ?? textarea.value.length;
		const before = textarea.value.slice(0, cursor).replace(/@([a-zA-Z0-9][a-zA-Z0-9.-]*)$/, `@${handle} `);
		textarea.value = before + textarea.value.slice(cursor);
		const newCursor = before.length;
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(newCursor, newCursor);
		}, 0);
		this.dismissAutocomplete(textarea);
		const backdrop = textarea.closest<HTMLElement>('.juttu-editor-wrap')?.querySelector<HTMLElement>('.juttu-editor-backdrop');
		if (backdrop) this.updateBackdrop(backdrop, textarea.value);
	}

	private dismissAutocomplete(textarea: HTMLTextAreaElement): void {
		if (this.mentionDebounceTimer !== null) {
			clearTimeout(this.mentionDebounceTimer);
			this.mentionDebounceTimer = null;
		}
		this.activeSuggestionsTextarea = null;
		textarea.closest<HTMLElement>('.juttu-editor-wrap')?.querySelector('.juttu-autocomplete')?.remove();
	}

	// ─── Utilities ───────────────────────────────────────────────────────────────

	private checkApiResponse = async (res: Response): Promise<Response> => {
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
		}
		return res;
	};

	private showActionError(nearEl: HTMLElement, message: string): void {
		nearEl.parentElement?.querySelector('.juttu-action-error')?.remove();
		const errEl = document.createElement('div');
		errEl.className = 'juttu-action-error';
		errEl.textContent = message;
		nearEl.insertAdjacentElement('afterend', errEl);
		setTimeout(() => errEl.remove(), 4000);
	}

	// ─── Document Linking ────────────────────────────────────────────────────────

	private renderLinkingUI(): void {
		this.container.innerHTML = '';
		const root = this.makeRoot();

		const linking = document.createElement('div');
		linking.className = 'juttu-linking';

		switch (this.linkingStep) {
			case 'setup':
				linking.appendChild(this.makeLinkingSetup());
				break;
			case 'login':
				linking.appendChild(this.makeLinkingLoginForm());
				break;
			case 'create-publication':
				linking.appendChild(this.makeLinkingCreatePublication());
				break;
			case 'metadata':
				linking.appendChild(this.makeLinkingMetadata());
				break;
			case 'choose-method':
				linking.appendChild(this.makeLinkingChooseMethod());
				break;
			case 'write-post':
				linking.appendChild(this.makeLinkingWritePost());
				break;
			case 'select-post':
				linking.appendChild(this.makeLinkingSelectPost());
				break;
		}

		root.appendChild(linking);

		root.addEventListener('click', (e) => this.handleLinkingClick(e));

		const footer = document.createElement('div');
		footer.className = 'juttu-footer';
		const poweredBy = document.createElement('a');
		poweredBy.className = 'juttu-powered-by';
		poweredBy.href = 'https://juttu.app';
		poweredBy.target = '_blank';
		poweredBy.rel = 'noopener noreferrer';
		poweredBy.textContent = 'Powered by Juttu';
		footer.appendChild(poweredBy);
		root.appendChild(footer);

		this.container.appendChild(root);
	}

	private makeLinkingSetup(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		const desc = document.createElement('p');
		desc.className = 'juttu-linking-desc';
		if (this.documentRecord) {
			title.textContent = 'Comments not linked yet';
			desc.textContent = 'Link this article to a Bluesky post to enable the comment thread.';
		} else {
			title.textContent = 'Comments not set up yet';
			desc.textContent = 'Set up a Bluesky-powered comment thread for this article.';
		}
		el.appendChild(title);
		el.appendChild(desc);
		const btn = document.createElement('button');
		btn.className = 'juttu-linking-start-btn';
		btn.textContent = this.documentRecord ? 'Link comments' : 'Set up comments';
		el.appendChild(btn);
		return el;
	}

	private makeLinkingLoginForm(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Sign in as the document owner';
		el.appendChild(title);

		const btn = document.createElement('button');
		btn.className = 'juttu-linking-login-btn';
		btn.textContent = this.authorHandle ? `Sign in as @${this.authorHandle} →` : 'Login with Bluesky →';
		el.appendChild(btn);
		return el;
	}

	private makeLinkingCreatePublication(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Set up your publication';
		el.appendChild(title);

		const desc = document.createElement('p');
		desc.className = 'juttu-linking-desc';
		desc.textContent =
			'Your site declares a standard.site publication that isn’t in your repository yet. Create it so this article is part of your publication.';
		el.appendChild(desc);

		const nameField = document.createElement('div');
		nameField.className = 'juttu-linking-field';
		const nameLabel = document.createElement('label');
		nameLabel.className = 'juttu-linking-label';
		nameLabel.textContent = 'Publication name *';
		nameField.appendChild(nameLabel);
		const nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.className = 'juttu-linking-input juttu-linking-pub-name-input';
		nameInput.placeholder = 'My Blog';
		nameInput.value = window.location.hostname;
		nameField.appendChild(nameInput);
		el.appendChild(nameField);

		const descField = document.createElement('div');
		descField.className = 'juttu-linking-field';
		const descLabel = document.createElement('label');
		descLabel.className = 'juttu-linking-label';
		descLabel.textContent = 'Description (optional)';
		descField.appendChild(descLabel);
		const descInput = document.createElement('input');
		descInput.type = 'text';
		descInput.className = 'juttu-linking-input juttu-linking-pub-desc-input';
		descInput.placeholder = 'What this publication is about';
		descField.appendChild(descInput);
		el.appendChild(descField);

		const actions = document.createElement('div');
		actions.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.5rem;';
		const skipBtn = document.createElement('button');
		skipBtn.className = 'juttu-linking-skip-pub-btn';
		skipBtn.style.cssText = 'background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.4rem 0.75rem;cursor:pointer;font-size:1rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);';
		skipBtn.textContent = 'Skip';
		actions.appendChild(skipBtn);
		const createBtn = document.createElement('button');
		createBtn.className = 'juttu-linking-continue-btn juttu-linking-create-pub-btn';
		createBtn.textContent = 'Create publication';
		createBtn.disabled = !nameInput.value.trim();
		actions.appendChild(createBtn);
		el.appendChild(actions);

		nameInput.addEventListener('input', () => {
			createBtn.disabled = !nameInput.value.trim();
		});

		return el;
	}

	private makeLinkingMetadata(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Article details';
		el.appendChild(title);

		const titleField = document.createElement('div');
		titleField.className = 'juttu-linking-field';
		const titleLabel = document.createElement('label');
		titleLabel.className = 'juttu-linking-label';
		titleLabel.textContent = 'Title *';
		titleField.appendChild(titleLabel);
		const titleInput = document.createElement('input');
		titleInput.type = 'text';
		titleInput.className = 'juttu-linking-input juttu-linking-title-input';
		titleInput.placeholder = 'Article title';
		titleInput.value = this.linkingTitle || getPageTitle() || '';
		titleField.appendChild(titleInput);
		el.appendChild(titleField);

		const descField = document.createElement('div');
		descField.className = 'juttu-linking-field';
		const descLabel = document.createElement('label');
		descLabel.className = 'juttu-linking-label';
		descLabel.textContent = 'Description (optional)';
		descField.appendChild(descLabel);
		const descInput = document.createElement('input');
		descInput.type = 'text';
		descInput.className = 'juttu-linking-input juttu-linking-desc-input';
		descInput.placeholder = 'Short description';
		descInput.value = this.linkingDescription || getPageDescription() || '';
		descField.appendChild(descInput);
		el.appendChild(descField);

		// Path only makes sense combined with a publication's `site` (a loose document's `site`
		// is already the full origin, so a path would duplicate it).
		if (this.publicationUri) {
			const pathField = document.createElement('div');
			pathField.className = 'juttu-linking-field';
			const pathLabel = document.createElement('label');
			pathLabel.className = 'juttu-linking-label';
			pathLabel.textContent = 'Path';
			pathField.appendChild(pathLabel);
			const pathInput = document.createElement('input');
			pathInput.type = 'text';
			pathInput.className = 'juttu-linking-input juttu-linking-path-input';
			pathInput.placeholder = '/blog/my-article';
			pathInput.value = this.linkingPath || window.location.pathname;
			pathField.appendChild(pathInput);
			el.appendChild(pathField);
		}

		const ogImageUrl = getOgImageUrl();
		if (ogImageUrl) {
			const coverField = document.createElement('label');
			coverField.className = 'juttu-linking-cover-field';
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.className = 'juttu-linking-cover-checkbox';
			checkbox.checked = this.includeCoverImage;
			coverField.appendChild(checkbox);
			const img = document.createElement('img');
			img.className = 'juttu-linking-cover-preview';
			img.src = ogImageUrl;
			img.alt = '';
			coverField.appendChild(img);
			const span = document.createElement('span');
			span.textContent = 'Use this image as the cover image';
			coverField.appendChild(span);
			el.appendChild(coverField);

			checkbox.addEventListener('change', () => { this.includeCoverImage = checkbox.checked; });
		}

		const continueBtn = document.createElement('button');
		continueBtn.className = 'juttu-linking-continue-btn';
		continueBtn.textContent = 'Continue';
		continueBtn.disabled = !titleInput.value.trim();
		el.appendChild(continueBtn);

		// Keep continue button state in sync with title input
		titleInput.addEventListener('input', () => {
			continueBtn.disabled = !titleInput.value.trim();
		});

		return el;
	}

	private makeLinkingChooseMethod(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Link a Bluesky post';
		el.appendChild(title);
		const desc = document.createElement('p');
		desc.className = 'juttu-linking-desc';
		desc.textContent = 'This post becomes the root of the comment thread.';
		el.appendChild(desc);

		const methods = document.createElement('div');
		methods.className = 'juttu-linking-methods';

		const writeBtn = document.createElement('button');
		writeBtn.className = 'juttu-linking-method-btn';
		writeBtn.dataset.method = 'write';
		const writeTitle = document.createElement('div');
		writeTitle.className = 'juttu-linking-method-title';
		writeTitle.textContent = 'Write a new post';
		const writeDesc = document.createElement('div');
		writeDesc.className = 'juttu-linking-method-desc';
		writeDesc.textContent = 'Compose a post to announce this article';
		writeBtn.appendChild(writeTitle);
		writeBtn.appendChild(writeDesc);
		methods.appendChild(writeBtn);

		const selectBtn = document.createElement('button');
		selectBtn.className = 'juttu-linking-method-btn';
		selectBtn.dataset.method = 'select';
		const selectTitle = document.createElement('div');
		selectTitle.className = 'juttu-linking-method-title';
		selectTitle.textContent = 'Use an existing post';
		const selectDesc = document.createElement('div');
		selectDesc.className = 'juttu-linking-method-desc';
		selectDesc.textContent = 'Pick from your recent Bluesky posts';
		selectBtn.appendChild(selectTitle);
		selectBtn.appendChild(selectDesc);
		methods.appendChild(selectBtn);

		el.appendChild(methods);
		return el;
	}

	private makeLinkingWritePost(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Write a post';
		el.appendChild(title);

		const textarea = document.createElement('textarea');
		textarea.className = 'juttu-linking-textarea';
		textarea.placeholder = 'Share this article on Bluesky…';
		el.appendChild(textarea);

		const actions = document.createElement('div');
		actions.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.5rem;';
		const backBtn = document.createElement('button');
		backBtn.className = 'juttu-linking-back-btn';
		backBtn.style.cssText = 'background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.4rem 0.75rem;cursor:pointer;font-size:1rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);';
		backBtn.textContent = '← Back';
		actions.appendChild(backBtn);
		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-linking-continue-btn juttu-linking-write-submit';
		submitBtn.textContent = 'Post & Link';
		submitBtn.disabled = true;
		actions.appendChild(submitBtn);
		el.appendChild(actions);

		textarea.addEventListener('input', () => {
			submitBtn.disabled = !textarea.value.trim();
		});

		return el;
	}

	private makeLinkingSelectPost(): HTMLElement {
		const el = document.createElement('div');
		const title = document.createElement('p');
		title.className = 'juttu-linking-title';
		title.textContent = 'Select a post';
		el.appendChild(title);

		const backBtn = document.createElement('button');
		backBtn.className = 'juttu-linking-back-btn';
		backBtn.style.cssText = 'background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.3rem 0.65rem;cursor:pointer;font-size:0.875rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);margin-bottom:0.75rem;';
		backBtn.textContent = '← Back';
		el.appendChild(backBtn);

		const list = document.createElement('div');
		list.className = 'juttu-linking-post-list';

		if (this.userPosts.length === 0) {
			const empty = document.createElement('p');
			empty.className = 'juttu-linking-spinner';
			empty.textContent = 'Loading posts…';
			list.appendChild(empty);
		} else {
			for (const post of this.userPosts) {
				const item = document.createElement('button');
				item.className = 'juttu-linking-post-item';
				item.dataset.uri = post.uri;
				item.dataset.cid = post.cid;
				const text = document.createElement('div');
				text.className = 'juttu-linking-post-text';
				text.textContent = post.text.length > 180 ? post.text.slice(0, 180) + '…' : post.text;
				const date = document.createElement('div');
				date.className = 'juttu-linking-post-date';
				date.textContent = formatRelativeTime(post.createdAt);
				item.appendChild(text);
				item.appendChild(date);
				list.appendChild(item);
			}
		}
		el.appendChild(list);
		return el;
	}

	private handleLinkingClick(e: MouseEvent): void {
		const target = e.target as HTMLElement;

		// Start linking
		if (target.closest('.juttu-linking-start-btn')) {
			this.resolveAuth();
			return;
		}

		// Login as the article owner — pre-targets the DID in the <link> tag and requests owner scopes
		if (target.closest('.juttu-linking-login-btn')) { this.openLoginPopup('setup', this.documentAtUri?.did); return; }

		// Create publication declared by the site's well-known file
		if (target.closest('.juttu-linking-create-pub-btn')) {
			const nameInput = this.container.querySelector<HTMLInputElement>('.juttu-linking-pub-name-input');
			const descInput = this.container.querySelector<HTMLInputElement>('.juttu-linking-pub-desc-input');
			const name = nameInput?.value.trim() ?? '';
			if (name) this.handleCreatePublication(name, descInput?.value.trim() ?? '');
			return;
		}

		// Skip publication creation → fall back to a loose document
		if (target.closest('.juttu-linking-skip-pub-btn')) {
			this.pendingPublicationUri = null;
			this.publicationUri = null;
			this.linkingStep = 'metadata';
			this.renderLinkingUI();
			return;
		}

		// Metadata continue
		if (target.closest('.juttu-linking-continue-btn')
			&& !target.closest('.juttu-linking-write-submit')
			&& !target.closest('.juttu-linking-create-pub-btn')) {
			const titleInput = this.container.querySelector<HTMLInputElement>('.juttu-linking-title-input');
			const descInput = this.container.querySelector<HTMLInputElement>('.juttu-linking-desc-input');
			const pathInput = this.container.querySelector<HTMLInputElement>('.juttu-linking-path-input');
			const title = titleInput?.value.trim() ?? '';
			if (!title) return;
			this.linkingTitle = title;
			this.linkingDescription = descInput?.value.trim() ?? '';
			this.linkingPath = pathInput?.value.trim() ?? '';
			this.linkingStep = 'choose-method';
			this.renderLinkingUI();
			return;
		}

		// Choose method
		const methodBtn = target.closest<HTMLElement>('.juttu-linking-method-btn');
		if (methodBtn) {
			if (methodBtn.dataset.method === 'write') {
				this.linkingStep = 'write-post';
				this.renderLinkingUI();
			} else if (methodBtn.dataset.method === 'select') {
				this.linkingStep = 'select-post';
				this.userPosts = [];
				this.renderLinkingUI();
				this.fetchUserPostsAndRender();
			}
			return;
		}

		// Write post submit
		if (target.closest('.juttu-linking-write-submit')) {
			const textarea = this.container.querySelector<HTMLTextAreaElement>('.juttu-linking-textarea');
			const text = textarea?.value.trim() ?? '';
			if (!text) return;
			this.handleLinkingCreatePost(text);
			return;
		}

		// Select post item
		const postItem = target.closest<HTMLElement>('.juttu-linking-post-item');
		if (postItem) {
			const uri = postItem.dataset.uri;
			const cid = postItem.dataset.cid;
			if (uri && cid) this.callPutDocument(uri, cid);
			return;
		}

		// Back button
		if (target.closest('.juttu-linking-back-btn')) {
			this.linkingStep = 'choose-method';
			this.renderLinkingUI();
			return;
		}
	}

	private async fetchUserPostsAndRender(): Promise<void> {
		if (!this.currentUser) return;
		try {
			const res = await fetch(
				`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed` +
				`?actor=${encodeURIComponent(this.currentUser.handle)}` +
				`&filter=posts_no_replies&limit=20`
			);
			if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
			const data = await res.json() as { feed: Array<{ post: BskyPost; reason?: { $type: string } }> };
			this.userPosts = data.feed
				.filter((item) => !item.reason) // exclude reposts
				.map((item) => ({
					uri: item.post.uri,
					cid: item.post.cid,
					text: item.post.record.text,
					createdAt: item.post.record.createdAt
				}));
			if (this.linkingStep === 'select-post') this.renderLinkingUI();
		} catch (err) {
			if (this.linkingStep === 'select-post') {
				const list = this.container.querySelector('.juttu-linking-post-list');
				if (list) {
					list.innerHTML = '';
					const errEl = document.createElement('p');
					errEl.className = 'juttu-linking-error';
					errEl.textContent = err instanceof Error ? err.message : 'Failed to load posts';
					list.appendChild(errEl);
				}
			}
		}
	}

	private async handleLinkingCreatePost(text: string): Promise<void> {
		const submitBtn = this.container.querySelector<HTMLButtonElement>('.juttu-linking-write-submit');
		if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Posting…'; }

		try {
			const res = await fetch(`${this.config.apiUrl}/bsky/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ text })
			}).then(this.checkApiResponse);
			const data = await res.json() as { uri: string; cid: string };
			await this.callPutDocument(data.uri, data.cid);
		} catch (err) {
			if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Post & Link'; }
			const errEl = document.createElement('p');
			errEl.className = 'juttu-linking-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to post';
			this.container.querySelector('.juttu-linking')?.appendChild(errEl);
		}
	}

	private async handleCreatePublication(name: string, description: string): Promise<void> {
		if (!this.pendingPublicationUri) return;
		const createBtn = this.container.querySelector<HTMLButtonElement>('.juttu-linking-create-pub-btn');
		if (createBtn) { createBtn.disabled = true; createBtn.textContent = 'Creating…'; }

		const { did, collection, rkey } = this.pendingPublicationUri;
		const record = {
			$type: 'site.standard.publication',
			url: window.location.origin,
			name,
			description: description || undefined
		};

		try {
			await fetch(`${this.config.apiUrl}/atproto/publication`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ rkey, record })
			}).then(this.checkApiResponse);

			this.publicationUri = `at://${did}/${collection}/${rkey}`;
			this.pendingPublicationUri = null;
			this.linkingStep = 'metadata';
			this.renderLinkingUI();
		} catch (err) {
			if (createBtn) { createBtn.disabled = false; createBtn.textContent = 'Create publication'; }
			const errEl = document.createElement('p');
			errEl.className = 'juttu-linking-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to create publication';
			this.container.querySelector('.juttu-linking')?.appendChild(errEl);
		}
	}

	// Uploads the page's og:image (if present and not opted out) as a blob for coverImage.
	// Best-effort: any failure falls back to no cover image rather than blocking linking.
	private async resolveCoverImageBlob(): Promise<BlobRef | undefined> {
		if (!this.includeCoverImage) return undefined;
		const imageUrl = getOgImageUrl();
		if (!imageUrl) return undefined;
		try {
			const res = await fetch(`${this.config.apiUrl}/atproto/blob`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ url: imageUrl })
			}).then(this.checkApiResponse);
			return (await res.json()) as BlobRef;
		} catch {
			return undefined;
		}
	}

	private async callPutDocument(postUri: string, postCid: string): Promise<void> {
		if (!this.documentAtUri) return;

		// Show loading indicator
		const linking = this.container.querySelector('.juttu-linking');
		if (linking) {
			const spinner = document.createElement('p');
			spinner.className = 'juttu-linking-spinner';
			spinner.textContent = 'Linking…';
			linking.appendChild(spinner);
		}

		const bskyPostRef = { uri: postUri, cid: postCid };
		const now = new Date().toISOString();

		let record: Record<string, unknown>;
		if (this.documentRecord) {
			// Mode A: update existing record — preserve all fields, add bskyPostRef
			record = { ...this.documentRecord, bskyPostRef, updatedAt: now };
		} else {
			// Mode B: create new record. `site` points to the publication record when the
			// site declares one, otherwise the bare origin (a loose document). `path` is only
			// user-editable when linked to a publication; a loose document's `site` is already
			// the full origin.
			const path = this.publicationUri ? (this.linkingPath || undefined) : (window.location.pathname || undefined);
			record = {
				$type: 'site.standard.document',
				site: this.publicationUri ?? window.location.origin,
				title: this.linkingTitle,
				description: this.linkingDescription || undefined,
				path,
				coverImage: await this.resolveCoverImageBlob(),
				publishedAt: now,
				updatedAt: now,
				bskyPostRef
			};
		}

		try {
			await fetch(`${this.config.apiUrl}/atproto/document`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ rkey: this.documentAtUri.rkey, record })
			}).then(this.checkApiResponse);

			// Success — transition to comments view
			this.documentAtUri = null;
			this.documentRecord = null;
			this.rootPostUri = postUri;
			this.rootPostCid = postCid;
			const thread = await fetchThread(postUri);
			this.threadData = thread;
			collectViewerState(thread, this.viewerState);
			this.renderWidget();
		} catch (err) {
			const linking2 = this.container.querySelector('.juttu-linking');
			linking2?.querySelector('.juttu-linking-spinner')?.remove();
			const errEl = document.createElement('p');
			errEl.className = 'juttu-linking-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to link document';
			linking2?.appendChild(errEl);
		}
	}

	public destroy(): void {
		if (this.loginPollInterval !== null) clearInterval(this.loginPollInterval);
		try { this.loginPopup?.close(); } catch { /* ignore */ }
		this.container.innerHTML = '';
	}
}
