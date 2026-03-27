"use strict";var JuttuEmbed=(()=>{var O='<svg class="juttu-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>',V='<svg class="juttu-repost-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',F='<svg class="juttu-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',q='<svg class="juttu-bsky-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" width="16" height="16" fill="currentColor"><path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"/></svg>',W=`
.juttu-comments {
  --juttu-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --juttu-comment-font-family: var(--juttu-font-family);
  --juttu-font-size: 14px;
  --juttu-bg: transparent;
  --juttu-surface: rgba(0, 0, 0, 0.03);
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
  --juttu-accent-color: #1d9bf0;
  --juttu-like-color: #e0245e;
  --juttu-repost-color: #17bf63;
  --juttu-avatar-size: 32px;
  --juttu-radius: 8px;
  --juttu-autocomplete-bg: #ffffff;
}
.juttu-comments[data-juttu-theme="dark"] {
  --juttu-bg: transparent;
  --juttu-surface: rgba(255, 255, 255, 0.05);
  --juttu-border-color: #38444d;
  --juttu-text: #ffffff;
  --juttu-text-muted: #8b98a5;
  --juttu-autocomplete-bg: #1e2d3d;
}
.juttu-comments[data-juttu-theme="light"] {
  --juttu-bg: transparent;
  --juttu-surface: rgba(0, 0, 0, 0.03);
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
}
.juttu-comments {
  font-family: var(--juttu-font-family);
  font-size: var(--juttu-font-size);
  color: var(--juttu-text);
  background: var(--juttu-bg);
  box-sizing: border-box;
}
.juttu-comments *, .juttu-comments *::before, .juttu-comments *::after {
  box-sizing: border-box;
}
.juttu-header {
  margin-bottom: 1rem;
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
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--juttu-border-color);
}
.juttu-login-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--juttu-accent-color);
  font-family: var(--juttu-font-family);
  font-size: 0.875rem;
  text-decoration: underline;
  margin-bottom: 0.5rem;
  display: inline-block;
}
.juttu-login-link:hover { opacity: 0.75; }
.juttu-compose-user { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.juttu-compose-avatar {
  width: var(--juttu-avatar-size);
  height: var(--juttu-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
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
.juttu-compose-actions {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-top: 0.5rem;
}
.juttu-submit-btn {
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
.juttu-author-info { display: flex; flex-direction: column; min-width: 0; flex: 1; gap: 0.1rem; align-items: flex-start; }
.juttu-display-name { font-weight: 700; font-size: 0.875rem; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--juttu-text); text-decoration: none; }
a.juttu-display-name:hover { text-decoration: underline; }
.juttu-handle { font-size: 0.8rem; color: var(--juttu-text-muted); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
a.juttu-handle:hover { text-decoration: underline; }
.juttu-time-link { font-size: 0.75rem; color: var(--juttu-text-muted); text-decoration: none; flex-shrink: 0; white-space: nowrap; }
.juttu-time-link:hover { text-decoration: underline; }
.juttu-comment-body { font-family: var(--juttu-comment-font-family); font-size: 0.875rem; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; margin-bottom: 0.4rem; color: var(--juttu-text); }
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
.juttu-linking-login-btn {
  background: var(--juttu-accent-color); color: #fff; border: none;
  border-radius: var(--juttu-radius); padding: 0.45rem 1.1rem;
  cursor: pointer; font-size: 0.875rem; font-family: var(--juttu-font-family);
  font-weight: 500; transition: opacity 0.15s;
}
.juttu-linking-login-btn:hover { opacity: 0.88; }
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
/* Editor backdrop overlay */
.juttu-editor-wrap { position: relative; background: var(--juttu-surface); border-radius: var(--juttu-radius); }
.juttu-editor-wrap .juttu-compose-input,
.juttu-editor-wrap .juttu-reply-input { color: transparent; caret-color: var(--juttu-text); background: transparent; position: relative; }
.juttu-editor-backdrop {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none; overflow: hidden;
  white-space: pre-wrap; word-break: break-word;
  border: 1px solid transparent;
}
.juttu-editor-highlight-mention,
.juttu-editor-highlight-link,
.juttu-editor-highlight-tag { color: var(--juttu-accent-color); }
/* Mention autocomplete */
.juttu-autocomplete {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 10;
  background: var(--juttu-autocomplete-bg); border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius); margin-top: 2px;
  list-style: none; padding: 0; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.juttu-autocomplete-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.65rem; cursor: pointer;
  width: 100%; background: none; border: none; text-align: left;
  font-family: var(--juttu-font-family); font-size: 0.8125rem;
  color: var(--juttu-text);
}
.juttu-autocomplete-item:hover,
.juttu-autocomplete-item:focus { background: var(--juttu-surface); outline: none; }
.juttu-autocomplete-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.juttu-autocomplete-handle { font-size: 0.75rem; color: var(--juttu-text-muted); }
`;function K(l){if(!l.startsWith("at://"))return null;let e=l.slice(5).split("/");if(e.length!==3)return null;let[t,n,r]=e;return!t||!n||!r?null:{did:t,collection:n,rkey:r}}async function Q(l){let e;if(l.startsWith("did:plc:")){let n=await fetch(`https://plc.directory/${l}`);if(!n.ok)throw new Error(`Failed to resolve DID: ${n.status}`);e=await n.json()}else if(l.startsWith("did:web:")){let n=l.split(":").slice(2).join(":"),r=await fetch(`https://${n}/.well-known/did.json`);if(!r.ok)throw new Error(`Failed to resolve did:web DID: ${r.status}`);e=await r.json()}else throw new Error(`Unsupported DID method: ${l}`);let t=e.service?.find(n=>n.type==="AtprotoPersonalDataServer");if(!t?.serviceEndpoint)throw new Error("No PDS endpoint found in DID document");return t.serviceEndpoint}async function X(l,e){let t=`${l}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(e.did)}&collection=${encodeURIComponent(e.collection)}&rkey=${encodeURIComponent(e.rkey)}`,n=await fetch(t);if(n.status>=400&&n.status<500)return null;if(!n.ok)throw new Error(`Failed to fetch document record: ${n.status}`);return(await n.json()).value}async function T(l){let e=`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(l)}&depth=10&parentHeight=0`,t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch thread: ${t.status}`);let n=await t.json();if(!n.thread)throw new Error("Thread data missing from response");return n.thread}async function R(l,e){try{let t=await fetch(`${l}/bsky/thread?uri=${encodeURIComponent(e)}`,{credentials:"include"});if(!t.ok)return new Map;let n=await t.json();return new Map(Object.entries(n.states))}catch{return new Map}}async function H(l){try{let e=await fetch(`${l}/auth/me`,{credentials:"include"});return e.ok?await e.json():null}catch{return null}}async function I(l){try{let e=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(l)}`);if(!e.ok)return{};let t=await e.json();return{avatar:t.avatar,displayName:t.displayName}}catch{return{}}}function z(l){let e=Math.floor((Date.now()-new Date(l).getTime())/1e3);return e<60?"just now":e<3600?`${Math.floor(e/60)}m`:e<86400?`${Math.floor(e/3600)}h`:e<2592e3?`${Math.floor(e/86400)}d`:e<31536e3?`${Math.floor(e/2592e3)}mo`:`${Math.floor(e/31536e3)}y`}function st(l){return l.startsWith("https://")||l.startsWith("http://")}function tt(l,e){let t=document.createDocumentFragment(),n=new TextEncoder,r=new TextDecoder,o=n.encode(l);if(!e||e.length===0)return t.appendChild(document.createTextNode(l)),t;let s=[...e].sort((a,u)=>a.index.byteStart-u.index.byteStart),i=0;for(let a of s){let{byteStart:u,byteEnd:c}=a.index;u>i&&t.appendChild(document.createTextNode(r.decode(o.slice(i,u))));let d=r.decode(o.slice(u,c)),h=a.features[0];if(!h)t.appendChild(document.createTextNode(d));else if(h.$type==="app.bsky.richtext.facet#link")if(st(h.uri)){let p=document.createElement("a");p.className="juttu-link",p.href=h.uri,p.target="_blank",p.rel="noopener noreferrer",p.textContent=d,t.appendChild(p)}else t.appendChild(document.createTextNode(d));else if(h.$type==="app.bsky.richtext.facet#mention"){let p=document.createElement("a");p.className="juttu-mention",p.href=`https://bsky.app/profile/${h.did}`,p.target="_blank",p.rel="noopener noreferrer",p.textContent=d,t.appendChild(p)}else if(h.$type==="app.bsky.richtext.facet#tag"){let p=document.createElement("a");p.className="juttu-hashtag",p.href=`https://bsky.app/search?q=${encodeURIComponent("#"+h.tag)}`,p.target="_blank",p.rel="noopener noreferrer",p.textContent=d,t.appendChild(p)}else t.appendChild(document.createTextNode(d));i=c}return i<o.length&&t.appendChild(document.createTextNode(r.decode(o.slice(i)))),t}function et(l){return(l.replies??[]).filter(e=>e.$type==="app.bsky.feed.defs#threadViewPost")}function D(l,e){return[...l].sort((t,n)=>e==="most-liked"?(n.post.likeCount??0)-(t.post.likeCount??0):e==="oldest"?new Date(t.post.indexedAt).getTime()-new Date(n.post.indexedAt).getTime():new Date(n.post.indexedAt).getTime()-new Date(t.post.indexedAt).getTime())}function C(l,e){let{post:t}=l;(t.viewer?.like||t.viewer?.repost)&&e.set(t.uri,{likeUri:t.viewer.like,repostUri:t.viewer.repost});for(let n of l.replies??[])n.$type==="app.bsky.feed.defs#threadViewPost"&&C(n,e)}function B(l,e){if(!l)return null;if(l.post.uri===e)return l.post;for(let t of l.replies??[])if(t.$type==="app.bsky.feed.defs#threadViewPost"){let n=B(t,e);if(n)return n}return null}var Z=/@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+)/g,G=/https?:\/\/[^\s\x00-\x1f<>"]+/g,J=/(^|[\s(])((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s\x00-\x1f<>"]*)?)/g,Y=/#[^\s\x00-\x1f.,;!?\-#]{1,64}/g,M=/[.,;!?)\]]+$/;function at(l){let t=l.split("/")[0].split(".").at(-1)??"";return t.length>=2&&/^[a-z]+$/i.test(t)}function nt(l){let e=[],t;for(G.lastIndex=0;(t=G.exec(l))!==null;){let i=t[0].replace(M,"");i&&e.push({start:t.index,end:t.index+i.length,type:"link"})}for(J.lastIndex=0;(t=J.exec(l))!==null;){let i=t[1]??"",a=t[2];if(!at(a))continue;let u=t.index+i.length,c=a.replace(M,"");c&&e.push({start:u,end:u+c.length,type:"link"})}for(Y.lastIndex=0;(t=Y.exec(l))!==null;){let i=t[0].replace(M,"");i&&e.push({start:t.index,end:t.index+i.length,type:"tag"})}for(Z.lastIndex=0;(t=Z.exec(l))!==null;){let i=t.index;if(i>0){let a=l[i-1];if(a!==" "&&a!=="	"&&a!==`
`&&a!=="(")continue}e.push({start:i,end:i+t[0].length,type:"mention"})}e.sort((i,a)=>i.start-a.start);let n=[],r=0;for(let i of e)i.start<r||(n.push(i),r=i.end);let o=[],s=0;for(let i of n)i.start>s&&o.push({text:l.slice(s,i.start),type:"plain"}),o.push({text:l.slice(i.start,i.end),type:i.type}),s=i.end;return s<l.length&&o.push({text:l.slice(s),type:"plain"}),o}var E=class{constructor(e,t){this.threadData=null;this.currentUser=null;this.rootPostUri=null;this.rootPostCid=null;this.sortOrder="newest";this.pagination={visibleTopLevel:10,visibleReplies:new Map};this.viewerState=new Map;this.openReplyFormUri=null;this.loginPopup=null;this.loginPollInterval=null;this.loginPollStartTime=0;this.popupClosedAt=0;this.pendingAction=null;this.mentionDebounceTimer=null;this.activeSuggestionsTextarea=null;this.documentAtUri=null;this.documentRecord=null;this.linkingStep="setup";this.linkingTitle="";this.linkingDescription="";this.userPosts=[];this.checkApiResponse=async e=>{if(!e.ok){let t=await e.json().catch(()=>({}));throw new Error(t.error??`Request failed (${e.status})`)}return e};this.container=e,this.config=t,this.injectStyles(),this.init()}injectStyles(){if(document.getElementById("juttu-styles"))return;let e=document.createElement("style");e.id="juttu-styles",e.textContent=W,document.head.appendChild(e)}async init(){this.renderLoading();try{let e=document.querySelector('link[rel="site.standard.document"]');if(!e){this.renderError('Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.');return}let t=e.getAttribute("href");if(!t||!t.startsWith("at://")){this.renderError('Invalid <link rel="site.standard.document" href> \u2014 must be an AT URI (at://).');return}let n=K(t);if(!n){this.renderError("Could not parse AT URI from link tag.");return}let r=await Q(n.did),o=await X(r,n);o?.bskyPostRef?.uri?(this.rootPostUri=o.bskyPostRef.uri,this.rootPostCid=o.bskyPostRef.cid,this.threadData=await T(o.bskyPostRef.uri),C(this.threadData,this.viewerState),this.renderWidget()):(this.documentAtUri=n,this.documentRecord=o,this.linkingStep="setup",this.renderLinkingUI())}catch(e){let t=e instanceof Error?e.message:"Unknown error";this.renderError(`Could not load comments: ${t}`)}}renderLoading(){this.container.innerHTML="";let e=this.makeRoot(),t=document.createElement("div");t.className="juttu-loading",t.textContent="Loading comments\u2026",e.appendChild(t),this.container.appendChild(e)}renderError(e){this.container.innerHTML="";let t=this.makeRoot(),n=document.createElement("div");n.className="juttu-error",n.textContent=`Juttu: ${e}`,t.appendChild(n),this.container.appendChild(t)}detectTheme(){let e=document.createElement("div");this.container.appendChild(e);let t=window.getComputedStyle(e).color;this.container.removeChild(e);let n=t.match(/\d+/g);if(!n||n.length<3)return"light";let[r,o,s]=n.map(Number);return r<=120&&o<=120&&s<=120?"light":"dark"}makeRoot(){let e=document.createElement("div");e.className="juttu-comments";let t=this.config.theme==="auto"?this.detectTheme():this.config.theme;return e.setAttribute("data-juttu-theme",t),e}renderWidget(){this.container.innerHTML="";let e=this.makeRoot(),t=this.threadData?et(this.threadData):[];e.appendChild(this.renderHeader(t.length)),e.appendChild(this.renderComposer()),e.appendChild(this.renderThread(t));let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),e.appendChild(n),e.addEventListener("click",o=>this.handleClick(o)),e.addEventListener("input",o=>{let s=o.target;if(s.classList.contains("juttu-compose-input")){let i=e.querySelector(".juttu-submit-btn");i&&(i.disabled=!s.value.trim())}if(s.classList.contains("juttu-reply-input")){let a=s.closest(".juttu-reply-form")?.querySelector(".juttu-reply-submit");a&&(a.disabled=!s.value.trim())}}),this.container.appendChild(e)}handleClick(e){let t=e.target,n=t.closest(".juttu-sort-btn");if(n){let a=n.dataset.sort;a&&this.setSortOrder(a);return}if(t.closest(".juttu-load-more-btn")){this.pagination.visibleTopLevel+=10,this.renderWidget();return}let r=t.closest(".juttu-show-replies-btn");if(r){let a=r.dataset.uri;if(a){let u=this.pagination.visibleReplies.get(a)??3;this.pagination.visibleReplies.set(a,u+3),this.renderWidget()}return}if(t.closest(".juttu-login-link")){this.resolveAuth();return}if(t.closest(".juttu-logout-btn")){this.handleLogout();return}let o=t.closest(".juttu-like-btn");if(o){this.resolveAuth(()=>this.handleLike(o));return}let s=t.closest(".juttu-repost-btn");if(s){this.resolveAuth(()=>this.handleRepost(s));return}let i=t.closest(".juttu-reply-btn");if(i){let a=i.dataset.uri;a&&this.handleToggleReplyForm(a);return}if(t.closest(".juttu-reply-cancel")){this.closeReplyForm();return}if(t.closest(".juttu-reply-submit")){this.openReplyFormUri&&this.resolveAuth(()=>this.handleSubmitReply(this.openReplyFormUri));return}if(t.closest(".juttu-submit-btn")){this.resolveAuth(()=>this.handlePost());return}}setSortOrder(e){this.sortOrder=e,this.pagination.visibleTopLevel=10,this.pagination.visibleReplies.clear(),this.renderWidget()}renderHeader(e){let t=document.createElement("div");t.className="juttu-header";let n=document.createElement("h2");return n.className="juttu-title",n.textContent=`${e} Comment${e!==1?"s":""}`,t.appendChild(n),t}makeSortControls(){let e=document.createElement("div");e.className="juttu-sort-controls";for(let{value:t,label:n}of[{value:"newest",label:"Newest"},{value:"oldest",label:"Oldest"},{value:"most-liked",label:"Top"}]){let r=document.createElement("button");r.className="juttu-sort-btn"+(this.sortOrder===t?" juttu-sort-btn--active":""),r.dataset.sort=t,r.textContent=n,e.appendChild(r)}return e}renderComposer(){let e=document.createElement("div");return e.className="juttu-composer",e.appendChild(this.makeComposeArea()),e}makeComposeArea(){let e=document.createElement("div");if(e.className="juttu-compose-area",this.currentUser){let i=document.createElement("div");if(i.className="juttu-compose-user",this.currentUser.avatar){let d=document.createElement("img");d.className="juttu-compose-avatar",d.src=this.currentUser.avatar,d.alt=this.currentUser.handle,i.appendChild(d)}else{let d=document.createElement("div");d.className="juttu-avatar-placeholder",i.appendChild(d)}let a=document.createElement("div");if(a.className="juttu-author-info",this.currentUser.displayName){let d=document.createElement("span");d.className="juttu-display-name",d.textContent=this.currentUser.displayName,a.appendChild(d)}let u=document.createElement("span");u.className="juttu-handle",u.textContent=`@${this.currentUser.handle}`,a.appendChild(u),i.appendChild(a);let c=document.createElement("button");c.className="juttu-logout-btn",c.textContent="Logout",i.appendChild(c),e.appendChild(i)}else{let i=document.createElement("button");i.className="juttu-login-link",i.textContent="Login to comment",e.appendChild(i)}let t=document.createElement("textarea");t.className="juttu-compose-input",t.placeholder="Write a comment\u2026",t.rows=3;let{wrap:n,backdrop:r}=this.buildEditorWrap(t);e.appendChild(n),setTimeout(()=>this.syncBackdropStyles(r,t),0),t.addEventListener("input",()=>{this.updateBackdrop(r,t.value),this.handleMentionInput(t)}),t.addEventListener("scroll",()=>this.syncScroll(r,t)),t.addEventListener("keydown",i=>{i.key==="Escape"&&this.dismissAutocomplete(t)});let o=document.createElement("div");o.className="juttu-compose-actions",o.appendChild(this.makeSortControls());let s=document.createElement("button");return s.className="juttu-submit-btn",s.textContent="Post comment",s.disabled=!0,o.appendChild(s),e.appendChild(o),e}renderThread(e){let t=document.createElement("div");t.className="juttu-thread";let n=D(e,this.sortOrder),r=n.slice(0,this.pagination.visibleTopLevel);for(let o of r)t.appendChild(this.renderComment(o,0));if(n.length>this.pagination.visibleTopLevel){let o=document.createElement("div");o.className="juttu-load-more";let s=document.createElement("button");s.className="juttu-load-more-btn";let i=n.length-this.pagination.visibleTopLevel;s.textContent=`Load ${Math.min(i,10)} more comments`,o.appendChild(s),t.appendChild(o)}return t}renderComment(e,t){let{post:n}=e,r=n.uri.split("/").pop()??"",o=`https://bsky.app/profile/${n.author.did}/post/${r}`,s=`https://bsky.app/profile/${n.author.handle}`,i=document.createElement("div");i.className="juttu-comment",i.dataset.uri=n.uri,i.dataset.cid=n.cid;let a=document.createElement("div");if(a.className="juttu-comment-header",n.author.avatar){let m=document.createElement("a");m.className="juttu-avatar-link",m.href=s,m.target="_blank",m.rel="noopener noreferrer";let g=document.createElement("img");g.className="juttu-avatar",g.src=n.author.avatar,g.alt=n.author.handle,g.loading="lazy",m.appendChild(g),a.appendChild(m)}else{let m=document.createElement("div");m.className="juttu-avatar-placeholder",a.appendChild(m)}let u=document.createElement("div");u.className="juttu-author-info";let c=document.createElement("a");c.className="juttu-display-name",c.href=s,c.target="_blank",c.rel="noopener noreferrer",c.textContent=n.author.displayName||n.author.handle,u.appendChild(c);let d=document.createElement("a");d.className="juttu-handle",d.href=s,d.target="_blank",d.rel="noopener noreferrer",d.textContent=`@${n.author.handle}`,u.appendChild(d),a.appendChild(u);let h=document.createElement("a");h.className="juttu-time-link",h.href=o,h.target="_blank",h.rel="noopener noreferrer",h.textContent=z(n.indexedAt),h.title=new Date(n.indexedAt).toLocaleString(),a.appendChild(h),i.appendChild(a);let p=document.createElement("div");p.className="juttu-comment-body";let P=document.createElement("p");if(P.style.margin="0",P.appendChild(tt(n.record.text,n.record.facets)),p.appendChild(P),i.appendChild(p),n.embed?.$type==="app.bsky.embed.images#view"&&n.embed.images?.length){let m=document.createElement("div");m.className="juttu-comment-images";for(let g of n.embed.images){let f=document.createElement("a");f.className="juttu-comment-image-link",f.href=o,f.target="_blank",f.rel="noopener noreferrer";let v=document.createElement("img");v.className="juttu-comment-image",v.src=g.thumb,v.alt=g.alt||"Embedded image",v.loading="lazy",f.appendChild(v),m.appendChild(f)}i.appendChild(m)}let $=this.viewerState.get(n.uri)??{},ot=!!$.likeUri,it=!!$.repostUri,y=document.createElement("div");y.className="juttu-comment-actions";let j=document.createElement("button");j.className="juttu-like-btn",j.dataset.liked=String(ot),j.dataset.uri=n.uri,j.dataset.cid=n.cid,j.title="Like",j.innerHTML=O;let N=document.createElement("span");N.className="juttu-like-count",N.textContent=String(n.likeCount??0),j.appendChild(N),y.appendChild(j);let b=document.createElement("button");b.className="juttu-repost-btn",b.dataset.reposted=String(it),b.dataset.uri=n.uri,b.dataset.cid=n.cid,b.title="Repost",b.innerHTML=V;let A=document.createElement("span");A.className="juttu-repost-count",A.textContent=String(n.repostCount??0),b.appendChild(A),y.appendChild(b);let x=document.createElement("button");x.className="juttu-reply-btn",x.dataset.uri=n.uri,x.title="Reply",x.innerHTML=F;let U=document.createElement("span");U.className="juttu-reply-count",U.textContent=String(n.replyCount??0),x.appendChild(U),y.appendChild(x);let k=document.createElement("a");k.className="juttu-bsky-link",k.href=o,k.target="_blank",k.rel="noopener noreferrer",k.title="View on Bluesky",k.innerHTML=q,y.appendChild(k),i.appendChild(y);let _=(e.replies??[]).filter(m=>m.$type==="app.bsky.feed.defs#threadViewPost");if(_.length>0){let m=document.createElement("div");m.className="juttu-replies";let g=this.pagination.visibleReplies.get(n.uri)??3,f=D(_,this.sortOrder);for(let w of f.slice(0,g))m.appendChild(this.renderComment(w,t+1));let v=f.length-g;if(v>0){let w=document.createElement("button");w.className="juttu-show-replies-btn",w.dataset.uri=n.uri,w.textContent=`Show ${Math.min(v,3)} more repl${v===1?"y":"ies"}`,m.appendChild(w)}i.appendChild(m)}return i}getComposer(){return this.container.querySelector(".juttu-composer")??this.container.querySelector(".juttu-linking")}openLoginPopup(){if(this.loginPollInterval!==null){try{this.loginPopup?.focus()}catch{}return}this.loginPopup=window.open(`${this.config.apiUrl}/login`,"juttu-auth","width=500,height=600,menubar=no,toolbar=no,location=no,status=no"),this.loginPollStartTime=Date.now(),this.popupClosedAt=0,this.loginPollInterval=setInterval(()=>this.pollForLogin(),1500)}async pollForLogin(){if(Date.now()-this.loginPollStartTime>12e4){this.cancelLogin();return}let t=await H(this.config.apiUrl);t?await this.completeLogin(t):this.loginPopup?.closed&&(this.popupClosedAt||(this.popupClosedAt=Date.now()),Date.now()-this.popupClosedAt>5e3&&this.cancelLogin())}async completeLogin(e){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null);try{this.loginPopup?.close()}catch{}this.loginPopup=null;let t=await I(e.handle);if(this.currentUser={...e,...t},this.documentAtUri)this.linkingStep=this.documentRecord?"choose-method":"metadata",this.renderLinkingUI();else{let n=this.getComposer();n&&(this.clearMentionState(),n.innerHTML="",n.appendChild(this.makeComposeArea()));let r=this.pendingAction;if(this.pendingAction=null,await r?.(),this.rootPostUri){let o=await R(this.config.apiUrl,this.rootPostUri);for(let[s,i]of o){let a=this.viewerState.get(s);a?.likeUri==="pending"||a?.repostUri==="pending"||this.viewerState.set(s,i)}this.renderWidget()}}}cancelLogin(){this.pendingAction=null,this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null);try{this.loginPopup?.close()}catch{}if(this.loginPopup=null,this.documentAtUri)this.linkingStep="login",this.renderLinkingUI();else{let e=this.getComposer();e&&(this.clearMentionState(),e.innerHTML="",e.appendChild(this.makeComposeArea()))}}async handleLogout(){try{await fetch(`${this.config.apiUrl}/auth/logout`,{method:"POST",credentials:"include"})}catch{}this.currentUser=null,this.viewerState.clear(),this.clearMentionState(),this.renderWidget()}async resolveAuth(e){if(this.currentUser){await e?.();return}let t=await H(this.config.apiUrl);if(t){let n=await I(t.handle);if(this.currentUser={...t,...n},this.documentAtUri)this.linkingStep=this.documentRecord?"choose-method":"metadata",this.renderLinkingUI();else{let r=this.getComposer();if(r&&(this.clearMentionState(),r.innerHTML="",r.appendChild(this.makeComposeArea())),await e?.(),this.rootPostUri){let o=await R(this.config.apiUrl,this.rootPostUri);for(let[s,i]of o){let a=this.viewerState.get(s);a?.likeUri==="pending"||a?.repostUri==="pending"||this.viewerState.set(s,i)}this.renderWidget()}}}else this.documentAtUri?(this.linkingStep="login",this.renderLinkingUI()):(this.pendingAction=e??null,this.openLoginPopup())}async handleLike(e){let t=e.dataset.uri,n=e.dataset.cid;if(!t||!n)return;let r=this.viewerState.get(t)??{},o=!!r.likeUri,s=e.querySelector(".juttu-like-count"),i=parseInt(s?.textContent??"0",10),a=!o;e.dataset.liked=String(a),s&&(s.textContent=String(i+(a?1:-1))),this.viewerState.set(t,{...r,likeUri:a?"pending":void 0});try{if(o&&r.likeUri){let u=r.likeUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/like`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:u})}).then(this.checkApiResponse),this.viewerState.set(t,{...r,likeUri:void 0})}else{let c=await(await fetch(`${this.config.apiUrl}/bsky/like`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:t,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(t,{...r,likeUri:c.uri})}}catch(u){e.dataset.liked=String(o),s&&(s.textContent=String(i)),this.viewerState.set(t,r),this.showActionError(e,u instanceof Error?u.message:"Action failed")}}async handleRepost(e){let t=e.dataset.uri,n=e.dataset.cid;if(!t||!n)return;let r=this.viewerState.get(t)??{},o=!!r.repostUri,s=e.querySelector(".juttu-repost-count"),i=parseInt(s?.textContent??"0",10),a=!o;e.dataset.reposted=String(a),s&&(s.textContent=String(i+(a?1:-1))),this.viewerState.set(t,{...r,repostUri:a?"pending":void 0});try{if(o&&r.repostUri){let u=r.repostUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:u})}).then(this.checkApiResponse),this.viewerState.set(t,{...r,repostUri:void 0})}else{let c=await(await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:t,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(t,{...r,repostUri:c.uri})}}catch(u){e.dataset.reposted=String(o),s&&(s.textContent=String(i)),this.viewerState.set(t,r),this.showActionError(e,u instanceof Error?u.message:"Action failed")}}handleToggleReplyForm(e){if(this.openReplyFormUri===e){this.closeReplyForm();return}this.closeReplyForm();let t=this.container.querySelector(`.juttu-comment[data-uri="${CSS.escape(e)}"]`);if(!t)return;let n=document.createElement("div");n.className="juttu-reply-form";let r=document.createElement("textarea");r.className="juttu-reply-input",r.placeholder="Write a reply\u2026",r.rows=2;let{wrap:o,backdrop:s}=this.buildEditorWrap(r);n.appendChild(o),setTimeout(()=>this.syncBackdropStyles(s,r),0),r.addEventListener("input",()=>{this.updateBackdrop(s,r.value),this.handleMentionInput(r)}),r.addEventListener("scroll",()=>this.syncScroll(s,r)),r.addEventListener("keydown",h=>{h.key==="Escape"&&this.dismissAutocomplete(r)});let i=document.createElement("div");i.className="juttu-reply-form-actions";let a=document.createElement("span");a.className="juttu-reply-hint",a.textContent="Reply posts to Bluesky",i.appendChild(a);let u=document.createElement("button");u.className="juttu-reply-cancel",u.textContent="Cancel",i.appendChild(u);let c=document.createElement("button");c.className="juttu-reply-submit",c.textContent="Reply",c.disabled=!0,i.appendChild(c),n.appendChild(i);let d=t.querySelector(".juttu-comment-actions");d?.nextSibling?t.insertBefore(n,d.nextSibling):t.appendChild(n),this.openReplyFormUri=e,r.focus()}closeReplyForm(){if(!this.openReplyFormUri)return;this.container.querySelector(".juttu-reply-form")?.remove(),this.openReplyFormUri=null}async handlePost(){let e=this.container.querySelector(".juttu-compose-input"),t=this.container.querySelector(".juttu-submit-btn");if(!e||!t)return;let n=e.value.trim();if(!(!n||!this.rootPostUri||!this.rootPostCid)){t.disabled=!0,t.textContent="Posting\u2026",this.container.querySelector(".juttu-post-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:n,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:this.rootPostUri,cid:this.rootPostCid}}})}).then(this.checkApiResponse),e.value="";let r=e.closest(".juttu-editor-wrap")?.querySelector(".juttu-editor-backdrop");r&&this.updateBackdrop(r,""),t.disabled=!0,t.textContent="Post comment",setTimeout(()=>this.refetchAndRender(),1500)}catch(r){t.disabled=!1,t.textContent="Post comment";let o=document.createElement("div");o.className="juttu-post-error",o.textContent=r instanceof Error?r.message:"Failed to post",t.insertAdjacentElement("afterend",o)}}}async handleSubmitReply(e){let t=this.container.querySelector(".juttu-reply-form");if(!t)return;let n=t.querySelector(".juttu-reply-input"),r=t.querySelector(".juttu-reply-submit");if(!n||!r)return;let o=n.value.trim();if(!o||!this.rootPostUri||!this.rootPostCid)return;let s=B(this.threadData,e);if(s){r.disabled=!0,r.textContent="Replying\u2026",t.querySelector(".juttu-reply-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:o,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:s.uri,cid:s.cid}}})}).then(this.checkApiResponse),this.closeReplyForm(),setTimeout(()=>this.refetchAndRender(),1500)}catch(i){r.disabled=!1,r.textContent="Reply";let a=document.createElement("div");a.className="juttu-reply-error",a.textContent=i instanceof Error?i.message:"Failed to post reply",t.appendChild(a)}}}async refetchAndRender(){if(this.rootPostUri)try{let e=await T(this.rootPostUri);this.threadData=e;let t=new Map;C(e,t);for(let[n,r]of t){let o=this.viewerState.get(n),s={likeUri:o?.likeUri!=="pending"?o?.likeUri??r.likeUri:r.likeUri,repostUri:o?.repostUri!=="pending"?o?.repostUri??r.repostUri:r.repostUri};(s.likeUri||s.repostUri)&&t.set(n,s)}this.viewerState=t,this.renderWidget()}catch{}}buildEditorWrap(e){let t=document.createElement("div");t.className="juttu-editor-wrap";let n=document.createElement("div");return n.className="juttu-editor-backdrop",n.setAttribute("aria-hidden","true"),t.appendChild(n),t.appendChild(e),{wrap:t,backdrop:n}}syncBackdropStyles(e,t){let n=window.getComputedStyle(t);for(let r of["paddingTop","paddingRight","paddingBottom","paddingLeft","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing"])e.style[r]=n[r]}updateBackdrop(e,t){for(;e.firstChild;)e.removeChild(e.firstChild);for(let n of nt(t))if(n.type==="plain")e.appendChild(document.createTextNode(n.text));else{let r=document.createElement("span");r.className=`juttu-editor-highlight-${n.type}`,r.textContent=n.text,e.appendChild(r)}e.appendChild(document.createTextNode(`
`))}syncScroll(e,t){e.scrollTop=t.scrollTop}clearMentionState(){this.mentionDebounceTimer!==null&&(clearTimeout(this.mentionDebounceTimer),this.mentionDebounceTimer=null),this.activeSuggestionsTextarea=null}handleMentionInput(e){let t=e.selectionStart??e.value.length,r=e.value.slice(0,t).match(/@([a-zA-Z0-9][a-zA-Z0-9.-]*)$/);r?(this.activeSuggestionsTextarea=e,this.mentionDebounceTimer!==null&&clearTimeout(this.mentionDebounceTimer),this.mentionDebounceTimer=setTimeout(()=>{this.fetchMentionSuggestions(r[1],e)},300)):this.dismissAutocomplete(e)}async fetchMentionSuggestions(e,t){if(this.activeSuggestionsTextarea===t)try{let n=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${encodeURIComponent(e)}&limit=4`);if(!n.ok||this.activeSuggestionsTextarea!==t)return;let r=await n.json();this.renderAutocomplete(r.actors,t)}catch{this.dismissAutocomplete(t)}}renderAutocomplete(e,t){let n=t.closest(".juttu-editor-wrap");if(!n||(n.querySelector(".juttu-autocomplete")?.remove(),e.length===0))return;let r=document.createElement("ul");r.className="juttu-autocomplete";for(let o of e){let s=document.createElement("li"),i=document.createElement("button");if(i.className="juttu-autocomplete-item",i.type="button",o.avatar){let c=document.createElement("img");c.className="juttu-autocomplete-avatar",c.src=o.avatar,c.alt="",i.appendChild(c)}else{let c=document.createElement("div");c.className="juttu-autocomplete-avatar",c.style.background="var(--juttu-border-color)",i.appendChild(c)}let a=document.createElement("div");if(o.displayName){let c=document.createElement("div");c.style.fontWeight="600",c.textContent=o.displayName,a.appendChild(c)}let u=document.createElement("div");u.className="juttu-autocomplete-handle",u.textContent=`@${o.handle}`,a.appendChild(u),i.appendChild(a),i.addEventListener("mousedown",c=>{c.preventDefault(),this.applyMentionSuggestion(o.handle,t)}),s.appendChild(i),r.appendChild(s)}n.appendChild(r)}applyMentionSuggestion(e,t){let n=t.selectionStart??t.value.length,r=t.value.slice(0,n).replace(/@([a-zA-Z0-9][a-zA-Z0-9.-]*)$/,`@${e} `);t.value=r+t.value.slice(n);let o=r.length;setTimeout(()=>{t.focus(),t.setSelectionRange(o,o)},0),this.dismissAutocomplete(t);let s=t.closest(".juttu-editor-wrap")?.querySelector(".juttu-editor-backdrop");s&&this.updateBackdrop(s,t.value)}dismissAutocomplete(e){this.mentionDebounceTimer!==null&&(clearTimeout(this.mentionDebounceTimer),this.mentionDebounceTimer=null),this.activeSuggestionsTextarea=null,e.closest(".juttu-editor-wrap")?.querySelector(".juttu-autocomplete")?.remove()}showActionError(e,t){e.parentElement?.querySelector(".juttu-action-error")?.remove();let n=document.createElement("div");n.className="juttu-action-error",n.textContent=t,e.insertAdjacentElement("afterend",n),setTimeout(()=>n.remove(),4e3)}renderLinkingUI(){this.container.innerHTML="";let e=this.makeRoot(),t=document.createElement("div");switch(t.className="juttu-linking",this.linkingStep){case"setup":t.appendChild(this.makeLinkingSetup());break;case"login":t.appendChild(this.makeLinkingLoginForm());break;case"metadata":t.appendChild(this.makeLinkingMetadata());break;case"choose-method":t.appendChild(this.makeLinkingChooseMethod());break;case"write-post":t.appendChild(this.makeLinkingWritePost());break;case"select-post":t.appendChild(this.makeLinkingSelectPost());break}e.appendChild(t),e.addEventListener("click",o=>this.handleLinkingClick(o));let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),e.appendChild(n),this.container.appendChild(e)}makeLinkingSetup(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title";let n=document.createElement("p");n.className="juttu-linking-desc",this.documentRecord?(t.textContent="Comments not linked yet",n.textContent="Link this article to a Bluesky post to enable the comment thread."):(t.textContent="Comments not set up yet",n.textContent="Set up a Bluesky-powered comment thread for this article."),e.appendChild(t),e.appendChild(n);let r=document.createElement("button");return r.className="juttu-linking-start-btn",r.textContent=this.documentRecord?"Link comments":"Set up comments",e.appendChild(r),e}makeLinkingLoginForm(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Sign in as the document owner",e.appendChild(t);let n=document.createElement("button");return n.className="juttu-linking-login-btn",n.textContent="Login with Bluesky \u2192",e.appendChild(n),e}makeLinkingMetadata(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Article details",e.appendChild(t);let n=document.createElement("div");n.className="juttu-linking-field";let r=document.createElement("label");r.className="juttu-linking-label",r.textContent="Title *",n.appendChild(r);let o=document.createElement("input");o.type="text",o.className="juttu-linking-input juttu-linking-title-input",o.placeholder="Article title",o.value=this.linkingTitle,n.appendChild(o),e.appendChild(n);let s=document.createElement("div");s.className="juttu-linking-field";let i=document.createElement("label");i.className="juttu-linking-label",i.textContent="Description (optional)",s.appendChild(i);let a=document.createElement("input");a.type="text",a.className="juttu-linking-input juttu-linking-desc-input",a.placeholder="Short description",a.value=this.linkingDescription,s.appendChild(a),e.appendChild(s);let u=document.createElement("button");return u.className="juttu-linking-continue-btn",u.textContent="Continue",u.disabled=!this.linkingTitle.trim(),e.appendChild(u),o.addEventListener("input",()=>{u.disabled=!o.value.trim()}),e}makeLinkingChooseMethod(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Link a Bluesky post",e.appendChild(t);let n=document.createElement("p");n.className="juttu-linking-desc",n.textContent="This post becomes the root of the comment thread.",e.appendChild(n);let r=document.createElement("div");r.className="juttu-linking-methods";let o=document.createElement("button");o.className="juttu-linking-method-btn",o.dataset.method="write";let s=document.createElement("div");s.className="juttu-linking-method-title",s.textContent="Write a new post";let i=document.createElement("div");i.className="juttu-linking-method-desc",i.textContent="Compose a post to announce this article",o.appendChild(s),o.appendChild(i),r.appendChild(o);let a=document.createElement("button");a.className="juttu-linking-method-btn",a.dataset.method="select";let u=document.createElement("div");u.className="juttu-linking-method-title",u.textContent="Use an existing post";let c=document.createElement("div");return c.className="juttu-linking-method-desc",c.textContent="Pick from your recent Bluesky posts",a.appendChild(u),a.appendChild(c),r.appendChild(a),e.appendChild(r),e}makeLinkingWritePost(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Write a post",e.appendChild(t);let n=document.createElement("textarea");n.className="juttu-linking-textarea",n.placeholder="Share this article on Bluesky\u2026",e.appendChild(n);let r=document.createElement("div");r.style.cssText="display:flex;gap:0.5rem;margin-top:0.5rem;";let o=document.createElement("button");o.className="juttu-linking-back-btn",o.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.4rem 0.75rem;cursor:pointer;font-size:0.875rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);",o.textContent="\u2190 Back",r.appendChild(o);let s=document.createElement("button");return s.className="juttu-linking-continue-btn juttu-linking-write-submit",s.textContent="Post & Link",s.disabled=!0,r.appendChild(s),e.appendChild(r),n.addEventListener("input",()=>{s.disabled=!n.value.trim()}),e}makeLinkingSelectPost(){let e=document.createElement("div"),t=document.createElement("p");t.className="juttu-linking-title",t.textContent="Select a post",e.appendChild(t);let n=document.createElement("button");n.className="juttu-linking-back-btn",n.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.3rem 0.65rem;cursor:pointer;font-size:0.8rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);margin-bottom:0.75rem;",n.textContent="\u2190 Back",e.appendChild(n);let r=document.createElement("div");if(r.className="juttu-linking-post-list",this.userPosts.length===0){let o=document.createElement("p");o.className="juttu-linking-spinner",o.textContent="Loading posts\u2026",r.appendChild(o)}else for(let o of this.userPosts){let s=document.createElement("button");s.className="juttu-linking-post-item",s.dataset.uri=o.uri,s.dataset.cid=o.cid;let i=document.createElement("div");i.className="juttu-linking-post-text",i.textContent=o.text.length>180?o.text.slice(0,180)+"\u2026":o.text;let a=document.createElement("div");a.className="juttu-linking-post-date",a.textContent=z(o.createdAt),s.appendChild(i),s.appendChild(a),r.appendChild(s)}return e.appendChild(r),e}handleLinkingClick(e){let t=e.target;if(t.closest(".juttu-linking-start-btn")){this.resolveAuth();return}if(t.closest(".juttu-linking-login-btn")){this.openLoginPopup();return}if(t.closest(".juttu-linking-continue-btn")&&!t.closest(".juttu-linking-write-submit")){let o=this.container.querySelector(".juttu-linking-title-input"),s=this.container.querySelector(".juttu-linking-desc-input"),i=o?.value.trim()??"";if(!i)return;this.linkingTitle=i,this.linkingDescription=s?.value.trim()??"",this.linkingStep="choose-method",this.renderLinkingUI();return}let n=t.closest(".juttu-linking-method-btn");if(n){n.dataset.method==="write"?(this.linkingStep="write-post",this.renderLinkingUI()):n.dataset.method==="select"&&(this.linkingStep="select-post",this.userPosts=[],this.renderLinkingUI(),this.fetchUserPostsAndRender());return}if(t.closest(".juttu-linking-write-submit")){let s=this.container.querySelector(".juttu-linking-textarea")?.value.trim()??"";if(!s)return;this.handleLinkingCreatePost(s);return}let r=t.closest(".juttu-linking-post-item");if(r){let o=r.dataset.uri,s=r.dataset.cid;o&&s&&this.callPutDocument(o,s);return}if(t.closest(".juttu-linking-back-btn")){this.linkingStep="choose-method",this.renderLinkingUI();return}}async fetchUserPostsAndRender(){if(this.currentUser)try{let e=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(this.currentUser.handle)}&filter=posts_no_replies&limit=20`);if(!e.ok)throw new Error(`Failed to fetch posts: ${e.status}`);let t=await e.json();this.userPosts=t.feed.filter(n=>!n.reason).map(n=>({uri:n.post.uri,cid:n.post.cid,text:n.post.record.text,createdAt:n.post.record.createdAt})),this.linkingStep==="select-post"&&this.renderLinkingUI()}catch(e){if(this.linkingStep==="select-post"){let t=this.container.querySelector(".juttu-linking-post-list");if(t){t.innerHTML="";let n=document.createElement("p");n.className="juttu-linking-error",n.textContent=e instanceof Error?e.message:"Failed to load posts",t.appendChild(n)}}}}async handleLinkingCreatePost(e){let t=this.container.querySelector(".juttu-linking-write-submit");t&&(t.disabled=!0,t.textContent="Posting\u2026");try{let r=await(await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:e})}).then(this.checkApiResponse)).json();await this.callPutDocument(r.uri,r.cid)}catch(n){t&&(t.disabled=!1,t.textContent="Post & Link");let r=document.createElement("p");r.className="juttu-linking-error",r.textContent=n instanceof Error?n.message:"Failed to post",this.container.querySelector(".juttu-linking")?.appendChild(r)}}async callPutDocument(e,t){if(!this.documentAtUri)return;let n=this.container.querySelector(".juttu-linking");if(n){let i=document.createElement("p");i.className="juttu-linking-spinner",i.textContent="Linking\u2026",n.appendChild(i)}let r={uri:e,cid:t},o=new Date().toISOString(),s;this.documentRecord?s={...this.documentRecord,bskyPostRef:r,updatedAt:o}:s={$type:"site.standard.document",site:window.location.origin,title:this.linkingTitle,description:this.linkingDescription||void 0,path:window.location.pathname||void 0,publishedAt:o,updatedAt:o,bskyPostRef:r};try{await fetch(`${this.config.apiUrl}/atproto/document`,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:this.documentAtUri.rkey,record:s})}).then(this.checkApiResponse),this.documentAtUri=null,this.documentRecord=null,this.rootPostUri=e,this.rootPostCid=t;let i=await T(e);this.threadData=i,C(i,this.viewerState),this.renderWidget()}catch(i){let a=this.container.querySelector(".juttu-linking");a?.querySelector(".juttu-linking-spinner")?.remove();let u=document.createElement("p");u.className="juttu-linking-error",u.textContent=i instanceof Error?i.message:"Failed to link document",a?.appendChild(u)}}destroy(){this.loginPollInterval!==null&&clearInterval(this.loginPollInterval);try{this.loginPopup?.close()}catch{}this.container.innerHTML=""}};if(typeof window<"u"){let e=function(t){let n=t.getAttribute("data-api-url"),r=t.getAttribute("data-theme")??"auto";if(!n){console.error("Juttu: Missing data-api-url attribute on script tag");return}let o=document.getElementById("juttu-comments");if(!o){console.error('Juttu: No element with id="juttu-comments" found on this page');return}new E(o,{apiUrl:n,theme:r})};ct=e,window.JuttuWidget=E;let l=document.currentScript;l&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>e(l)):e(l))}var ct;})();
