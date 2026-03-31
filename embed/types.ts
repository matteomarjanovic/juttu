export interface JuttuConfig {
	apiUrl: string;
	theme: 'auto' | 'light' | 'dark';
}

export interface AtUri {
	did: string;
	collection: string;
	rkey: string;
}

export interface BskyAuthor {
	did: string;
	handle: string;
	displayName?: string;
	avatar?: string;
}

export interface BskyPostRecord {
	text: string;
	createdAt: string;
	facets?: BskyFacet[];
	reply?: {
		root: { uri: string; cid: string };
		parent: { uri: string; cid: string };
	};
}

export interface BskyEmbedImage {
	thumb: string;
	fullsize: string;
	alt?: string;
}

export interface BskyEmbed {
	$type: string;
	images?: BskyEmbedImage[];
}

export interface BskyPost {
	uri: string;
	cid: string;
	author: BskyAuthor;
	record: BskyPostRecord;
	indexedAt: string;
	likeCount?: number;
	repostCount?: number;
	replyCount?: number;
	embed?: BskyEmbed;
	viewer?: { like?: string; repost?: string };
}

export interface ThreadViewPost {
	$type: string;
	post: BskyPost;
	replies?: ThreadViewPost[];
}

export interface FacetLink {
	$type: 'app.bsky.richtext.facet#link';
	uri: string;
}
export interface FacetMention {
	$type: 'app.bsky.richtext.facet#mention';
	did: string;
}
export interface FacetTag {
	$type: 'app.bsky.richtext.facet#tag';
	tag: string;
}
export interface BskyFacet {
	index: { byteStart: number; byteEnd: number };
	features: Array<FacetLink | FacetMention | FacetTag>;
}

export interface CurrentUser {
	did: string;
	handle: string;
	avatar?: string;
	displayName?: string;
}

export interface DocumentRecord {
	$type?: string;
	bskyPostRef?: { uri: string; cid: string };
	path?: string;
	site?: string;
	title?: string;
	description?: string;
	publishedAt?: string;
	updatedAt?: string;
}

export interface ViewerState {
	likeUri?: string;
	repostUri?: string;
}

export interface LocalCounts {
	likes: number;
	reposts: number;
	replies: number;
}

export interface PaginationState {
	visibleTopLevel: number;
	visibleReplies: Map<string, number>;
}

export type SortOption = 'newest' | 'oldest' | 'most-liked';
