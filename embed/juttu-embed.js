var JuttuEmbed=(()=>{var P=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var z=Object.getOwnPropertyNames;var O=Object.prototype.hasOwnProperty;var D=(s,t)=>{for(var e in t)P(s,e,{get:t[e],enumerable:!0})},F=(s,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of z(t))!O.call(s,o)&&o!==e&&P(s,o,{get:()=>t[o],enumerable:!(r=B(t,o))||r.enumerable});return s};var V=s=>F(P({},"__esModule",{value:!0}),s);var nt={};D(nt,{JuttuWidget:()=>C});var q='<svg class="juttu-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>',G='<svg class="juttu-repost-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',W='<svg class="juttu-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',J='<svg class="juttu-bsky-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" width="16" height="16" fill="currentColor"><path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"/></svg>',Z=`
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
`;function Y(s){if(!s.startsWith("at://"))return null;let t=s.slice(5).split("/");if(t.length!==3)return null;let[e,r,o]=t;return!e||!r||!o?null:{did:e,collection:r,rkey:o}}async function K(s){let t;if(s.startsWith("did:plc:")){let r=await fetch(`https://plc.directory/${s}`);if(!r.ok)throw new Error(`Failed to resolve DID: ${r.status}`);t=await r.json()}else if(s.startsWith("did:web:")){let r=s.split(":").slice(2).join(":"),o=await fetch(`https://${r}/.well-known/did.json`);if(!o.ok)throw new Error(`Failed to resolve did:web DID: ${o.status}`);t=await o.json()}else throw new Error(`Unsupported DID method: ${s}`);let e=t.service?.find(r=>r.type==="AtprotoPersonalDataServer");if(!e?.serviceEndpoint)throw new Error("No PDS endpoint found in DID document");return e.serviceEndpoint}async function Q(s,t){let e=`${s}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(t.did)}&collection=${encodeURIComponent(t.collection)}&rkey=${encodeURIComponent(t.rkey)}`,r=await fetch(e);if(!r.ok)throw new Error(`Failed to fetch document record: ${r.status}`);return(await r.json()).value}async function A(s){let t=`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(s)}&depth=10&parentHeight=0`,e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch thread: ${e.status}`);let r=await e.json();if(!r.thread)throw new Error("Thread data missing from response");return r.thread}async function M(s){try{let t=await fetch(`${s}/auth/me`,{credentials:"include"});return t.ok?await t.json():null}catch{return null}}async function X(s){try{let t=await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(s)}`);return t.ok?(await t.json()).avatar:void 0}catch{return}}function tt(s){let t=Math.floor((Date.now()-new Date(s).getTime())/1e3);return t<60?"just now":t<3600?`${Math.floor(t/60)}m`:t<86400?`${Math.floor(t/3600)}h`:t<2592e3?`${Math.floor(t/86400)}d`:t<31536e3?`${Math.floor(t/2592e3)}mo`:`${Math.floor(t/31536e3)}y`}function et(s){return s.startsWith("https://")||s.startsWith("http://")}function rt(s,t){let e=document.createDocumentFragment(),r=new TextEncoder,o=new TextDecoder,n=r.encode(s);if(!t||t.length===0)return e.appendChild(document.createTextNode(s)),e;let i=[...t].sort((u,l)=>u.index.byteStart-l.index.byteStart),a=0;for(let u of i){let{byteStart:l,byteEnd:p}=u.index;l>a&&e.appendChild(document.createTextNode(o.decode(n.slice(a,l))));let h=o.decode(n.slice(l,p)),m=u.features[0];if(!m)e.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#link")if(et(m.uri)){let c=document.createElement("a");c.className="juttu-link",c.href=m.uri,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else e.appendChild(document.createTextNode(h));else if(m.$type==="app.bsky.richtext.facet#mention"){let c=document.createElement("a");c.className="juttu-mention",c.href=`https://bsky.app/profile/${m.did}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else if(m.$type==="app.bsky.richtext.facet#tag"){let c=document.createElement("a");c.className="juttu-hashtag",c.href=`https://bsky.app/search?q=${encodeURIComponent("#"+m.tag)}`,c.target="_blank",c.rel="noopener noreferrer",c.textContent=h,e.appendChild(c)}else e.appendChild(document.createTextNode(h));a=p}return a<n.length&&e.appendChild(document.createTextNode(o.decode(n.slice(a)))),e}function ot(s){return(s.replies??[]).filter(t=>t.$type==="app.bsky.feed.defs#threadViewPost")}function H(s,t){return[...s].sort((e,r)=>t==="most-liked"?(r.post.likeCount??0)-(e.post.likeCount??0):t==="oldest"?new Date(e.post.indexedAt).getTime()-new Date(r.post.indexedAt).getTime():new Date(r.post.indexedAt).getTime()-new Date(e.post.indexedAt).getTime())}function U(s,t){let{post:e}=s;(e.viewer?.like||e.viewer?.repost)&&t.set(e.uri,{likeUri:e.viewer.like,repostUri:e.viewer.repost});for(let r of s.replies??[])r.$type==="app.bsky.feed.defs#threadViewPost"&&U(r,t)}function _(s,t){if(!s)return null;if(s.post.uri===t)return s.post;for(let e of s.replies??[])if(e.$type==="app.bsky.feed.defs#threadViewPost"){let r=_(e,t);if(r)return r}return null}var C=class{config;container;threadData=null;currentUser=null;rootPostUri=null;rootPostCid=null;sortOrder="newest";pagination={visibleTopLevel:10,visibleReplies:new Map};viewerState=new Map;openReplyFormUri=null;loginPopup=null;loginPollInterval=null;loginPollStartTime=0;authMessageHandler=null;constructor(t,e){this.container=t,this.config=e,this.injectStyles(),this.init()}injectStyles(){if(document.getElementById("juttu-styles"))return;let t=document.createElement("style");t.id="juttu-styles",t.textContent=Z,document.head.appendChild(t)}async init(){this.renderLoading();try{let t=document.querySelector('link[rel="site.standard.document"]');if(!t){this.renderError('Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.');return}let e=t.getAttribute("href");if(!e||!e.startsWith("at://")){this.renderError('Invalid <link rel="site.standard.document" href> \u2014 must be an AT URI (at://).');return}let r=Y(e);if(!r){this.renderError("Could not parse AT URI from link tag.");return}let o=await K(r.did),n=await Q(o,r);if(!n.bskyPostRef?.uri){this.renderError("This article has no linked Bluesky post yet.");return}this.rootPostUri=n.bskyPostRef.uri,this.rootPostCid=n.bskyPostRef.cid;let[i,a]=await Promise.all([M(this.config.apiUrl),A(n.bskyPostRef.uri)]);this.currentUser=i,this.threadData=a,U(a,this.viewerState),this.renderWidget()}catch(t){let e=t instanceof Error?t.message:"Unknown error";this.renderError(`Could not load comments: ${e}`)}}renderLoading(){this.container.innerHTML="";let t=this.makeRoot(),e=document.createElement("div");e.className="juttu-loading",e.textContent="Loading comments\u2026",t.appendChild(e),this.container.appendChild(t)}renderError(t){this.container.innerHTML="";let e=this.makeRoot(),r=document.createElement("div");r.className="juttu-error",r.textContent=`Juttu: ${t}`,e.appendChild(r),this.container.appendChild(e)}makeRoot(){let t=document.createElement("div");return t.className="juttu-comments",this.config.theme!=="auto"&&t.setAttribute("data-juttu-theme",this.config.theme),t}renderWidget(){this.container.innerHTML="";let t=this.makeRoot(),e=this.threadData?ot(this.threadData):[];t.appendChild(this.renderHeader(e.length)),t.appendChild(this.renderComposer()),t.appendChild(this.renderThread(e));let r=document.createElement("div");r.className="juttu-footer";let o=document.createElement("a");o.className="juttu-powered-by",o.href="https://juttu.app",o.target="_blank",o.rel="noopener noreferrer",o.textContent="Powered by Juttu",r.appendChild(o),t.appendChild(r),t.addEventListener("click",n=>this.handleClick(n)),t.addEventListener("input",n=>{let i=n.target;if(i.classList.contains("juttu-compose-input")){let a=t.querySelector(".juttu-submit-btn");a&&(a.disabled=!i.value.trim())}if(i.classList.contains("juttu-reply-input")){let u=i.closest(".juttu-reply-form")?.querySelector(".juttu-reply-submit");u&&(u.disabled=!i.value.trim())}}),t.addEventListener("keydown",n=>{n.target.classList.contains("juttu-handle-input")&&n.key==="Enter"&&this.handleLoginSubmit()}),this.container.appendChild(t)}handleClick(t){let e=t.target,r=e.closest(".juttu-sort-btn");if(r){let u=r.dataset.sort;u&&this.setSortOrder(u);return}if(e.closest(".juttu-load-more-btn")){this.pagination.visibleTopLevel+=10,this.renderWidget();return}let o=e.closest(".juttu-show-replies-btn");if(o){let u=o.dataset.uri;if(u){let l=this.pagination.visibleReplies.get(u)??3;this.pagination.visibleReplies.set(u,l+3),this.renderWidget()}return}if(e.closest(".juttu-login-btn")){this.showLoginForm();return}if(e.closest(".juttu-login-submit")){this.handleLoginSubmit();return}if(e.closest(".juttu-login-cancel")||e.closest(".juttu-login-cancel-poll")){this.cancelLogin();return}if(e.closest(".juttu-logout-btn")){this.handleLogout();return}let n=e.closest(".juttu-like-btn");if(n){this.requireAuth()&&this.handleLike(n);return}let i=e.closest(".juttu-repost-btn");if(i){this.requireAuth()&&this.handleRepost(i);return}let a=e.closest(".juttu-reply-btn");if(a){let u=a.dataset.uri;u&&this.requireAuth()&&this.handleToggleReplyForm(u);return}if(e.closest(".juttu-reply-cancel")){this.closeReplyForm();return}if(e.closest(".juttu-reply-submit")){this.openReplyFormUri&&this.handleSubmitReply(this.openReplyFormUri);return}if(e.closest(".juttu-submit-btn")){this.requireAuth()&&this.handlePost();return}}setSortOrder(t){this.sortOrder=t,this.pagination.visibleTopLevel=10,this.pagination.visibleReplies.clear(),this.renderWidget()}renderHeader(t){let e=document.createElement("div");e.className="juttu-header";let r=document.createElement("h2");r.className="juttu-title",r.textContent=`${t} Comment${t!==1?"s":""}`,e.appendChild(r);let o=document.createElement("div");o.className="juttu-sort-controls";for(let{value:n,label:i}of[{value:"newest",label:"Newest"},{value:"oldest",label:"Oldest"},{value:"most-liked",label:"Top"}]){let a=document.createElement("button");a.className="juttu-sort-btn"+(this.sortOrder===n?" juttu-sort-btn--active":""),a.dataset.sort=n,a.textContent=i,o.appendChild(a)}return e.appendChild(o),e}renderComposer(){let t=document.createElement("div");return t.className="juttu-composer",this.currentUser?t.appendChild(this.makeComposeArea()):t.appendChild(this.makeLoginArea()),t}makeLoginArea(){let t=document.createElement("div");t.className="juttu-login-area";let e=document.createElement("button");return e.className="juttu-login-btn",e.textContent="Login with Bluesky",t.appendChild(e),t}makeComposeArea(){let t=document.createElement("div");t.className="juttu-compose-area";let e=document.createElement("div");if(e.className="juttu-compose-user",this.currentUser.avatar){let a=document.createElement("img");a.className="juttu-compose-avatar",a.src=this.currentUser.avatar,a.alt=this.currentUser.handle,e.appendChild(a)}else{let a=document.createElement("div");a.className="juttu-avatar-placeholder",e.appendChild(a)}let r=document.createElement("span");r.className="juttu-compose-handle",r.textContent=`@${this.currentUser.handle}`,e.appendChild(r);let o=document.createElement("button");o.className="juttu-logout-btn",o.textContent="Logout",e.appendChild(o),t.appendChild(e);let n=document.createElement("textarea");n.className="juttu-compose-input",n.placeholder="Write a comment\u2026",n.rows=3,t.appendChild(n);let i=document.createElement("button");return i.className="juttu-submit-btn",i.textContent="Post comment",i.disabled=!0,t.appendChild(i),t}renderThread(t){let e=document.createElement("div");e.className="juttu-thread";let r=H(t,this.sortOrder),o=r.slice(0,this.pagination.visibleTopLevel);for(let n of o)e.appendChild(this.renderComment(n,0));if(r.length>this.pagination.visibleTopLevel){let n=document.createElement("div");n.className="juttu-load-more";let i=document.createElement("button");i.className="juttu-load-more-btn";let a=r.length-this.pagination.visibleTopLevel;i.textContent=`Load ${Math.min(a,10)} more comments`,n.appendChild(i),e.appendChild(n)}return e}renderComment(t,e){let{post:r}=t,o=r.uri.split("/").pop()??"",n=`https://bsky.app/profile/${r.author.did}/post/${o}`,i=`https://bsky.app/profile/${r.author.handle}`,a=document.createElement("div");a.className="juttu-comment",a.dataset.uri=r.uri,a.dataset.cid=r.cid;let u=document.createElement("div");if(u.className="juttu-comment-header",r.author.avatar){let d=document.createElement("a");d.className="juttu-avatar-link",d.href=i,d.target="_blank",d.rel="noopener noreferrer";let f=document.createElement("img");f.className="juttu-avatar",f.src=r.author.avatar,f.alt=r.author.handle,f.loading="lazy",d.appendChild(f),u.appendChild(d)}else{let d=document.createElement("div");d.className="juttu-avatar-placeholder",u.appendChild(d)}let l=document.createElement("div");l.className="juttu-author-info";let p=document.createElement("a");p.className="juttu-display-name",p.href=i,p.target="_blank",p.rel="noopener noreferrer",p.textContent=r.author.displayName||r.author.handle,l.appendChild(p);let h=document.createElement("a");h.className="juttu-handle",h.href=i,h.target="_blank",h.rel="noopener noreferrer",h.textContent=`@${r.author.handle}`,l.appendChild(h),u.appendChild(l);let m=document.createElement("a");m.className="juttu-time-link",m.href=n,m.target="_blank",m.rel="noopener noreferrer",m.textContent=tt(r.indexedAt),m.title=new Date(r.indexedAt).toLocaleString(),u.appendChild(m),a.appendChild(u);let c=document.createElement("div");c.className="juttu-comment-body";let x=document.createElement("p");if(x.style.margin="0",x.appendChild(rt(r.record.text,r.record.facets)),c.appendChild(x),a.appendChild(c),r.embed?.$type==="app.bsky.embed.images#view"&&r.embed.images?.length){let d=document.createElement("div");d.className="juttu-comment-images";for(let f of r.embed.images){let g=document.createElement("a");g.className="juttu-comment-image-link",g.href=n,g.target="_blank",g.rel="noopener noreferrer";let j=document.createElement("img");j.className="juttu-comment-image",j.src=f.thumb,j.alt=f.alt||"Embedded image",j.loading="lazy",g.appendChild(j),d.appendChild(g)}a.appendChild(d)}let N=this.viewerState.get(r.uri)??{},I=!!N.likeUri,$=!!N.repostUri,k=document.createElement("div");k.className="juttu-comment-actions";let v=document.createElement("button");v.className="juttu-like-btn",v.dataset.liked=String(I),v.dataset.uri=r.uri,v.dataset.cid=r.cid,v.title="Like",v.innerHTML=q;let T=document.createElement("span");T.className="juttu-like-count",T.textContent=String(r.likeCount??0),v.appendChild(T),k.appendChild(v);let b=document.createElement("button");b.className="juttu-repost-btn",b.dataset.reposted=String($),b.dataset.uri=r.uri,b.dataset.cid=r.cid,b.title="Repost",b.innerHTML=G;let L=document.createElement("span");L.className="juttu-repost-count",L.textContent=String(r.repostCount??0),b.appendChild(L),k.appendChild(b);let w=document.createElement("button");w.className="juttu-reply-btn",w.dataset.uri=r.uri,w.title="Reply",w.innerHTML=W;let S=document.createElement("span");S.className="juttu-reply-count",S.textContent=String(r.replyCount??0),w.appendChild(S),k.appendChild(w);let y=document.createElement("a");y.className="juttu-bsky-link",y.href=n,y.target="_blank",y.rel="noopener noreferrer",y.title="View on Bluesky",y.innerHTML=J,k.appendChild(y),a.appendChild(k);let R=(t.replies??[]).filter(d=>d.$type==="app.bsky.feed.defs#threadViewPost");if(R.length>0){let d=document.createElement("div");d.className="juttu-replies";let f=this.pagination.visibleReplies.get(r.uri)??3,g=H(R,this.sortOrder);for(let E of g.slice(0,f))d.appendChild(this.renderComment(E,e+1));let j=g.length-f;if(j>0){let E=document.createElement("button");E.className="juttu-show-replies-btn",E.dataset.uri=r.uri,E.textContent=`Show ${Math.min(j,3)} more repl${j===1?"y":"ies"}`,d.appendChild(E)}a.appendChild(d)}return a}getComposer(){return this.container.querySelector(".juttu-composer")}showLoginForm(){let t=this.getComposer();if(!t)return;t.innerHTML="";let e=document.createElement("div");e.className="juttu-login-form";let r=document.createElement("input");r.type="text",r.className="juttu-handle-input",r.placeholder="yourhandle.bsky.social",r.autocomplete="username",e.appendChild(r);let o=document.createElement("button");o.className="juttu-login-submit",o.textContent="Login \u2192",e.appendChild(o);let n=document.createElement("button");n.className="juttu-login-cancel",n.textContent="Cancel",e.appendChild(n),t.appendChild(e),r.focus()}async handleLoginSubmit(){let t=this.getComposer();if(!t)return;let e=t.querySelector(".juttu-handle-input"),r=t.querySelector(".juttu-login-submit");if(!e||!r)return;let o=e.value.trim().replace(/^@/,"");if(!o){e.focus();return}r.disabled=!0,r.textContent="Opening\u2026",t.querySelector(".juttu-login-error")?.remove();try{let n=await fetch(`${this.config.apiUrl}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({handle:o})});if(!n.ok){let p=await n.json().catch(()=>({}));throw new Error(p.error??`Login failed (${n.status})`)}let i=await n.json();this.loginPopup=window.open(i.redirect_url,"juttu-auth","width=600,height=700,menubar=no,toolbar=no,location=no,status=no"),t.innerHTML="";let a=document.createElement("div");a.className="juttu-login-waiting";let u=document.createElement("span");u.textContent="Waiting for Bluesky authorization\u2026",a.appendChild(u);let l=document.createElement("button");l.className="juttu-login-cancel-poll",l.textContent="Cancel",a.appendChild(l),t.appendChild(a),this.authMessageHandler=p=>{p.data?.type==="juttu-auth-complete"&&this.onAuthComplete()},window.addEventListener("message",this.authMessageHandler),this.loginPollStartTime=Date.now(),this.loginPollInterval=setInterval(()=>this.pollForLogin(),1500)}catch(n){r.disabled=!1,r.textContent="Login \u2192";let i=document.createElement("div");i.className="juttu-login-error",i.textContent=n instanceof Error?n.message:"Login failed",t.appendChild(i)}}async onAuthComplete(){let t=await M(this.config.apiUrl);t&&await this.completeLogin(t)}async pollForLogin(){if(Date.now()-this.loginPollStartTime>12e4){this.cancelLogin();return}let e=await M(this.config.apiUrl);e&&await this.completeLogin(e)}async completeLogin(t){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null),this.authMessageHandler&&(window.removeEventListener("message",this.authMessageHandler),this.authMessageHandler=null);try{this.loginPopup?.close()}catch{}this.loginPopup=null;let e=await X(t.handle);this.currentUser={...t,avatar:e};let r=this.getComposer();if(r){r.innerHTML="",r.appendChild(this.makeComposeArea());let o=r.querySelector(".juttu-compose-input"),n=r.querySelector(".juttu-submit-btn");o&&n&&o.addEventListener("input",()=>{n.disabled=!o.value.trim()})}}cancelLogin(){this.loginPollInterval!==null&&(clearInterval(this.loginPollInterval),this.loginPollInterval=null),this.authMessageHandler&&(window.removeEventListener("message",this.authMessageHandler),this.authMessageHandler=null);try{this.loginPopup?.close()}catch{}this.loginPopup=null;let t=this.getComposer();t&&(t.innerHTML="",t.appendChild(this.makeLoginArea()))}async handleLogout(){try{await fetch(`${this.config.apiUrl}/auth/logout`,{method:"POST",credentials:"include"})}catch{}this.currentUser=null,this.viewerState.clear();let t=this.getComposer();t&&(t.innerHTML="",t.appendChild(this.makeLoginArea()))}requireAuth(){if(!this.currentUser){this.container.querySelector(".juttu-composer")?.scrollIntoView({behavior:"smooth",block:"nearest"});let e=this.container.querySelector(".juttu-login-btn");return e&&(e.classList.remove("juttu-login-btn--pulse"),e.offsetWidth,e.classList.add("juttu-login-btn--pulse"),setTimeout(()=>e.classList.remove("juttu-login-btn--pulse"),800)),!1}return!0}async handleLike(t){let e=t.dataset.uri,r=t.dataset.cid;if(!e||!r)return;let o=this.viewerState.get(e)??{},n=!!o.likeUri,i=t.querySelector(".juttu-like-count"),a=parseInt(i?.textContent??"0",10),u=!n;t.dataset.liked=String(u),i&&(i.textContent=String(a+(u?1:-1))),this.viewerState.set(e,{...o,likeUri:u?"pending":void 0});try{if(n&&o.likeUri){let l=o.likeUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/like`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:l})}).then(this.checkApiResponse),this.viewerState.set(e,{...o,likeUri:void 0})}else{let p=await(await fetch(`${this.config.apiUrl}/bsky/like`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:e,cid:r})}).then(this.checkApiResponse)).json();this.viewerState.set(e,{...o,likeUri:p.uri})}}catch(l){t.dataset.liked=String(n),i&&(i.textContent=String(a)),this.viewerState.set(e,o),this.showActionError(t,l instanceof Error?l.message:"Action failed")}}async handleRepost(t){let e=t.dataset.uri,r=t.dataset.cid;if(!e||!r)return;let o=this.viewerState.get(e)??{},n=!!o.repostUri,i=t.querySelector(".juttu-repost-count"),a=parseInt(i?.textContent??"0",10),u=!n;t.dataset.reposted=String(u),i&&(i.textContent=String(a+(u?1:-1))),this.viewerState.set(e,{...o,repostUri:u?"pending":void 0});try{if(n&&o.repostUri){let l=o.repostUri.split("/").pop();await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({rkey:l})}).then(this.checkApiResponse),this.viewerState.set(e,{...o,repostUri:void 0})}else{let p=await(await fetch(`${this.config.apiUrl}/bsky/repost`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uri:e,cid:r})}).then(this.checkApiResponse)).json();this.viewerState.set(e,{...o,repostUri:p.uri})}}catch(l){t.dataset.reposted=String(n),i&&(i.textContent=String(a)),this.viewerState.set(e,o),this.showActionError(t,l instanceof Error?l.message:"Action failed")}}handleToggleReplyForm(t){if(this.openReplyFormUri===t){this.closeReplyForm();return}this.closeReplyForm();let e=this.container.querySelector(`.juttu-comment[data-uri="${CSS.escape(t)}"]`);if(!e)return;let r=document.createElement("div");r.className="juttu-reply-form";let o=document.createElement("textarea");o.className="juttu-reply-input",o.placeholder="Write a reply\u2026",o.rows=2,r.appendChild(o);let n=document.createElement("div");n.className="juttu-reply-form-actions";let i=document.createElement("span");i.className="juttu-reply-hint",i.textContent="Reply posts to Bluesky",n.appendChild(i);let a=document.createElement("button");a.className="juttu-reply-cancel",a.textContent="Cancel",n.appendChild(a);let u=document.createElement("button");u.className="juttu-reply-submit",u.textContent="Reply",u.disabled=!0,n.appendChild(u),r.appendChild(n);let l=e.querySelector(".juttu-comment-actions");l?.nextSibling?e.insertBefore(r,l.nextSibling):e.appendChild(r),this.openReplyFormUri=t,o.focus()}closeReplyForm(){if(!this.openReplyFormUri)return;this.container.querySelector(".juttu-reply-form")?.remove(),this.openReplyFormUri=null}async handlePost(){let t=this.container.querySelector(".juttu-compose-input"),e=this.container.querySelector(".juttu-submit-btn");if(!t||!e)return;let r=t.value.trim();if(!(!r||!this.rootPostUri||!this.rootPostCid)){e.disabled=!0,e.textContent="Posting\u2026",this.container.querySelector(".juttu-post-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:r,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:this.rootPostUri,cid:this.rootPostCid}}})}).then(this.checkApiResponse),t.value="",e.disabled=!0,e.textContent="Post comment",setTimeout(()=>this.refetchAndRender(),1500)}catch(o){e.disabled=!1,e.textContent="Post comment";let n=document.createElement("div");n.className="juttu-post-error",n.textContent=o instanceof Error?o.message:"Failed to post",e.insertAdjacentElement("afterend",n)}}}async handleSubmitReply(t){let e=this.container.querySelector(".juttu-reply-form");if(!e)return;let r=e.querySelector(".juttu-reply-input"),o=e.querySelector(".juttu-reply-submit");if(!r||!o)return;let n=r.value.trim();if(!n||!this.rootPostUri||!this.rootPostCid)return;let i=_(this.threadData,t);if(i){o.disabled=!0,o.textContent="Replying\u2026",e.querySelector(".juttu-reply-error")?.remove();try{await fetch(`${this.config.apiUrl}/bsky/post`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:n,reply:{root:{uri:this.rootPostUri,cid:this.rootPostCid},parent:{uri:i.uri,cid:i.cid}}})}).then(this.checkApiResponse),this.closeReplyForm(),setTimeout(()=>this.refetchAndRender(),1500)}catch(a){o.disabled=!1,o.textContent="Reply";let u=document.createElement("div");u.className="juttu-reply-error",u.textContent=a instanceof Error?a.message:"Failed to post reply",e.appendChild(u)}}}async refetchAndRender(){if(this.rootPostUri)try{let t=await A(this.rootPostUri);this.threadData=t;let e=new Map;U(t,e);for(let[r,o]of e){let n=this.viewerState.get(r),i={likeUri:n?.likeUri!=="pending"?n?.likeUri??o.likeUri:o.likeUri,repostUri:n?.repostUri!=="pending"?n?.repostUri??o.repostUri:o.repostUri};(i.likeUri||i.repostUri)&&e.set(r,i)}this.viewerState=e,this.renderWidget()}catch{}}checkApiResponse=async t=>{if(!t.ok){let e=await t.json().catch(()=>({}));throw new Error(e.error??`Request failed (${t.status})`)}return t};showActionError(t,e){t.parentElement?.querySelector(".juttu-action-error")?.remove();let r=document.createElement("div");r.className="juttu-action-error",r.textContent=e,t.insertAdjacentElement("afterend",r),setTimeout(()=>r.remove(),4e3)}destroy(){this.loginPollInterval!==null&&clearInterval(this.loginPollInterval),this.authMessageHandler&&window.removeEventListener("message",this.authMessageHandler);try{this.loginPopup?.close()}catch{}this.container.innerHTML=""}};if(typeof window<"u"){let t=function(e){let r=e.getAttribute("data-api-url"),o=e.getAttribute("data-theme")??"auto";if(!r){console.error("Juttu: Missing data-api-url attribute on script tag");return}let n=document.getElementById("juttu-comments");if(!n){console.error('Juttu: No element with id="juttu-comments" found on this page');return}new C(n,{apiUrl:r,theme:o})};window.JuttuWidget=C;let s=document.currentScript;s&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>t(s)):t(s))}return V(nt);})();
