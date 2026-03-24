var JuttuEmbed=(()=>{var D='<svg class="juttu-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>',O='<svg class="juttu-repost-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',_='<svg class="juttu-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',V='<svg class="juttu-bsky-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" width="16" height="16" fill="currentColor"><path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"/></svg>',q=`
.juttu-comments {
  --juttu-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --juttu-font-size: 14px;
  --juttu-bg: #ffffff;
  --juttu-surface: #f7f9f9;
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
  --juttu-accent-color: #1d9bf0;
  --juttu-like-color: #e0245e;
  --juttu-repost-color: #17bf63;
  --juttu-avatar-size: 32px;
  --juttu-radius: 8px;
}
@media (prefers-color-scheme: dark) {
  .juttu-comments:not([data-juttu-theme]) {
    --juttu-bg: #15202b;
    --juttu-surface: #1e2732;
    --juttu-border-color: #38444d;
    --juttu-text: #ffffff;
    --juttu-text-muted: #8b98a5;
  }
}
.juttu-comments[data-juttu-theme="dark"] {
  --juttu-bg: #15202b;
  --juttu-surface: #1e2732;
  --juttu-border-color: #38444d;
  --juttu-text: #ffffff;
  --juttu-text-muted: #8b98a5;
}
.juttu-comments[data-juttu-theme="light"] {
  --juttu-bg: #ffffff;
  --juttu-surface: #f7f9f9;
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
}
.juttu-comments {
  font-family: var(--juttu-font-family);
  font-size: var(--juttu-font-size);
  color: var(--juttu-text);
  background: var(--juttu-bg);
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 1.25rem;
  box-sizing: border-box;
}
.juttu-comments *, .juttu-comments *::before, .juttu-comments *::after {
  box-sizing: border-box;
}
.juttu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.juttu-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--juttu-text);
}
.juttu-sort-controls { display: flex; gap: 0.25rem; }
.juttu-sort-btn {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.juttu-sort-btn:hover { border-color: var(--juttu-accent-color); color: var(--juttu-accent-color); }
.juttu-sort-btn--active { background: var(--juttu-accent-color); border-color: var(--juttu-accent-color); color: #fff; }
.juttu-composer {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--juttu-border-color);
}
.juttu-login-area { display: flex; align-items: center; gap: 0.5rem; }
.juttu-login-btn {
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.45rem 1.1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  font-weight: 500;
  transition: opacity 0.15s;
}
.juttu-login-btn:hover { opacity: 0.88; }
.juttu-login-form { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.juttu-handle-input {
  flex: 1;
  min-width: 160px;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem;
  font-family: var(--juttu-font-family);
  font-size: 0.875rem;
  background: var(--juttu-surface);
  color: var(--juttu-text);
}
.juttu-handle-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-handle-input::placeholder { color: var(--juttu-text-muted); }
.juttu-login-submit {
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  white-space: nowrap;
  transition: opacity 0.15s;
}
.juttu-login-submit:hover:not(:disabled) { opacity: 0.88; }
.juttu-login-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.juttu-login-cancel, .juttu-login-cancel-poll {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
}
.juttu-login-waiting { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--juttu-text-muted); }
.juttu-login-error { font-size: 0.8rem; color: #c0392b; margin-top: 0.35rem; }
.juttu-compose-user { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.juttu-compose-avatar {
  width: var(--juttu-avatar-size);
  height: var(--juttu-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.juttu-compose-handle { font-size: 0.875rem; color: var(--juttu-text-muted); flex: 1; }
.juttu-logout-btn {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
}
.juttu-logout-btn:hover { border-color: var(--juttu-text-muted); }
.juttu-compose-input {
  width: 100%;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.5rem 0.75rem;
  font-family: var(--juttu-font-family);
  font-size: 0.875rem;
  resize: vertical;
  min-height: 4rem;
  background: var(--juttu-surface);
  color: var(--juttu-text);
  transition: border-color 0.15s;
}
.juttu-compose-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-compose-input::placeholder { color: var(--juttu-text-muted); }
.juttu-submit-btn {
  margin-top: 0.5rem;
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  font-weight: 500;
  transition: opacity 0.15s;
}
.juttu-submit-btn:hover:not(:disabled) { opacity: 0.88; }
.juttu-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.juttu-post-error { font-size: 0.75rem; color: #c0392b; margin-top: 0.25rem; }
.juttu-comment { margin-bottom: 1rem; }
.juttu-comment-header { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.35rem; }
.juttu-avatar-link { flex-shrink: 0; display: block; }
.juttu-avatar { width: var(--juttu-avatar-size); height: var(--juttu-avatar-size); border-radius: 50%; object-fit: cover; display: block; }
.juttu-avatar-placeholder { width: var(--juttu-avatar-size); height: var(--juttu-avatar-size); border-radius: 50%; background: var(--juttu-border-color); flex-shrink: 0; }
.juttu-author-info { display: flex; flex-direction: column; min-width: 0; flex: 1; gap: 0.1rem; }
.juttu-display-name { font-weight: 700; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--juttu-text); text-decoration: none; }
.juttu-display-name:hover { text-decoration: underline; }
.juttu-handle { font-size: 0.8rem; color: var(--juttu-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
.juttu-handle:hover { text-decoration: underline; }
.juttu-time-link { font-size: 0.75rem; color: var(--juttu-text-muted); text-decoration: none; flex-shrink: 0; white-space: nowrap; }
.juttu-time-link:hover { text-decoration: underline; }
.juttu-comment-body { font-size: 0.875rem; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; margin-bottom: 0.4rem; color: var(--juttu-text); }
.juttu-mention, .juttu-link, .juttu-hashtag { color: var(--juttu-accent-color); text-decoration: none; }
.juttu-mention:hover, .juttu-link:hover, .juttu-hashtag:hover { text-decoration: underline; }
.juttu-comment-images { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.4rem; }
.juttu-comment-image-link { display: block; overflow: hidden; border-radius: var(--juttu-radius); border: 1px solid var(--juttu-border-color); transition: transform 0.15s; }
.juttu-comment-image-link:hover { transform: scale(1.01); }
.juttu-comment-image { max-height: 16rem; max-width: 100%; display: block; object-fit: cover; }
.juttu-comment-actions { display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--juttu-text-muted); margin-top: 0.4rem; }
.juttu-like-btn, .juttu-repost-btn, .juttu-reply-btn {
  background: none; border: none; display: flex; align-items: center; gap: 0.3rem;
  cursor: pointer; color: var(--juttu-text-muted); padding: 0;
  font-family: var(--juttu-font-family); font-size: 0.75rem; transition: color 0.15s;
}
.juttu-like-btn .juttu-like-icon { stroke: currentColor; transition: stroke 0.15s, fill 0.15s; }
.juttu-like-btn:hover .juttu-like-icon { stroke: var(--juttu-like-color); }
.juttu-like-btn[data-liked="true"] .juttu-like-icon { stroke: var(--juttu-like-color); fill: var(--juttu-like-color); }
.juttu-like-btn[data-liked="true"] .juttu-like-count { color: var(--juttu-like-color); }
.juttu-repost-btn .juttu-repost-icon { stroke: currentColor; transition: stroke 0.15s; }
.juttu-repost-btn:hover .juttu-repost-icon { stroke: var(--juttu-repost-color); }
.juttu-repost-btn[data-reposted="true"] .juttu-repost-icon { stroke: var(--juttu-repost-color); }
.juttu-repost-btn[data-reposted="true"] .juttu-repost-count { color: var(--juttu-repost-color); }
.juttu-reply-btn .juttu-reply-icon { stroke: currentColor; transition: stroke 0.15s; }
.juttu-reply-btn:hover .juttu-reply-icon { stroke: var(--juttu-accent-color); }
.juttu-bsky-link { color: var(--juttu-accent-color); text-decoration: none; display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; transition: opacity 0.15s; }
.juttu-bsky-link:hover { opacity: 0.75; }
.juttu-action-error { font-size: 0.72rem; color: #c0392b; margin-top: 0.2rem; }
.juttu-reply-form { margin-top: 0.5rem; }
.juttu-reply-input {
  width: 100%; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem; font-family: var(--juttu-font-family); font-size: 0.875rem;
  resize: vertical; background: var(--juttu-surface); color: var(--juttu-text);
  transition: border-color 0.15s;
}
.juttu-reply-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-reply-input::placeholder { color: var(--juttu-text-muted); }
.juttu-reply-form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; margin-top: 0.4rem; }
.juttu-reply-hint { font-size: 0.7rem; color: var(--juttu-text-muted); flex: 1; }
.juttu-reply-cancel {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.3rem 0.65rem; cursor: pointer; font-size: 0.8rem;
  color: var(--juttu-text-muted); font-family: var(--juttu-font-family);
}
.juttu-reply-submit {
  background: var(--juttu-accent-color); color: #fff; border: none;
  border-radius: var(--juttu-radius); padding: 0.3rem 0.75rem;
  cursor: pointer; font-size: 0.8rem; font-family: var(--juttu-font-family);
  transition: opacity 0.15s;
}
.juttu-reply-submit:hover:not(:disabled) { opacity: 0.88; }
.juttu-reply-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.juttu-reply-error { font-size: 0.75rem; color: #c0392b; margin-top: 0.25rem; }
.juttu-replies { border-left: 2px solid var(--juttu-border-color); padding-left: 0.75rem; margin-top: 0.75rem; }
.juttu-show-replies-btn {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.35rem 1rem; cursor: pointer; font-size: 0.8rem; color: var(--juttu-accent-color);
  font-family: var(--juttu-font-family); width: 100%; margin-top: 0.5rem; transition: border-color 0.15s;
}
.juttu-show-replies-btn:hover { border-color: var(--juttu-accent-color); }
.juttu-load-more { text-align: center; margin-top: 0.5rem; }
.juttu-load-more-btn {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.4rem 1rem; cursor: pointer; font-size: 0.8rem; color: var(--juttu-accent-color);
  font-family: var(--juttu-font-family); width: 100%; transition: border-color 0.15s;
}
.juttu-load-more-btn:hover { border-color: var(--juttu-accent-color); }
.juttu-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--juttu-border-color); text-align: right; }
.juttu-powered-by { font-size: 0.7rem; color: var(--juttu-text-muted); text-decoration: none; }
.juttu-powered-by:hover { text-decoration: underline; }
.juttu-loading { padding: 2rem; text-align: center; color: var(--juttu-text-muted); font-size: 0.875rem; }
.juttu-error { padding: 1rem; color: #c0392b; font-size: 0.875rem; background: #fdf0ee; border-radius: var(--juttu-radius); border: 1px solid #f5c6c0; }
@keyframes juttu-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
.juttu-login-btn--pulse { animation: juttu-pulse 0.35s ease-in-out 2; }
.juttu-linking { padding: 0.5rem 0; }
.juttu-linking-title { font-size: 0.9375rem; font-weight: 600; margin: 0 0 0.375rem; color: var(--juttu-text); }
.juttu-linking-desc { font-size: 0.875rem; color: var(--juttu-text-muted); margin: 0 0 1rem; }
.juttu-linking-start-btn {
  background: var(--juttu-accent-color); color: #fff; border: none;
  border-radius: var(--juttu-radius); padding: 0.45rem 1.1rem;
  cursor: pointer; font-size: 0.875rem; font-family: var(--juttu-font-family);
  font-weight: 500; transition: opacity 0.15s;
}
.juttu-linking-start-btn:hover { opacity: 0.88; }
.juttu-linking-methods { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.juttu-linking-method-btn {
  flex: 1; min-width: 140px; border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius); padding: 0.75rem 1rem;
  background: var(--juttu-surface); cursor: pointer; text-align: left;
  font-family: var(--juttu-font-family); color: var(--juttu-text); transition: border-color 0.15s;
}
.juttu-linking-method-btn:hover { border-color: var(--juttu-accent-color); }
.juttu-linking-method-title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.2rem; }
.juttu-linking-method-desc { font-size: 0.75rem; color: var(--juttu-text-muted); }
.juttu-linking-field { margin-bottom: 0.75rem; }
.juttu-linking-label { display: block; font-size: 0.8rem; font-weight: 500; margin-bottom: 0.3rem; color: var(--juttu-text); }
.juttu-linking-input {
  width: 100%; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem; font-family: var(--juttu-font-family); font-size: 0.875rem;
  background: var(--juttu-surface); color: var(--juttu-text); transition: border-color 0.15s;
}
.juttu-linking-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-linking-input::placeholder { color: var(--juttu-text-muted); }
.juttu-linking-textarea {
  width: 100%; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.5rem 0.65rem; font-family: var(--juttu-font-family); font-size: 0.875rem;
  background: var(--juttu-surface); color: var(--juttu-text); resize: vertical;
  min-height: 5rem; transition: border-color 0.15s;
}
.juttu-linking-textarea:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-linking-textarea::placeholder { color: var(--juttu-text-muted); }
.juttu-linking-continue-btn {
  background: var(--juttu-accent-color); color: #fff; border: none;
  border-radius: var(--juttu-radius); padding: 0.4rem 1rem;
  cursor: pointer; font-size: 0.875rem; font-family: var(--juttu-font-family);
  font-weight: 500; transition: opacity 0.15s;
}
.juttu-linking-continue-btn:hover:not(:disabled) { opacity: 0.88; }
.juttu-linking-continue-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.juttu-linking-post-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
.juttu-linking-post-item {
  border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.6rem 0.75rem; cursor: pointer; background: var(--juttu-surface);
  text-align: left; width: 100%; font-family: var(--juttu-font-family); transition: border-color 0.15s;
}
.juttu-linking-post-item:hover { border-color: var(--juttu-accent-color); }
.juttu-linking-post-text { font-size: 0.875rem; color: var(--juttu-text); margin-bottom: 0.2rem; white-space: pre-wrap; overflow-wrap: anywhere; }
.juttu-linking-post-date { font-size: 0.75rem; color: var(--juttu-text-muted); }
.juttu-linking-error { font-size: 0.8rem; color: #c0392b; margin-top: 0.5rem; }
.juttu-linking-spinner { font-size: 0.875rem; color: var(--juttu-text-muted); }
`;function F(l){if(!l.startsWith("at://"))return null;let e=l.slice(5).split("/");if(e.length!==3)return null;let[t,n,r]=e;return!t||!n||!r?null:{did:t,collection:n,rkey:r}}async function W(l){let e;if(l.startsWith("did:plc:")){let n=await fetch(`https://plc.directory/${l}`);if(!n.ok)throw new Error(`Failed to resolve DID: ${n.status}`);e=await n.json()}else if(l.startsWith("did:web:")){let n=l.split(":").slice(2).join(":"),r=await fetch(`https://${n}/.well-known/did.json`);if(!r.ok)throw new Error(`Failed to resolve did:web DID: ${r.status}`);e=await r.json()}else throw new Error(`Unsupported DID method: ${l}`);let t=e.service?.find(n=>n.type==="AtprotoPersonalDataServer");if(!t?.serviceEndpoint)throw new Error("No PDS endpoint found in DID document");return t.serviceEndpoint}async function J(l,e){let t=`${l}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(e.did)}&collection=${encodeURIComponent(e.collection)}&rkey=${encodeURIComponent(e.rkey)}`,n=await fetch(t);if(n.status>=400&&n.status<500)return null;if(!n.ok)throw new Error(`Failed to fetch document record: ${n.status}`);return(await n.json()).value}async function S(l){let e=`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(l)}&depth=10&parentHeight=0`,t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch thread: ${t.status}`);let n=await t.json();if(!n.thread)throw new Error("Thread data missing from response");return n.thread}async function C(l){try{let e=await fetch(`${l}/auth/me`,{credentials:"include"});return e.ok?await e.json():null}catch{return null}}async function A(l){try{let e=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(l)}`);return e.ok?(await e.json()).avatar:void 0}catch{return}}function H(l){let e=Math.floor((Date.now()-new Date(l).getTime())/1e3);return e<60?"just now":e<3600?`${Math.floor(e/60)}m`:e<86400?`${Math.floor(e/3600)}h`:e<2592e3?`${Math.floor(e/86400)}d`:e<31536e3?`${Math.floor(e/2592e3)}mo`:`${Math.floor(e/31536e3)}y`}function X(l){return l.startsWith("https://")||l.startsWith("http://")}function G(l,e){let t=document.createDocumentFragment(),n=new TextEncoder,r=new TextDecoder,o=n.encode(l);if(!e||e.length===0)return t.appendChild(document.createTextNode(l)),t;let i=[...e].sort((s,u)=>s.index.byteStart-u.index.byteStart),a=0;for(let s of i){let{byteStart:u,byteEnd:d}=s.index;u>a&&t.appendChild(document.createTextNode(r.decode(o.slice(a,u))));let h=r.decode(o.slice(u,d)),m=s.features[0];if(!m)t.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#link")if(X(m.uri)){let c=document.createElement("a");c.className="juttu-link",c.href=m.uri,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,t.appendChild(c)}else t.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#mention"){let c=document.createElement("a");c.className="juttu-mention",c.href=`https://bsky.app/profile/${m.did}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,t.appendChild(c)}else if(m.$type==="app.bsky.richtext.facet#tag"){let c=document.createElement("a");c.className="juttu-hashtag",c.href=`https://bsky.app/search?q=${encodeURIComponent("#"+m.tag)}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,t.appendChild(c)}else t.appendChild(document.createTextNode(h));a=d}return a<o.length&&t.appendChild(document.createTextNode(r.decode(o.slice(a)))),t}function Y(l){return(l.replies??[]).filter(e=>e.$type==="app.bsky.feed.defs#threadViewPost")}function I(l,e){return[...l].sort((t,n)=>e==="most-liked"?(n.post.likeCount??0)-(t.post.likeCount??0):e==="oldest"?new Date(t.post.indexedAt).getTime()-new Date(n.post.indexedAt).getTime():new Date(n.post.indexedAt).getTime()-new Date(t.post.indexedAt).getTime())}function E(l,e){let{post:t}=l;(t.viewer?.like||t.viewer?.repost)&&e.set(t.uri,{likeUri:t.viewer.like,repostUri:t.viewer.repost});for(let n of l.replies??[])n.$type==="app.bsky.feed.defs#threadViewPost"&&E(n,e)}function z(l,e){if(!l)return null;if(l.post.uri===e)return l.post;for(let t of l.replies??[])if(t.$type==="app.bsky.feed.defs#threadViewPost"){let n=z(t,e);if(n)return n}return null}var L=class{config;container;threadData=null;currentUser=null;rootPostUri=null;rootPostCid=null;sortOrder="newest";pagination={visibleTopLevel:10,visibleReplies:new Map};viewerState=new Map;openReplyFormUri=null;loginPopup=null;loginPollInterval=null;loginPollStartTime=0;authMessageHandler=null;documentAtUri=null;documentRecord=null;linkingStep="setup";linkingTitle="";linkingDescription="";userPosts=[];constructor(e,t){this.container=e,this.config=t,this.injectStyles(),this.init()}injectStyles(){if(document.getElementById("juttu-styles"))return;let e=document.createElement("style");e.id="juttu-styles",e.textContent=q,document.head.appendChild(e)}async init(){this.renderLoading();try{let e=document.querySelector('link[rel="site.standard.document"]');if(!e){this.renderError('Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.');return}let t=e.getAttribute("href");if(!t||!t.startsWith("at://")){this.renderError('Invalid <link rel="site.standard.document" href> \u2014 must be an AT URI (at://).');return}let n=F(t);if(!n){this.renderError("Could not parse AT URI from link tag.");return}let r=await W(n.did),o=await J(r,n);if(o?.bskyPostRef?.uri){this.rootPostUri=o.bskyPostRef.uri,this.rootPostCid=o.bskyPostRef.cid;let[i,a]=await Promise.all([C(this.config.apiUrl),S(o.bskyPostRef.uri)]);this.currentUser=i,this.threadData=a,E(a,this.viewerState),this.renderWidget()}else{this.documentAtUri=n,this.documentRecord=o,this.linkingStep="setup";let i=await C(this.config.apiUrl);if(i){let a=await A(i.handle);this.currentUser={...i,avatar:a}}this.renderLinkingUI()}}catch(e){let t=e instanceof Error?e.message:"Unknown error";this.renderError(`Could not load comments: ${t}`)}}renderLoading(){this.container.innerHTML="";let e=this.makeRoot(),t=document.createElement("div");t.className="juttu-loading",t.textContent="Loading comments\u2026",e.appendChild(t),this.container.appendChild(e)}renderError(e){this.container.innerHTML="";let t=this.makeRoot(),n=document.createElement("div");n.className="juttu-error",n.textContent=`Juttu: ${e}`,t.appendChild(n),this.container.appendChild(t)}makeRoot(){let e=document.createElement("div");return e.className="juttu-comments",this.config.theme!=="auto"&&e.setAttribute("data-juttu-theme",this.config.theme),e}renderWidget(){this.container.innerHTML="";let e=this.makeRoot(),t=this.threadData?Y(this.threadData):[];e.appendChild(this.renderHeader(t.length)),e.appendChild(this.renderComposer()),e.appendChild(this.renderThread(t));let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),e.appendChild(n),e.addEventListener("click",o=>this.handleClick(o)),e.addEventListener("input",o=>{let i=o.target;if(i.classList.contains("juttu-compose-input")){let a=e.querySelector(".juttu-submit-btn");a&&(a.disabled=!i.value.trim())}if(i.classList.contains("juttu-reply-input")){let s=i.closest(".juttu-reply-form")?.querySelector(".juttu-reply-submit");s&&(s.disabled=!i.value.trim())}}),e.addEventListener("keydown",o=>{o.target.classList.contains("juttu-handle-input")&&o.key==="Enter"&&this.handleLoginSubmit()}),this.container.appendChild(e)}handleClick(e){let t=e.target,n=t.closest(".juttu-sort-btn");if(n){let s=n.dataset.sort;s&&this.setSortOrder(s);return}if(t.closest(".juttu-load-more-btn")){this.pagination.visibleTopLevel+=10,this.renderWidget();return}let r=t.closest(".juttu-show-replies-btn");if(r){let s=r.dataset.uri;if(s){let u=this.pagination.visibleReplies.get(s)??3;this.pagination.visibleReplies.set(s,u+3),this.renderWidget()}return}if(t.closest(".juttu-login-btn")){this.showLoginForm();return}if(t.closest(".juttu-login-submit")){this.handleLoginSubmit();return}if(t.closest(".juttu-login-cancel")||t.closest(".juttu-login-cancel-poll")){this.cancelLogin();return}if(t.closest(".juttu-logout-btn")){this.handleLogout();return}let o=t.closest(".juttu-like-btn");if(o){this.requireAuth()&&this.handleLike(o);return}let i=t.closest(".juttu-repost-btn");if(i){this.requireAuth()&&this.handleRepost(i);return}let a=t.closest(".juttu-reply-btn");if(a){let s=a.dataset.uri;s&&this.requireAuth()&&this.handleToggleReplyForm(s);return}if(t.closest(".juttu-reply-cancel")){this.closeReplyForm();return}if(t.closest(".juttu-reply-submit")){this.openReplyFormUri&&this.handleSubmitReply(this.openReplyFormUri);return}if(t.closest(".juttu-submit-btn")){this.requireAuth()&&this.handlePost();return}}setSortOrder(e){this.sortOrder=e,this.pagination.visibleTopLevel=10,this.pagination.visibleReplies.clear(),this.renderWidget()}renderHeader(e){let t=document.createElement("div");t.className="juttu-header";let n=document.createElement("h2");n.className="juttu-title",n.textContent=`${e} Comment${e!==1?"s":""}`,t.appendChild(n);let r=document.createElement("div");r.className="juttu-sort-controls";for(let{value:o,label:i}of[{value:"newest",label:"Newest"},{value:"oldest",label:"Oldest"},{value:"most-liked",label:"Top"}]){let a=document.createElement("button");a.className="juttu-sort-btn"+(this.sortOrder===o?" juttu-sort-btn--active":""),a.dataset.sort=o,a.textContent=i,r.appendChild(a)}return t.appendChild(r),t}renderComposer(){let e=document.createElement("div");return e.className="juttu-composer",this.currentUser?e.appendChild(this.makeComposeArea()):e.appendChild(this.makeLoginArea()),e}makeLoginArea(){let e=document.createElement("div");e.className="juttu-login-area";let t=document.createElement("button");return t.className="juttu-login-btn",t.textContent="Login with Bluesky",e.appendChild(t),e}makeComposeArea(){let e=document.createElement("div");e.className="juttu-compose-area";let t=document.createElement("div");if(t.className="juttu-compose-user",this.currentUser.avatar){let a=document.createElement("img");a.className="juttu-compose-avatar",a.src=this.currentUser.avatar,a.alt=this.currentUser.handle,t.appendChild(a)}else{let a=document.createElement("div");a.className="juttu-avatar-placeholder",t.appendChild(a)}let n=document.createElement("span");n.className="juttu-compose-handle",n.textContent=`@${this.currentUser.handle}`,t.appendChild(n);let r=document.createElement("button");r.className="juttu-logout-btn",r.textContent="Logout",t.appendChild(r),e.appendChild(t);let o=document.createElement("textarea");o.className="juttu-compose-input",o.placeholder="Write a comment\u2026",o.rows=3,e.appendChild(o);let i=document.createElement("button");return i.className="juttu-submit-btn",i.textContent="Post comment",i.disabled=!0,e.appendChild(i),e}renderThread(e){let t=document.createElement("div");t.className="juttu-thread";let n=I(e,this.sortOrder),r=n.slice(0,this.pagination.visibleTopLevel);for(let o of r)t.appendChild(this.renderComment(o,0));if(n.length>this.pagination.visibleTopLevel){let o=document.createElement("div");o.className="juttu-load-more";let i=document.createElement("button");i.className="juttu-load-more-btn";let a=n.length-this.pagination.visibleTopLevel;i.textContent=`Load ${Math.min(a,10)} more comments`,o.appendChild(i),t.appendChild(o)}return t}renderComment(e,t){let{post:n}=e,r=n.uri.split("/").pop()??"",o=`https://bsky.app/profile/${n.author.did}/post/${r}`,i=`https://bsky.app/profile/${n.author.handle}`,a=document.createElement("div");a.className="juttu-comment",a.dataset.uri=n.uri,a.dataset.cid=n.cid;let s=document.createElement("div");if(s.className="juttu-comment-header",n.author.avatar){let p=document.createElement("a");p.className="juttu-avatar-link",p.href=i,p.target="_blank",p.rel="noopener noreferrer";let f=document.createElement("img");f.className="juttu-avatar",f.src=n.author.avatar,f.alt=n.author.handle,f.loading="lazy",p.appendChild(f),s.appendChild(p)}else{let p=document.createElement("div");p.className="juttu-avatar-placeholder",s.appendChild(p)}let u=document.createElement("div");u.className="juttu-author-info";let d=document.createElement("a");d.className="juttu-display-name",d.href=i,d.target="_blank",d.rel="noopener noreferrer",d.textContent=n.author.displayName||n.author.handle,u.appendChild(d);let h=document.createElement("a");h.className="juttu-handle",h.href=i,h.target="_blank",h.rel="noopener noreferrer",h.textContent=`@${n.author.handle}`,u.appendChild(h),s.appendChild(u);let m=document.createElement("a");m.className="juttu-time-link",m.href=o,m.target="_blank",m.rel="noopener noreferrer",m.textContent=H(n.indexedAt),m.title=new Date(n.indexedAt).toLocaleString(),s.appendChild(m),a.appendChild(s);let c=document.createElement("div");c.className="juttu-comment-body";let N=document.createElement("p");if(N.style.margin="0",N.appendChild(G(n.record.text,n.record.facets)),c.appendChild(N),a.appendChild(c),n.embed?.$type==="app.bsky.embed.images#view"&&n.embed.images?.length){let p=document.createElement("div");p.className="juttu-comment-images";for(let f of n.embed.images){let g=document.createElement("a");g.className="juttu-comment-image-link",g.href=o,g.target="_blank",g.rel="noopener noreferrer";let j=document.createElement("img");j.className="juttu-comment-image",j.src=f.thumb,j.alt=f.alt||"Embedded image",j.loading="lazy",g.appendChild(j),p.appendChild(g)}a.appendChild(p)}let B=this.viewerState.get(n.uri)??{},Z=!!B.likeUri,Q=!!B.repostUri,y=document.createElement("div");y.className="juttu-comment-actions";let v=document.createElement("button");v.className="juttu-like-btn",v.dataset.liked=String(Z),v.dataset.uri=n.uri,v.dataset.cid=n.cid,v.title="Like",v.innerHTML=D;let U=document.createElement("span");U.className="juttu-like-count",U.textContent=String(n.likeCount??0),v.appendChild(U),y.appendChild(v);let b=document.createElement("button");b.className="juttu-repost-btn",b.dataset.reposted=String(Q),b.dataset.uri=n.uri,b.dataset.cid=n.cid,b.title="Repost",b.innerHTML=O;let M=document.createElement("span");M.className="juttu-repost-count",M.textContent=String(n.repostCount??0),b.appendChild(M),y.appendChild(b);let x=document.createElement("button");x.className="juttu-reply-btn",x.dataset.uri=n.uri,x.title="Reply",x.innerHTML=_;let R=document.createElement("span");R.className="juttu-reply-count",R.textContent=String(n.replyCount??0),x.appendChild(R),y.appendChild(x);let k=document.createElement("a");k.className="juttu-bsky-link",k.href=o,k.target="_blank",k.rel="noopener noreferrer",k.title="View on Bluesky",k.innerHTML=V,y.appendChild(k),a.appendChild(y);let $=(e.replies??[]).filter(p=>p.$type==="app.bsky.feed.defs#threadViewPost");if($.length>0){let p=document.createElement("div");p.className="juttu-replies";let f=this.pagination.visibleReplies.get(n.uri)??3,g=I($,this.sortOrder);for(let w of g.slice(0,f))p.appendChild(this.renderComment(w,t+1));let j=g.length-f;if(j>0){let w=document.createElement("button");w.className="juttu-show-replies-btn",w.dataset.uri=n.uri,w.textContent=`Show ${Math.min(j,3)} more repl${j===1?"y":"ies"}`,p.appendChild(w)}a.appendChild(p)}return a}getComposer(){return this.container.querySelector(".juttu-composer")??this.container.querySelector(".juttu-linking")}showLoginForm(){let e=this.getComposer();if(!e)return;e.innerHTML="";let t=document.createElement("div");t.className="juttu-login-form";let n=document.createElement("input");n.type="text",n.className="juttu-handle-input",n.placeholder="yourhandle.bsky.social",n.autocomplete="username",t.appendChild(n);let r=document.createElement("button");r.className="juttu-login-submit",r.textContent="Login \u2192",t.appendChild(r);let o=document.createElement("button");o.className="juttu-login-cancel",o.textContent="Cancel",t.appendChild(o),e.appendChild(t),n.focus()}async handleLoginSubmit(){let e=this.getComposer();if(!e)return;let t=e.querySelector(".juttu-handle-input"),n=e.querySelector(".juttu-login-submit");if(!t||!n)return;let r=t.value.trim().replace(/^@/,"");if(!r){t.focus();return}n.disabled=!0,n.textContent="Opening\u2026",e.querySelector(".juttu-login-error")?.remove();try{let o=await fetch(`${this.config.apiUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({handle:r})});if(!o.ok){let d=await o.json().catch(()=>({}));throw new Error(d.error??`Login failed (${o.status})`)}let i=await o.json();this.loginPopup=window.open(i.redirect_url,"juttu-auth","width=600,height=700,menubar=no,toolbar=no,location=no,status=no"),e.innerHTML="";let a=document.createElement("div");a.className="juttu-login-waiting";let s=document.createElement("span");s.textContent="Waiting for Bluesky authorization\u2026",a.appendChild(s);let u=document.createElement("button");u.className="juttu-login-cancel-poll",u.textContent="Cancel",a.appendChild(u),e.appendChild(a),this.authMessageHandler=d=>{d.data?.type==="juttu-auth-complete"&&this.onAuthComplete()},window.addEventListener("message",this.authMessageHandler),this.loginPollStartTime=Date.now(),this.loginPollInterval=setInterval(()=>this.pollForLogin(),1500)}catch(o){n.disabled=!1,n.textContent="Login \u2192";let i=document.createElement("div");i.className="juttu-login-error",i.textContent=o instanceof Error?o.message:"Login failed",e.appendChild(i)}}async onAuthComplete(){let e=await C(this.config.apiUrl);e&&await this.completeLogin(e)}async pollForLogin(){if(Date.now()-this.loginPollStartTime>12e4){this.cancelLogin();return}let t=await C(this.config.apiUrl);t&&await this.completeLogin(t)}async completeLogin(e){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null),this.authMessageHandler&&(window.removeEventListener("message",this.authMessageHandler),this.authMessageHandler=null);try{this.loginPopup?.close()}catch{}this.loginPopup=null;let t=await A(e.handle);if(this.currentUser={...e,avatar:t},this.documentAtUri)this.linkingStep=this.documentRecord?"choose-method":"metadata",this.renderLinkingUI();else{let n=this.getComposer();if(n){n.innerHTML="",n.appendChild(this.makeComposeArea());let r=n.querySelector(".juttu-compose-input"),o=n.querySelector(".juttu-submit-btn");r&&o&&r.addEventListener("input",()=>{o.disabled=!r.value.trim()})}}}cancelLogin(){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null),this.authMessageHandler&&(window.removeEventListener("message",this.authMessageHandler),this.authMessageHandler=null);try{this.loginPopup?.close()}catch{}if(this.loginPopup=null,this.documentAtUri)this.linkingStep="login",this.renderLinkingUI();else{let e=this.getComposer();e&&(e.innerHTML="",e.appendChild(this.makeLoginArea()))}}async handleLogout(){try{await fetch(`${this.config.apiUrl}/auth/logout`,{method:"POST",credentials:"include"})}catch{}this.currentUser=null,this.viewerState.clear();let e=this.getComposer();e&&(e.innerHTML="",e.appendChild(this.makeLoginArea()))}requireAuth(){if(!this.currentUser){this.container.querySelector(".juttu-composer")?.scrollIntoView({behavior:"smooth",block:"nearest"});let t=this.container.querySelector(".juttu-login-btn");return t&&(t.classList.remove("juttu-login-btn--pulse"),t.offsetWidth,t.classList.add("juttu-login-btn--pulse"),setTimeout(()=>t.classList.remove("juttu-login-btn--pulse"),800)),!1}return!0}async handleLike(e){let t=e.dataset.uri,n=e.dataset.cid;if(!t||!n)return;let r=this.viewerState.get(t)??{},o=!!r.likeUri,i=e.querySelector(".juttu-like-count"),a=parseInt(i?.textContent??"0",10),s=!o;e.dataset.liked=String(s),i&&(i.textContent=String(a+(s?1:-1))),this.viewerState.set(t,{...r,likeUri:s?"pending":void 0});try{if(o&&r.likeUri){let u=r.likeUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/like`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:u})}).then(this.checkApiResponse),this.viewerState.set(t,{...r,likeUri:void 0})}else{let d=await(await fetch(`${this.config.apiUrl}/bsky/like`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:t,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(t,{...r,likeUri:d.uri})}}catch(u){e.dataset.liked=String(o),i&&(i.textContent=String(a)),this.viewerState.set(t,r),this.showActionError(e,u instanceof Error?u.message:"Action failed")}}async handleRepost(e){let t=e.dataset.uri,n=e.dataset.cid;if(!t||!n)return;let r=this.viewerState.get(t)??{},o=!!r.repostUri,i=e.querySelector(".juttu-repost-count"),a=parseInt(i?.textContent??"0",10),s=!o;e.dataset.reposted=String(s),i&&(i.textContent=String(a+(s?1:-1))),this.viewerState.set(t,{...r,repostUri:s?"pending":void 0});try{if(o&&r.repostUri){let u=r.repostUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:u})}).then(this.checkApiResponse),this.viewerState.set(t,{...r,repostUri:void 0})}else{let d=await(await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:t,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(t,{...r,repostUri:d.uri})}}catch(u){e.dataset.reposted=String(o),i&&(i.textContent=String(a)),this.viewerState.set(t,r),this.showActionError(e,u instanceof Error?u.message:"Action failed")}}handleToggleReplyForm(e){if(this.openReplyFormUri===e){this.closeReplyForm();return}this.closeReplyForm();let t=this.container.querySelector(`.juttu-comment[data-uri="${CSS.escape(e)}"]`);if(!t)return;let n=document.createElement("div");n.className="juttu-reply-form";let r=document.createElement("textarea");r.className="juttu-reply-input",r.placeholder="Write a reply\u2026",r.rows=2,n.appendChild(r);let o=document.createElement("div");o.className="juttu-reply-form-actions";let i=document.createElement("span");i.className="juttu-reply-hint",i.textContent="Reply posts to Bluesky",o.appendChild(i);let a=document.createElement("button");a.className="juttu-reply-cancel",a.textContent="Cancel",o.appendChild(a);let s=document.createElement("button");s.className="juttu-reply-submit",s.textContent="Reply",s.disabled=!0,o.appendChild(s),n.appendChild(o);let u=t.querySelector(".juttu-comment-actions");u?.nextSibling?t.insertBefore(n,u.nextSibling):t.appendChild(n),this.openReplyFormUri=e,r.focus()}closeReplyForm(){if(!this.openReplyFormUri)return;this.container.querySelector(".juttu-reply-form")?.remove(),this.openReplyFormUri=null}async handlePost(){let e=this.container.querySelector(".juttu-compose-input"),t=this.container.querySelector(".juttu-submit-btn");if(!e||!t)return;let n=e.value.trim();if(!(!n||!this.rootPostUri||!this.rootPostCid)){t.disabled=!0,t.textContent="Posting\u2026",this.container.querySelector(".juttu-post-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:n,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:this.rootPostUri,cid:this.rootPostCid}}})}).then(this.checkApiResponse),e.value="",t.disabled=!0,t.textContent="Post comment",setTimeout(()=>this.refetchAndRender(),1500)}catch(r){t.disabled=!1,t.textContent="Post comment";let o=document.createElement("div");o.className="juttu-post-error",o.textContent=r instanceof Error?r.message:"Failed to post",t.insertAdjacentElement("afterend",o)}}}async handleSubmitReply(e){let t=this.container.querySelector(".juttu-reply-form");if(!t)return;let n=t.querySelector(".juttu-reply-input"),r=t.querySelector(".juttu-reply-submit");if(!n||!r)return;let o=n.value.trim();if(!o||!this.rootPostUri||!this.rootPostCid)return;let i=z(this.threadData,e);if(i){r.disabled=!0,r.textContent="Replying\u2026",t.querySelector(".juttu-reply-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:o,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:i.uri,cid:i.cid}}})}).then(this.checkApiResponse),this.closeReplyForm(),setTimeout(()=>this.refetchAndRender(),1500)}catch(a){r.disabled=!1,r.textContent="Reply";let s=document.createElement("div");s.className="juttu-reply-error",s.textContent=a instanceof Error?a.message:"Failed to post reply",t.appendChild(s)}}}async refetchAndRender(){if(this.rootPostUri)try{let e=await S(this.rootPostUri);this.threadData=e;let t=new Map;E(e,t);for(let[n,r]of t){let o=this.viewerState.get(n),i={likeUri:o?.likeUri!=="pending"?o?.likeUri??r.likeUri:r.likeUri,repostUri:o?.repostUri!=="pending"?o?.repostUri??r.repostUri:r.repostUri};(i.likeUri||i.repostUri)&&t.set(n,i)}this.viewerState=t,this.renderWidget()}catch{}}checkApiResponse=async e=>{if(!e.ok){let t=await e.json().catch(()=>({}));throw new Error(t.error??`Request failed (${e.status})`)}return e};showActionError(e,t){e.parentElement?.querySelector(".juttu-action-error")?.remove();let n=document.createElement("div");n.className="juttu-action-error",n.textContent=t,e.insertAdjacentElement("afterend",n),setTimeout(()=>n.remove(),4e3)}renderLinkingUI(){this.container.innerHTML="";let e=this.makeRoot(),t=document.createElement("div");switch(t.className="juttu-linking",this.linkingStep){case"setup":t.appendChild(this.makeLinkingSetup());break;case"login":t.appendChild(this.makeLinkingLoginForm());break;case"metadata":t.appendChild(this.makeLinkingMetadata());break;case"choose-method":t.appendChild(this.makeLinkingChooseMethod());break;case"write-post":t.appendChild(this.makeLinkingWritePost());break;case"select-post":t.appendChild(this.makeLinkingSelectPost());break}e.appendChild(t),e.addEventListener("click",o=>this.handleLinkingClick(o)),e.addEventListener("keydown",o=>{o.target.classList.contains("juttu-handle-input")&&o.key==="Enter"&&this.handleLoginSubmit()});let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),e.appendChild(n),this.container.appendChild(e)}makeLinkingSetup(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title";let n=document.createElement("p");n.className="juttu-linking-desc",this.documentRecord?(t.textContent="Comments not linked yet",n.textContent="Link this article to a Bluesky post to enable the comment thread."):(t.textContent="Comments not set up yet",n.textContent="Set up a Bluesky-powered comment thread for this article."),e.appendChild(t),e.appendChild(n);let r=document.createElement("button");return r.className="juttu-linking-start-btn",r.textContent=this.documentRecord?"Link comments":"Set up comments",e.appendChild(r),e}makeLinkingLoginForm(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Sign in as the document owner",e.appendChild(t);let n=document.createElement("div");n.className="juttu-login-form";let r=document.createElement("input");r.type="text",r.className="juttu-handle-input",r.placeholder="yourhandle.bsky.social",r.autocomplete="username",n.appendChild(r);let o=document.createElement("button");return o.className="juttu-login-submit",o.textContent="Login \u2192",n.appendChild(o),e.appendChild(n),e}makeLinkingMetadata(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Article details",e.appendChild(t);let n=document.createElement("div");n.className="juttu-linking-field";let r=document.createElement("label");r.className="juttu-linking-label",r.textContent="Title *",n.appendChild(r);let o=document.createElement("input");o.type="text",o.className="juttu-linking-input juttu-linking-title-input",o.placeholder="Article title",o.value=this.linkingTitle,n.appendChild(o),e.appendChild(n);let i=document.createElement("div");i.className="juttu-linking-field";let a=document.createElement("label");a.className="juttu-linking-label",a.textContent="Description (optional)",i.appendChild(a);let s=document.createElement("input");s.type="text",s.className="juttu-linking-input juttu-linking-desc-input",s.placeholder="Short description",s.value=this.linkingDescription,i.appendChild(s),e.appendChild(i);let u=document.createElement("button");return u.className="juttu-linking-continue-btn",u.textContent="Continue",u.disabled=!this.linkingTitle.trim(),e.appendChild(u),o.addEventListener("input",()=>{u.disabled=!o.value.trim()}),e}makeLinkingChooseMethod(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Link a Bluesky post",e.appendChild(t);let n=document.createElement("p");n.className="juttu-linking-desc",n.textContent="This post becomes the root of the comment thread.",e.appendChild(n);let r=document.createElement("div");r.className="juttu-linking-methods";let o=document.createElement("button");o.className="juttu-linking-method-btn",o.dataset.method="write";let i=document.createElement("div");i.className="juttu-linking-method-title",i.textContent="Write a new post";let a=document.createElement("div");a.className="juttu-linking-method-desc",a.textContent="Compose a post to announce this article",o.appendChild(i),o.appendChild(a),r.appendChild(o);let s=document.createElement("button");s.className="juttu-linking-method-btn",s.dataset.method="select";let u=document.createElement("div");u.className="juttu-linking-method-title",u.textContent="Use an existing post";let d=document.createElement("div");return d.className="juttu-linking-method-desc",d.textContent="Pick from your recent Bluesky posts",s.appendChild(u),s.appendChild(d),r.appendChild(s),e.appendChild(r),e}makeLinkingWritePost(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Write a post",e.appendChild(t);let n=document.createElement("textarea");n.className="juttu-linking-textarea",n.placeholder="Share this article on Bluesky\u2026",e.appendChild(n);let r=document.createElement("div");r.style.cssText="display:flex;gap:0.5rem;margin-top:0.5rem;";let o=document.createElement("button");o.className="juttu-linking-back-btn",o.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.4rem 0.75rem;cursor:pointer;font-size:0.875rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);",o.textContent="\u2190 Back",r.appendChild(o);let i=document.createElement("button");return i.className="juttu-linking-continue-btn juttu-linking-write-submit",i.textContent="Post & Link",i.disabled=!0,r.appendChild(i),e.appendChild(r),n.addEventListener("input",()=>{i.disabled=!n.value.trim()}),e}makeLinkingSelectPost(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Select a post",e.appendChild(t);let n=document.createElement("button");n.className="juttu-linking-back-btn",n.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.3rem 0.65rem;cursor:pointer;font-size:0.8rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);margin-bottom:0.75rem;",n.textContent="\u2190 Back",e.appendChild(n);let r=document.createElement("div");if(r.className="juttu-linking-post-list",this.userPosts.length===0){let o=document.createElement("p");o.className="juttu-linking-spinner",o.textContent="Loading posts\u2026",r.appendChild(o)}else for(let o of this.userPosts){let i=document.createElement("button");i.className="juttu-linking-post-item",i.dataset.uri=o.uri,i.dataset.cid=o.cid;let a=document.createElement("div");a.className="juttu-linking-post-text",a.textContent=o.text.length>180?o.text.slice(0,180)+"\u2026":o.text;let s=document.createElement("div");s.className="juttu-linking-post-date",s.textContent=H(o.createdAt),i.appendChild(a),i.appendChild(s),r.appendChild(i)}return e.appendChild(r),e}handleLinkingClick(e){let t=e.target;if(t.closest(".juttu-linking-start-btn")){this.currentUser?this.documentRecord?this.linkingStep="choose-method":this.linkingStep="metadata":this.linkingStep="login",this.renderLinkingUI();return}if(t.closest(".juttu-login-submit")){this.handleLoginSubmit();return}if(t.closest(".juttu-linking-continue-btn")&&!t.closest(".juttu-linking-write-submit")){let o=this.container.querySelector(".juttu-linking-title-input"),i=this.container.querySelector(".juttu-linking-desc-input"),a=o?.value.trim()??"";if(!a)return;this.linkingTitle=a,this.linkingDescription=i?.value.trim()??"",this.linkingStep="choose-method",this.renderLinkingUI();return}let n=t.closest(".juttu-linking-method-btn");if(n){n.dataset.method==="write"?(this.linkingStep="write-post",this.renderLinkingUI()):n.dataset.method==="select"&&(this.linkingStep="select-post",this.userPosts=[],this.renderLinkingUI(),this.fetchUserPostsAndRender());return}if(t.closest(".juttu-linking-write-submit")){let i=this.container.querySelector(".juttu-linking-textarea")?.value.trim()??"";if(!i)return;this.handleLinkingCreatePost(i);return}let r=t.closest(".juttu-linking-post-item");if(r){let o=r.dataset.uri,i=r.dataset.cid;o&&i&&this.callPutDocument(o,i);return}if(t.closest(".juttu-linking-back-btn")){this.linkingStep="choose-method",this.renderLinkingUI();return}}async fetchUserPostsAndRender(){if(this.currentUser)try{let e=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(this.currentUser.handle)}&filter=posts_no_replies&limit=20`);if(!e.ok)throw new Error(`Failed to fetch posts: ${e.status}`);let t=await e.json();this.userPosts=t.feed.filter(n=>!n.reason).map(n=>({uri:n.post.uri,cid:n.post.cid,text:n.post.record.text,createdAt:n.post.record.createdAt})),this.linkingStep==="select-post"&&this.renderLinkingUI()}catch(e){if(this.linkingStep==="select-post"){let t=this.container.querySelector(".juttu-linking-post-list");if(t){t.innerHTML="";let n=document.createElement("p");n.className="juttu-linking-error",n.textContent=e instanceof Error?e.message:"Failed to load posts",t.appendChild(n)}}}}async handleLinkingCreatePost(e){let t=this.container.querySelector(".juttu-linking-write-submit");t&&(t.disabled=!0,t.textContent="Posting\u2026");try{let r=await(await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:e})}).then(this.checkApiResponse)).json();await this.callPutDocument(r.uri,r.cid)}catch(n){t&&(t.disabled=!1,t.textContent="Post & Link");let r=document.createElement("p");r.className="juttu-linking-error",r.textContent=n instanceof Error?n.message:"Failed to post",this.container.querySelector(".juttu-linking")?.appendChild(r)}}async callPutDocument(e,t){if(!this.documentAtUri)return;let n=this.container.querySelector(".juttu-linking");if(n){let a=document.createElement("p");a.className="juttu-linking-spinner",a.textContent="Linking\u2026",n.appendChild(a)}let r={uri:e,cid:t},o=new Date().toISOString(),i;this.documentRecord?i={...this.documentRecord,bskyPostRef:r,updatedAt:o}:i={$type:"site.standard.document",site:window.location.origin,title:this.linkingTitle,description:this.linkingDescription||void 0,path:window.location.pathname||void 0,publishedAt:o,updatedAt:o,bskyPostRef:r};try{await fetch(`${this.config.apiUrl}/atproto/document`,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:this.documentAtUri.rkey,record:i})}).then(this.checkApiResponse),this.documentAtUri=null,this.documentRecord=null,this.rootPostUri=e,this.rootPostCid=t;let a=await S(e);this.threadData=a,E(a,this.viewerState),this.renderWidget()}catch(a){let s=this.container.querySelector(".juttu-linking");s?.querySelector(".juttu-linking-spinner")?.remove();let u=document.createElement("p");u.className="juttu-linking-error",u.textContent=a instanceof Error?a.message:"Failed to link document",s?.appendChild(u)}}destroy(){this.loginPollInterval!==null&&clearInterval(this.loginPollInterval),this.authMessageHandler&&window.removeEventListener("message",this.authMessageHandler);try{this.loginPopup?.close()}catch{}this.container.innerHTML=""}};if(typeof window<"u"){let e=function(t){let n=t.getAttribute("data-api-url"),r=t.getAttribute("data-theme")??"auto";if(!n){console.error("Juttu: Missing data-api-url attribute on script tag");return}let o=document.getElementById("juttu-comments");if(!o){console.error('Juttu: No element with id="juttu-comments" found on this page');return}new L(o,{apiUrl:n,theme:r})};window.JuttuWidget=L;let l=document.currentScript;l&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>e(l)):e(l))}})();
