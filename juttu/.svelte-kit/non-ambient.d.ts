
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/callback" | "/(app)/comments" | "/(app)/comments/[userHandle]" | "/(app)/comments/[userHandle]/[articleId]" | "/login";
		RouteParams(): {
			"/(app)/comments/[userHandle]": { userHandle: string };
			"/(app)/comments/[userHandle]/[articleId]": { userHandle: string; articleId: string }
		};
		LayoutParams(): {
			"/(app)": { userHandle?: string; articleId?: string };
			"/": { userHandle?: string; articleId?: string };
			"/callback": Record<string, never>;
			"/(app)/comments": { userHandle?: string; articleId?: string };
			"/(app)/comments/[userHandle]": { userHandle: string; articleId?: string };
			"/(app)/comments/[userHandle]/[articleId]": { userHandle: string; articleId: string };
			"/login": Record<string, never>
		};
		Pathname(): "/" | "/callback" | `/comments/${string}/${string}` & {} | "/login";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/embed/juttu-embed.min.js" | "/juttu_logo.svg" | "/oauth-client-metadata.json" | "/robots.txt" | "/test.png" | string & {};
	}
}