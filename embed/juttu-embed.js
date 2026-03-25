var JuttuEmbed=(()=>{var $='<svg class="juttu-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>',_='<svg class="juttu-repost-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',O='<svg class="juttu-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',V='<svg class="juttu-bsky-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" width="16" height="16" fill="currentColor"><path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"/></svg>',F=`
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
`;function q(u){if(!u.startsWith("at://"))return null;let t=u.slice(5).split("/");if(t.length!==3)return null;let[e,n,r]=t;return!e||!n||!r?null:{did:e,collection:n,rkey:r}}async function W(u){let t;if(u.startsWith("did:plc:")){let n=await fetch(`https://plc.directory/${u}`);if(!n.ok)throw new Error(`Failed to resolve DID: ${n.status}`);t=await n.json()}else if(u.startsWith("did:web:")){let n=u.split(":").slice(2).join(":"),r=await fetch(`https://${n}/.well-known/did.json`);if(!r.ok)throw new Error(`Failed to resolve did:web DID: ${r.status}`);t=await r.json()}else throw new Error(`Unsupported DID method: ${u}`);let e=t.service?.find(n=>n.type==="AtprotoPersonalDataServer");if(!e?.serviceEndpoint)throw new Error("No PDS endpoint found in DID document");return e.serviceEndpoint}async function J(u,t){let e=`${u}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(t.did)}&collection=${encodeURIComponent(t.collection)}&rkey=${encodeURIComponent(t.rkey)}`,n=await fetch(e);if(n.status>=400&&n.status<500)return null;if(!n.ok)throw new Error(`Failed to fetch document record: ${n.status}`);return(await n.json()).value}async function S(u){let t=`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(u)}&depth=10&parentHeight=0`,e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch thread: ${e.status}`);let n=await e.json();if(!n.thread)throw new Error("Thread data missing from response");return n.thread}async function C(u){try{let t=await fetch(`${u}/auth/me`,{credentials:"include"});return t.ok?await t.json():null}catch{return null}}async function A(u){try{let t=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(u)}`);return t.ok?(await t.json()).avatar:void 0}catch{return}}function H(u){let t=Math.floor((Date.now()-new Date(u).getTime())/1e3);return t<60?"just now":t<3600?`${Math.floor(t/60)}m`:t<86400?`${Math.floor(t/3600)}h`:t<2592e3?`${Math.floor(t/86400)}d`:t<31536e3?`${Math.floor(t/2592e3)}mo`:`${Math.floor(t/31536e3)}y`}function X(u){return u.startsWith("https://")||u.startsWith("http://")}function G(u,t){let e=document.createDocumentFragment(),n=new TextEncoder,r=new TextDecoder,o=n.encode(u);if(!t||t.length===0)return e.appendChild(document.createTextNode(u)),e;let i=[...t].sort((s,l)=>s.index.byteStart-l.index.byteStart),a=0;for(let s of i){let{byteStart:l,byteEnd:p}=s.index;l>a&&e.appendChild(document.createTextNode(r.decode(o.slice(a,l))));let h=r.decode(o.slice(l,p)),m=s.features[0];if(!m)e.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#link")if(X(m.uri)){let c=document.createElement("a");c.className="juttu-link",c.href=m.uri,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else e.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#mention"){let c=document.createElement("a");c.className="juttu-mention",c.href=`https://bsky.app/profile/${m.did}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else if(m.$type==="app.bsky.richtext.facet#tag"){let c=document.createElement("a");c.className="juttu-hashtag",c.href=`https://bsky.app/search?q=${encodeURIComponent("#"+m.tag)}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else e.appendChild(document.createTextNode(h));a=p}return a<o.length&&e.appendChild(document.createTextNode(r.decode(o.slice(a)))),e}function Y(u){return(u.replies??[]).filter(t=>t.$type==="app.bsky.feed.defs#threadViewPost")}function I(u,t){return[...u].sort((e,n)=>t==="most-liked"?(n.post.likeCount??0)-(e.post.likeCount??0):t==="oldest"?new Date(e.post.indexedAt).getTime()-new Date(n.post.indexedAt).getTime():new Date(n.post.indexedAt).getTime()-new Date(e.post.indexedAt).getTime())}function E(u,t){let{post:e}=u;(e.viewer?.like||e.viewer?.repost)&&t.set(e.uri,{likeUri:e.viewer.like,repostUri:e.viewer.repost});for(let n of u.replies??[])n.$type==="app.bsky.feed.defs#threadViewPost"&&E(n,t)}function z(u,t){if(!u)return null;if(u.post.uri===t)return u.post;for(let e of u.replies??[])if(e.$type==="app.bsky.feed.defs#threadViewPost"){let n=z(e,t);if(n)return n}return null}var L=class{config;container;threadData=null;currentUser=null;rootPostUri=null;rootPostCid=null;sortOrder="newest";pagination={visibleTopLevel:10,visibleReplies:new Map};viewerState=new Map;openReplyFormUri=null;loginPopup=null;loginPollInterval=null;loginPollStartTime=0;documentAtUri=null;documentRecord=null;linkingStep="setup";linkingTitle="";linkingDescription="";userPosts=[];constructor(t,e){this.container=t,this.config=e,this.injectStyles(),this.init()}injectStyles(){if(document.getElementById("juttu-styles"))return;let t=document.createElement("style");t.id="juttu-styles",t.textContent=F,document.head.appendChild(t)}async init(){this.renderLoading();try{let t=document.querySelector('link[rel="site.standard.document"]');if(!t){this.renderError('Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.');return}let e=t.getAttribute("href");if(!e||!e.startsWith("at://")){this.renderError('Invalid <link rel="site.standard.document" href> \u2014 must be an AT URI (at://).');return}let n=q(e);if(!n){this.renderError("Could not parse AT URI from link tag.");return}let r=await W(n.did),o=await J(r,n);if(o?.bskyPostRef?.uri){this.rootPostUri=o.bskyPostRef.uri,this.rootPostCid=o.bskyPostRef.cid;let[i,a]=await Promise.all([C(this.config.apiUrl),S(o.bskyPostRef.uri)]);this.currentUser=i,this.threadData=a,E(a,this.viewerState),this.renderWidget()}else{this.documentAtUri=n,this.documentRecord=o,this.linkingStep="setup";let i=await C(this.config.apiUrl);if(i){let a=await A(i.handle);this.currentUser={...i,avatar:a}}this.renderLinkingUI()}}catch(t){let e=t instanceof Error?t.message:"Unknown error";this.renderError(`Could not load comments: ${e}`)}}renderLoading(){this.container.innerHTML="";let t=this.makeRoot(),e=document.createElement("div");e.className="juttu-loading",e.textContent="Loading comments\u2026",t.appendChild(e),this.container.appendChild(t)}renderError(t){this.container.innerHTML="";let e=this.makeRoot(),n=document.createElement("div");n.className="juttu-error",n.textContent=`Juttu: ${t}`,e.appendChild(n),this.container.appendChild(e)}makeRoot(){let t=document.createElement("div");return t.className="juttu-comments",this.config.theme!=="auto"&&t.setAttribute("data-juttu-theme",this.config.theme),t}renderWidget(){this.container.innerHTML="";let t=this.makeRoot(),e=this.threadData?Y(this.threadData):[];t.appendChild(this.renderHeader(e.length)),t.appendChild(this.renderComposer()),t.appendChild(this.renderThread(e));let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),t.appendChild(n),t.addEventListener("click",o=>this.handleClick(o)),t.addEventListener("input",o=>{let i=o.target;if(i.classList.contains("juttu-compose-input")){let a=t.querySelector(".juttu-submit-btn");a&&(a.disabled=!i.value.trim())}if(i.classList.contains("juttu-reply-input")){let s=i.closest(".juttu-reply-form")?.querySelector(".juttu-reply-submit");s&&(s.disabled=!i.value.trim())}}),this.container.appendChild(t)}handleClick(t){let e=t.target,n=e.closest(".juttu-sort-btn");if(n){let s=n.dataset.sort;s&&this.setSortOrder(s);return}if(e.closest(".juttu-load-more-btn")){this.pagination.visibleTopLevel+=10,this.renderWidget();return}let r=e.closest(".juttu-show-replies-btn");if(r){let s=r.dataset.uri;if(s){let l=this.pagination.visibleReplies.get(s)??3;this.pagination.visibleReplies.set(s,l+3),this.renderWidget()}return}if(e.closest(".juttu-login-btn")){this.openLoginPopup();return}if(e.closest(".juttu-logout-btn")){this.handleLogout();return}let o=e.closest(".juttu-like-btn");if(o){this.requireAuth()&&this.handleLike(o);return}let i=e.closest(".juttu-repost-btn");if(i){this.requireAuth()&&this.handleRepost(i);return}let a=e.closest(".juttu-reply-btn");if(a){let s=a.dataset.uri;s&&this.requireAuth()&&this.handleToggleReplyForm(s);return}if(e.closest(".juttu-reply-cancel")){this.closeReplyForm();return}if(e.closest(".juttu-reply-submit")){this.openReplyFormUri&&this.handleSubmitReply(this.openReplyFormUri);return}if(e.closest(".juttu-submit-btn")){this.requireAuth()&&this.handlePost();return}}setSortOrder(t){this.sortOrder=t,this.pagination.visibleTopLevel=10,this.pagination.visibleReplies.clear(),this.renderWidget()}renderHeader(t){let e=document.createElement("div");e.className="juttu-header";let n=document.createElement("h2");n.className="juttu-title",n.textContent=`${t} Comment${t!==1?"s":""}`,e.appendChild(n);let r=document.createElement("div");r.className="juttu-sort-controls";for(let{value:o,label:i}of[{value:"newest",label:"Newest"},{value:"oldest",label:"Oldest"},{value:"most-liked",label:"Top"}]){let a=document.createElement("button");a.className="juttu-sort-btn"+(this.sortOrder===o?" juttu-sort-btn--active":""),a.dataset.sort=o,a.textContent=i,r.appendChild(a)}return e.appendChild(r),e}renderComposer(){let t=document.createElement("div");return t.className="juttu-composer",this.currentUser?t.appendChild(this.makeComposeArea()):t.appendChild(this.makeLoginArea()),t}makeLoginArea(){let t=document.createElement("div");t.className="juttu-login-area";let e=document.createElement("button");return e.className="juttu-login-btn",e.textContent="Login with Bluesky",t.appendChild(e),t}makeComposeArea(){let t=document.createElement("div");t.className="juttu-compose-area";let e=document.createElement("div");if(e.className="juttu-compose-user",this.currentUser.avatar){let a=document.createElement("img");a.className="juttu-compose-avatar",a.src=this.currentUser.avatar,a.alt=this.currentUser.handle,e.appendChild(a)}else{let a=document.createElement("div");a.className="juttu-avatar-placeholder",e.appendChild(a)}let n=document.createElement("span");n.className="juttu-compose-handle",n.textContent=`@${this.currentUser.handle}`,e.appendChild(n);let r=document.createElement("button");r.className="juttu-logout-btn",r.textContent="Logout",e.appendChild(r),t.appendChild(e);let o=document.createElement("textarea");o.className="juttu-compose-input",o.placeholder="Write a comment\u2026",o.rows=3,t.appendChild(o);let i=document.createElement("button");return i.className="juttu-submit-btn",i.textContent="Post comment",i.disabled=!0,t.appendChild(i),t}renderThread(t){let e=document.createElement("div");e.className="juttu-thread";let n=I(t,this.sortOrder),r=n.slice(0,this.pagination.visibleTopLevel);for(let o of r)e.appendChild(this.renderComment(o,0));if(n.length>this.pagination.visibleTopLevel){let o=document.createElement("div");o.className="juttu-load-more";let i=document.createElement("button");i.className="juttu-load-more-btn";let a=n.length-this.pagination.visibleTopLevel;i.textContent=`Load ${Math.min(a,10)} more comments`,o.appendChild(i),e.appendChild(o)}return e}renderComment(t,e){let{post:n}=t,r=n.uri.split("/").pop()??"",o=`https://bsky.app/profile/${n.author.did}/post/${r}`,i=`https://bsky.app/profile/${n.author.handle}`,a=document.createElement("div");a.className="juttu-comment",a.dataset.uri=n.uri,a.dataset.cid=n.cid;let s=document.createElement("div");if(s.className="juttu-comment-header",n.author.avatar){let d=document.createElement("a");d.className="juttu-avatar-link",d.href=i,d.target="_blank",d.rel="noopener noreferrer";let f=document.createElement("img");f.className="juttu-avatar",f.src=n.author.avatar,f.alt=n.author.handle,f.loading="lazy",d.appendChild(f),s.appendChild(d)}else{let d=document.createElement("div");d.className="juttu-avatar-placeholder",s.appendChild(d)}let l=document.createElement("div");l.className="juttu-author-info";let p=document.createElement("a");p.className="juttu-display-name",p.href=i,p.target="_blank",p.rel="noopener noreferrer",p.textContent=n.author.displayName||n.author.handle,l.appendChild(p);let h=document.createElement("a");h.className="juttu-handle",h.href=i,h.target="_blank",h.rel="noopener noreferrer",h.textContent=`@${n.author.handle}`,l.appendChild(h),s.appendChild(l);let m=document.createElement("a");m.className="juttu-time-link",m.href=o,m.target="_blank",m.rel="noopener noreferrer",m.textContent=H(n.indexedAt),m.title=new Date(n.indexedAt).toLocaleString(),s.appendChild(m),a.appendChild(s);let c=document.createElement("div");c.className="juttu-comment-body";let U=document.createElement("p");if(U.style.margin="0",U.appendChild(G(n.record.text,n.record.facets)),c.appendChild(U),a.appendChild(c),n.embed?.$type==="app.bsky.embed.images#view"&&n.embed.images?.length){let d=document.createElement("div");d.className="juttu-comment-images";for(let f of n.embed.images){let g=document.createElement("a");g.className="juttu-comment-image-link",g.href=o,g.target="_blank",g.rel="noopener noreferrer";let j=document.createElement("img");j.className="juttu-comment-image",j.src=f.thumb,j.alt=f.alt||"Embedded image",j.loading="lazy",g.appendChild(j),d.appendChild(g)}a.appendChild(d)}let B=this.viewerState.get(n.uri)??{},Z=!!B.likeUri,Q=!!B.repostUri,y=document.createElement("div");y.className="juttu-comment-actions";let v=document.createElement("button");v.className="juttu-like-btn",v.dataset.liked=String(Z),v.dataset.uri=n.uri,v.dataset.cid=n.cid,v.title="Like",v.innerHTML=$;let N=document.createElement("span");N.className="juttu-like-count",N.textContent=String(n.likeCount??0),v.appendChild(N),y.appendChild(v);let b=document.createElement("button");b.className="juttu-repost-btn",b.dataset.reposted=String(Q),b.dataset.uri=n.uri,b.dataset.cid=n.cid,b.title="Repost",b.innerHTML=_;let R=document.createElement("span");R.className="juttu-repost-count",R.textContent=String(n.repostCount??0),b.appendChild(R),y.appendChild(b);let x=document.createElement("button");x.className="juttu-reply-btn",x.dataset.uri=n.uri,x.title="Reply",x.innerHTML=O;let M=document.createElement("span");M.className="juttu-reply-count",M.textContent=String(n.replyCount??0),x.appendChild(M),y.appendChild(x);let k=document.createElement("a");k.className="juttu-bsky-link",k.href=o,k.target="_blank",k.rel="noopener noreferrer",k.title="View on Bluesky",k.innerHTML=V,y.appendChild(k),a.appendChild(y);let D=(t.replies??[]).filter(d=>d.$type==="app.bsky.feed.defs#threadViewPost");if(D.length>0){let d=document.createElement("div");d.className="juttu-replies";let f=this.pagination.visibleReplies.get(n.uri)??3,g=I(D,this.sortOrder);for(let w of g.slice(0,f))d.appendChild(this.renderComment(w,e+1));let j=g.length-f;if(j>0){let w=document.createElement("button");w.className="juttu-show-replies-btn",w.dataset.uri=n.uri,w.textContent=`Show ${Math.min(j,3)} more repl${j===1?"y":"ies"}`,d.appendChild(w)}a.appendChild(d)}return a}getComposer(){return this.container.querySelector(".juttu-composer")??this.container.querySelector(".juttu-linking")}openLoginPopup(){this.loginPopup=window.open(`${this.config.apiUrl}/login`,"juttu-auth","width=500,height=600,menubar=no,toolbar=no,location=no,status=no"),this.loginPollStartTime=Date.now(),this.loginPollInterval=setInterval(()=>this.pollForLogin(),1500)}async onAuthComplete(){let t=await C(this.config.apiUrl);t&&await this.completeLogin(t)}async pollForLogin(){if(Date.now()-this.loginPollStartTime>12e4){this.cancelLogin();return}let e=await C(this.config.apiUrl);e&&await this.completeLogin(e)}async completeLogin(t){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null);try{this.loginPopup?.close()}catch{}this.loginPopup=null;let e=await A(t.handle);if(this.currentUser={...t,avatar:e},this.documentAtUri)this.linkingStep=this.documentRecord?"choose-method":"metadata",this.renderLinkingUI();else{let n=this.getComposer();if(n){n.innerHTML="",n.appendChild(this.makeComposeArea());let r=n.querySelector(".juttu-compose-input"),o=n.querySelector(".juttu-submit-btn");r&&o&&r.addEventListener("input",()=>{o.disabled=!r.value.trim()})}}}cancelLogin(){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null);try{this.loginPopup?.close()}catch{}if(this.loginPopup=null,this.documentAtUri)this.linkingStep="login",this.renderLinkingUI();else{let t=this.getComposer();t&&(t.innerHTML="",t.appendChild(this.makeLoginArea()))}}async handleLogout(){try{await fetch(`${this.config.apiUrl}/auth/logout`,{method:"POST",credentials:"include"})}catch{}this.currentUser=null,this.viewerState.clear();let t=this.getComposer();t&&(t.innerHTML="",t.appendChild(this.makeLoginArea()))}requireAuth(){return this.currentUser?!0:(this.openLoginPopup(),!1)}async handleLike(t){let e=t.dataset.uri,n=t.dataset.cid;if(!e||!n)return;let r=this.viewerState.get(e)??{},o=!!r.likeUri,i=t.querySelector(".juttu-like-count"),a=parseInt(i?.textContent??"0",10),s=!o;t.dataset.liked=String(s),i&&(i.textContent=String(a+(s?1:-1))),this.viewerState.set(e,{...r,likeUri:s?"pending":void 0});try{if(o&&r.likeUri){let l=r.likeUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/like`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:l})}).then(this.checkApiResponse),this.viewerState.set(e,{...r,likeUri:void 0})}else{let p=await(await fetch(`${this.config.apiUrl}/bsky/like`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:e,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(e,{...r,likeUri:p.uri})}}catch(l){t.dataset.liked=String(o),i&&(i.textContent=String(a)),this.viewerState.set(e,r),this.showActionError(t,l instanceof Error?l.message:"Action failed")}}async handleRepost(t){let e=t.dataset.uri,n=t.dataset.cid;if(!e||!n)return;let r=this.viewerState.get(e)??{},o=!!r.repostUri,i=t.querySelector(".juttu-repost-count"),a=parseInt(i?.textContent??"0",10),s=!o;t.dataset.reposted=String(s),i&&(i.textContent=String(a+(s?1:-1))),this.viewerState.set(e,{...r,repostUri:s?"pending":void 0});try{if(o&&r.repostUri){let l=r.repostUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:l})}).then(this.checkApiResponse),this.viewerState.set(e,{...r,repostUri:void 0})}else{let p=await(await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:e,cid:n})}).then(this.checkApiResponse)).json();this.viewerState.set(e,{...r,repostUri:p.uri})}}catch(l){t.dataset.reposted=String(o),i&&(i.textContent=String(a)),this.viewerState.set(e,r),this.showActionError(t,l instanceof Error?l.message:"Action failed")}}handleToggleReplyForm(t){if(this.openReplyFormUri===t){this.closeReplyForm();return}this.closeReplyForm();let e=this.container.querySelector(`.juttu-comment[data-uri="${CSS.escape(t)}"]`);if(!e)return;let n=document.createElement("div");n.className="juttu-reply-form";let r=document.createElement("textarea");r.className="juttu-reply-input",r.placeholder="Write a reply\u2026",r.rows=2,n.appendChild(r);let o=document.createElement("div");o.className="juttu-reply-form-actions";let i=document.createElement("span");i.className="juttu-reply-hint",i.textContent="Reply posts to Bluesky",o.appendChild(i);let a=document.createElement("button");a.className="juttu-reply-cancel",a.textContent="Cancel",o.appendChild(a);let s=document.createElement("button");s.className="juttu-reply-submit",s.textContent="Reply",s.disabled=!0,o.appendChild(s),n.appendChild(o);let l=e.querySelector(".juttu-comment-actions");l?.nextSibling?e.insertBefore(n,l.nextSibling):e.appendChild(n),this.openReplyFormUri=t,r.focus()}closeReplyForm(){if(!this.openReplyFormUri)return;this.container.querySelector(".juttu-reply-form")?.remove(),this.openReplyFormUri=null}async handlePost(){let t=this.container.querySelector(".juttu-compose-input"),e=this.container.querySelector(".juttu-submit-btn");if(!t||!e)return;let n=t.value.trim();if(!(!n||!this.rootPostUri||!this.rootPostCid)){e.disabled=!0,e.textContent="Posting\u2026",this.container.querySelector(".juttu-post-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:n,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:this.rootPostUri,cid:this.rootPostCid}}})}).then(this.checkApiResponse),t.value="",e.disabled=!0,e.textContent="Post comment",setTimeout(()=>this.refetchAndRender(),1500)}catch(r){e.disabled=!1,e.textContent="Post comment";let o=document.createElement("div");o.className="juttu-post-error",o.textContent=r instanceof Error?r.message:"Failed to post",e.insertAdjacentElement("afterend",o)}}}async handleSubmitReply(t){let e=this.container.querySelector(".juttu-reply-form");if(!e)return;let n=e.querySelector(".juttu-reply-input"),r=e.querySelector(".juttu-reply-submit");if(!n||!r)return;let o=n.value.trim();if(!o||!this.rootPostUri||!this.rootPostCid)return;let i=z(this.threadData,t);if(i){r.disabled=!0,r.textContent="Replying\u2026",e.querySelector(".juttu-reply-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:o,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:i.uri,cid:i.cid}}})}).then(this.checkApiResponse),this.closeReplyForm(),setTimeout(()=>this.refetchAndRender(),1500)}catch(a){r.disabled=!1,r.textContent="Reply";let s=document.createElement("div");s.className="juttu-reply-error",s.textContent=a instanceof Error?a.message:"Failed to post reply",e.appendChild(s)}}}async refetchAndRender(){if(this.rootPostUri)try{let t=await S(this.rootPostUri);this.threadData=t;let e=new Map;E(t,e);for(let[n,r]of e){let o=this.viewerState.get(n),i={likeUri:o?.likeUri!=="pending"?o?.likeUri??r.likeUri:r.likeUri,repostUri:o?.repostUri!=="pending"?o?.repostUri??r.repostUri:r.repostUri};(i.likeUri||i.repostUri)&&e.set(n,i)}this.viewerState=e,this.renderWidget()}catch{}}checkApiResponse=async t=>{if(!t.ok){let e=await t.json().catch(()=>({}));throw new Error(e.error??`Request failed (${t.status})`)}return t};showActionError(t,e){t.parentElement?.querySelector(".juttu-action-error")?.remove();let n=document.createElement("div");n.className="juttu-action-error",n.textContent=e,t.insertAdjacentElement("afterend",n),setTimeout(()=>n.remove(),4e3)}renderLinkingUI(){this.container.innerHTML="";let t=this.makeRoot(),e=document.createElement("div");switch(e.className="juttu-linking",this.linkingStep){case"setup":e.appendChild(this.makeLinkingSetup());break;case"login":e.appendChild(this.makeLinkingLoginForm());break;case"metadata":e.appendChild(this.makeLinkingMetadata());break;case"choose-method":e.appendChild(this.makeLinkingChooseMethod());break;case"write-post":e.appendChild(this.makeLinkingWritePost());break;case"select-post":e.appendChild(this.makeLinkingSelectPost());break}t.appendChild(e),t.addEventListener("click",o=>this.handleLinkingClick(o)),t.addEventListener("keydown",o=>{o.target.classList.contains("juttu-handle-input")&&o.key==="Enter"&&this.handleLoginSubmit()});let n=document.createElement("div");n.className="juttu-footer";let r=document.createElement("a");r.className="juttu-powered-by",r.href="https://juttu.app",r.target="_blank",r.rel="noopener noreferrer",r.textContent="Powered by Juttu",n.appendChild(r),t.appendChild(n),this.container.appendChild(t)}makeLinkingSetup(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title";let n=document.createElement("p");n.className="juttu-linking-desc",this.documentRecord?(e.textContent="Comments not linked yet",n.textContent="Link this article to a Bluesky post to enable the comment thread."):(e.textContent="Comments not set up yet",n.textContent="Set up a Bluesky-powered comment thread for this article."),t.appendChild(e),t.appendChild(n);let r=document.createElement("button");return r.className="juttu-linking-start-btn",r.textContent=this.documentRecord?"Link comments":"Set up comments",t.appendChild(r),t}makeLinkingLoginForm(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title",e.textContent="Sign in as the document owner",t.appendChild(e);let n=document.createElement("button");return n.className="juttu-linking-login-btn",n.textContent="Login with Bluesky \u2192",t.appendChild(n),t}makeLinkingMetadata(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title",e.textContent="Article details",t.appendChild(e);let n=document.createElement("div");n.className="juttu-linking-field";let r=document.createElement("label");r.className="juttu-linking-label",r.textContent="Title *",n.appendChild(r);let o=document.createElement("input");o.type="text",o.className="juttu-linking-input juttu-linking-title-input",o.placeholder="Article title",o.value=this.linkingTitle,n.appendChild(o),t.appendChild(n);let i=document.createElement("div");i.className="juttu-linking-field";let a=document.createElement("label");a.className="juttu-linking-label",a.textContent="Description (optional)",i.appendChild(a);let s=document.createElement("input");s.type="text",s.className="juttu-linking-input juttu-linking-desc-input",s.placeholder="Short description",s.value=this.linkingDescription,i.appendChild(s),t.appendChild(i);let l=document.createElement("button");return l.className="juttu-linking-continue-btn",l.textContent="Continue",l.disabled=!this.linkingTitle.trim(),t.appendChild(l),o.addEventListener("input",()=>{l.disabled=!o.value.trim()}),t}makeLinkingChooseMethod(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title",e.textContent="Link a Bluesky post",t.appendChild(e);let n=document.createElement("p");n.className="juttu-linking-desc",n.textContent="This post becomes the root of the comment thread.",t.appendChild(n);let r=document.createElement("div");r.className="juttu-linking-methods";let o=document.createElement("button");o.className="juttu-linking-method-btn",o.dataset.method="write";let i=document.createElement("div");i.className="juttu-linking-method-title",i.textContent="Write a new post";let a=document.createElement("div");a.className="juttu-linking-method-desc",a.textContent="Compose a post to announce this article",o.appendChild(i),o.appendChild(a),r.appendChild(o);let s=document.createElement("button");s.className="juttu-linking-method-btn",s.dataset.method="select";let l=document.createElement("div");l.className="juttu-linking-method-title",l.textContent="Use an existing post";let p=document.createElement("div");return p.className="juttu-linking-method-desc",p.textContent="Pick from your recent Bluesky posts",s.appendChild(l),s.appendChild(p),r.appendChild(s),t.appendChild(r),t}makeLinkingWritePost(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title",e.textContent="Write a post",t.appendChild(e);let n=document.createElement("textarea");n.className="juttu-linking-textarea",n.placeholder="Share this article on Bluesky\u2026",t.appendChild(n);let r=document.createElement("div");r.style.cssText="display:flex;gap:0.5rem;margin-top:0.5rem;";let o=document.createElement("button");o.className="juttu-linking-back-btn",o.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.4rem 0.75rem;cursor:pointer;font-size:0.875rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);",o.textContent="\u2190 Back",r.appendChild(o);let i=document.createElement("button");return i.className="juttu-linking-continue-btn juttu-linking-write-submit",i.textContent="Post & Link",i.disabled=!0,r.appendChild(i),t.appendChild(r),n.addEventListener("input",()=>{i.disabled=!n.value.trim()}),t}makeLinkingSelectPost(){let t=document.createElement("div"),e=document.createElement("p");e.className="juttu-linking-title",e.textContent="Select a post",t.appendChild(e);let n=document.createElement("button");n.className="juttu-linking-back-btn",n.style.cssText="background:none;border:1px solid var(--juttu-border-color);border-radius:var(--juttu-radius);padding:0.3rem 0.65rem;cursor:pointer;font-size:0.8rem;color:var(--juttu-text-muted);font-family:var(--juttu-font-family);margin-bottom:0.75rem;",n.textContent="\u2190 Back",t.appendChild(n);let r=document.createElement("div");if(r.className="juttu-linking-post-list",this.userPosts.length===0){let o=document.createElement("p");o.className="juttu-linking-spinner",o.textContent="Loading posts\u2026",r.appendChild(o)}else for(let o of this.userPosts){let i=document.createElement("button");i.className="juttu-linking-post-item",i.dataset.uri=o.uri,i.dataset.cid=o.cid;let a=document.createElement("div");a.className="juttu-linking-post-text",a.textContent=o.text.length>180?o.text.slice(0,180)+"\u2026":o.text;let s=document.createElement("div");s.className="juttu-linking-post-date",s.textContent=H(o.createdAt),i.appendChild(a),i.appendChild(s),r.appendChild(i)}return t.appendChild(r),t}handleLinkingClick(t){let e=t.target;if(e.closest(".juttu-linking-start-btn")){this.currentUser?this.documentRecord?this.linkingStep="choose-method":this.linkingStep="metadata":this.linkingStep="login",this.renderLinkingUI();return}if(e.closest(".juttu-linking-login-btn")){this.openLoginPopup();return}if(e.closest(".juttu-linking-continue-btn")&&!e.closest(".juttu-linking-write-submit")){let o=this.container.querySelector(".juttu-linking-title-input"),i=this.container.querySelector(".juttu-linking-desc-input"),a=o?.value.trim()??"";if(!a)return;this.linkingTitle=a,this.linkingDescription=i?.value.trim()??"",this.linkingStep="choose-method",this.renderLinkingUI();return}let n=e.closest(".juttu-linking-method-btn");if(n){n.dataset.method==="write"?(this.linkingStep="write-post",this.renderLinkingUI()):n.dataset.method==="select"&&(this.linkingStep="select-post",this.userPosts=[],this.renderLinkingUI(),this.fetchUserPostsAndRender());return}if(e.closest(".juttu-linking-write-submit")){let i=this.container.querySelector(".juttu-linking-textarea")?.value.trim()??"";if(!i)return;this.handleLinkingCreatePost(i);return}let r=e.closest(".juttu-linking-post-item");if(r){let o=r.dataset.uri,i=r.dataset.cid;o&&i&&this.callPutDocument(o,i);return}if(e.closest(".juttu-linking-back-btn")){this.linkingStep="choose-method",this.renderLinkingUI();return}}async fetchUserPostsAndRender(){if(this.currentUser)try{let t=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(this.currentUser.handle)}&filter=posts_no_replies&limit=20`);if(!t.ok)throw new Error(`Failed to fetch posts: ${t.status}`);let e=await t.json();this.userPosts=e.feed.filter(n=>!n.reason).map(n=>({uri:n.post.uri,cid:n.post.cid,text:n.post.record.text,createdAt:n.post.record.createdAt})),this.linkingStep==="select-post"&&this.renderLinkingUI()}catch(t){if(this.linkingStep==="select-post"){let e=this.container.querySelector(".juttu-linking-post-list");if(e){e.innerHTML="";let n=document.createElement("p");n.className="juttu-linking-error",n.textContent=t instanceof Error?t.message:"Failed to load posts",e.appendChild(n)}}}}async handleLinkingCreatePost(t){let e=this.container.querySelector(".juttu-linking-write-submit");e&&(e.disabled=!0,e.textContent="Posting\u2026");try{let r=await(await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:t})}).then(this.checkApiResponse)).json();await this.callPutDocument(r.uri,r.cid)}catch(n){e&&(e.disabled=!1,e.textContent="Post & Link");let r=document.createElement("p");r.className="juttu-linking-error",r.textContent=n instanceof Error?n.message:"Failed to post",this.container.querySelector(".juttu-linking")?.appendChild(r)}}async callPutDocument(t,e){if(!this.documentAtUri)return;let n=this.container.querySelector(".juttu-linking");if(n){let a=document.createElement("p");a.className="juttu-linking-spinner",a.textContent="Linking\u2026",n.appendChild(a)}let r={uri:t,cid:e},o=new Date().toISOString(),i;this.documentRecord?i={...this.documentRecord,bskyPostRef:r,updatedAt:o}:i={$type:"site.standard.document",site:window.location.origin,title:this.linkingTitle,description:this.linkingDescription||void 0,path:window.location.pathname||void 0,publishedAt:o,updatedAt:o,bskyPostRef:r};try{await fetch(`${this.config.apiUrl}/atproto/document`,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:this.documentAtUri.rkey,record:i})}).then(this.checkApiResponse),this.documentAtUri=null,this.documentRecord=null,this.rootPostUri=t,this.rootPostCid=e;let a=await S(t);this.threadData=a,E(a,this.viewerState),this.renderWidget()}catch(a){let s=this.container.querySelector(".juttu-linking");s?.querySelector(".juttu-linking-spinner")?.remove();let l=document.createElement("p");l.className="juttu-linking-error",l.textContent=a instanceof Error?a.message:"Failed to link document",s?.appendChild(l)}}destroy(){this.loginPollInterval!==null&&clearInterval(this.loginPollInterval);try{this.loginPopup?.close()}catch{}this.container.innerHTML=""}};if(typeof window<"u"){let t=function(e){let n=e.getAttribute("data-api-url"),r=e.getAttribute("data-theme")??"auto";if(!n){console.error("Juttu: Missing data-api-url attribute on script tag");return}let o=document.getElementById("juttu-comments");if(!o){console.error('Juttu: No element with id="juttu-comments" found on this page');return}new L(o,{apiUrl:n,theme:r})};window.JuttuWidget=L;let u=document.currentScript;u&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>t(u)):t(u))}})();
