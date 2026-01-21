import { PUBLIC_HOSTNAME } from '$env/static/public';
import type { BrowserOAuthClient as BrowserOAuthClientType, OAuthSession } from '@atproto/oauth-client-browser';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { SvelteURLSearchParams } from 'svelte/reactivity';

// Singleton client instance
let clientInstance: BrowserOAuthClientType | null = null;
let clientPromise: Promise<BrowserOAuthClientType> | null = null;

// Store reference to login popup for cleanup
let loginPopup: Window | null = null;

// Reactive auth state using Svelte 5's $state pattern for cross-module sharing
export const authState = $state<{
    session: OAuthSession | null;
    profile: ProfileViewDetailed | null;
    agent: import('@atproto/api').Agent | null; // Agent from @atproto/api
    isInitialized: boolean;
    isLoading: boolean;
}>({
    session: null,
    profile: null,
    agent: null,
    isInitialized: false,
    isLoading: false
});

function getClientMetadata() {
    return {
        client_id: `https://${PUBLIC_HOSTNAME}/oauth-client-metadata.json`,
        client_name: "My App",
        client_uri: `https://${PUBLIC_HOSTNAME}`,
        logo_uri: `https://${PUBLIC_HOSTNAME}/logo.png`,
        tos_uri: `https://${PUBLIC_HOSTNAME}/tos`,
        policy_uri: `https://${PUBLIC_HOSTNAME}/policy`,
        redirect_uris: [`https://${PUBLIC_HOSTNAME}/callback`] as [string, ...string[]],
        scope: "atproto transition:generic",
        grant_types: ["authorization_code", "refresh_token"] as ["authorization_code", "refresh_token"],
        response_types: ["code"] as ["code"],
        token_endpoint_auth_method: "none" as const,
        application_type: "web" as const,
        dpop_bound_access_tokens: true
    };
}

export async function getClient(): Promise<BrowserOAuthClientType> {
    if (clientInstance) {
        return clientInstance;
    }

    if (clientPromise) {
        return clientPromise;
    }

    clientPromise = (async () => {
        const { BrowserOAuthClient } = await import('@atproto/oauth-client-browser');
        clientInstance = new BrowserOAuthClient({
            clientMetadata: getClientMetadata(),
            handleResolver: 'https://bsky.social'
        });

        // Listen for session events from the client
        clientInstance.addEventListener('deleted', ({ detail: { sub } }) => {
            console.log(`Session deleted for ${sub}`);
            if (authState.session?.sub === sub) {
                authState.session = null;
                authState.profile = null;
                authState.agent = null;
            }
        });

        return clientInstance;
    })();

    return clientPromise;
}

/**
 * Initialize auth on app load - restores existing sessions
 * Should NOT be called on the callback page
 */
export async function initAuth(): Promise<OAuthSession | null> {
    if (authState.isInitialized) {
        return authState.session;
    }

    authState.isLoading = true;

    try {
        const client = await getClient();

        // Use initRestore to only restore existing sessions without processing callback params
        const result = await client.init(false);

        if (result?.session) {
            console.log(`Session restored for ${result.session.sub}`);
            authState.session = result.session;
            // Create agent
            const { Agent } = await import('@atproto/api');
            authState.agent = new Agent(result.session);
            // Fetch profile info
            await fetchProfile(result.session);
        }

        authState.isInitialized = true;
        return authState.session;
    } catch (err) {
        console.error('Auth initialization failed:', err);
        authState.isInitialized = true;
        return null;
    } finally {
        authState.isLoading = false;
    }
}

/**
 * Process OAuth callback - called ONLY on the callback page
 * For popup mode, this communicates with the parent window
 */
export async function processCallback(): Promise<{ session: OAuthSession; state?: string | null } | null> {
    try {
        const client = await getClient();

        // initCallback processes the OAuth params from the URL
        // For popup mode, it will communicate with the parent window and throw LoginContinuedInParentWindowError
        const result = await client.initCallback();

        if (result?.session) {
            console.log(`Callback processed for ${result.session.sub}`);
            authState.session = result.session;
            authState.isInitialized = true;
            // Create agent
            const { Agent } = await import('@atproto/api');
            authState.agent = new Agent(result.session);
            // Fetch profile info
            await fetchProfile(result.session);
        }

        return result ?? null;
    } catch (err: unknown) {
        // LoginContinuedInParentWindowError is expected for popup mode
        // The popup window will close itself, and the parent window handles the session
        if (err && typeof err === 'object' && 'message' in err &&
            (err as Error).message === 'Login continued in parent window') {
            console.log('Popup callback completed, parent window will handle session');
            throw err; // Re-throw so the UI knows this is expected
        }
        console.error('Callback processing failed:', err);
        throw err;
    }
}

/**
 * Login with popup - prompts user for their handle
 */
export async function loginWithPopup(handle: string): Promise<OAuthSession> {
    if (!handle?.trim()) {
        throw new Error('Handle is required');
    }

    authState.isLoading = true;

    try {
        const client = await getClient();
        console.log('Initiating popup login for:', handle);

        client.authorize()

        const session = await client.signIn(handle.trim(), {
            display: 'popup',
            signal: AbortSignal.timeout(5 * 60 * 1000) // 5 minute timeout
        });

        console.log('Login completed successfully!', session.sub);
        authState.session = session;
        authState.isInitialized = true;
        // Create agent
        const { Agent } = await import('@atproto/api');
        authState.agent = new Agent(session);
        // Fetch profile info
        await fetchProfile(session);

        return session;
    } catch (err) {
        console.error('Login failed:', err);
        throw err;
    } finally {
        authState.isLoading = false;
    }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
    if (!authState.session) {
        return;
    }

    try {
        const client = await getClient();
        await client.revoke(authState.session.sub);
        authState.session = null;
        authState.profile = null;
        authState.agent = null;
        console.log('Logged out successfully');
    } catch (err) {
        console.error('Logout failed:', err);
        // Clear session anyway
        authState.session = null;
        authState.profile = null;
        authState.agent = null;
        throw err;
    }
}

/**
 * Restore a specific session by DID
 */
export async function restoreSession(did: string): Promise<OAuthSession | null> {
    try {
        const client = await getClient();
        const session = await client.restore(did, false);
        authState.session = session;
        // Create agent
        const { Agent } = await import('@atproto/api');
        authState.agent = new Agent(session);
        // Fetch profile info
        await fetchProfile(session);
        return session;
    } catch (err) {
        console.error('Failed to restore session:', err);
        return null;
    }
}

/**
 * Fetch and store profile info for the logged-in user
 */
async function fetchProfile(session: OAuthSession): Promise<void> {
    try {
        // Use the agent from authState (should already be created before this is called)
        if (!authState.agent) {
            throw new Error('Agent not available');
        }
        const response = await authState.agent.getProfile({ actor: session.did });
        authState.profile = response.data;
        console.log('Profile fetched:', authState.profile.handle);
    } catch (err) {
        console.error('Failed to fetch profile:', err);
        authState.profile = null;
    }
}

/**
 * Open the login popup for iframe-based authentication.
 * This opens /login in a popup, which handles the OAuth flow
 * and relays auth params back via postMessage.
 * 
 * @returns true if popup opened successfully, false if blocked
 */
export function openLoginPopup(): boolean {
    const currentOrigin = window.location.origin;
    const loginUrl = `https://${PUBLIC_HOSTNAME}/login?opener=${encodeURIComponent(currentOrigin)}`;

    // Calculate popup dimensions and position (centered)
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    loginPopup = window.open(
        loginUrl,
        'juttu-login',
        `width=${width},height=${height},left=${left},top=${top},popup=true`
    );

    if (!loginPopup) {
        console.warn('Login popup was blocked');
        return false;
    }

    console.log('Login popup opened');
    return true;
}

/**
 * Request authentication from the user.
 * Opens the login popup and returns information about the result.
 * 
 * @returns Object with success status and optional fallback URL if popup was blocked
 */
export function requestAuth(): { success: boolean; fallbackUrl?: string } {
    const success = openLoginPopup();

    if (!success) {
        // Return fallback URL for manual opening
        const currentOrigin = window.location.origin;
        const fallbackUrl = `https://${PUBLIC_HOSTNAME}/login?opener=${encodeURIComponent(currentOrigin)}`;
        return { success: false, fallbackUrl };
    }

    return { success: true };
}

/**
 * Process OAuth callback params received via postMessage from the login popup.
 * This is called in the iframe context to complete authentication using
 * params relayed from the popup window chain.
 */
export async function processCallbackParams(params: string): Promise<OAuthSession | null> {
    authState.isLoading = true;

    try {
        const client = await getClient();

        // Parse the query string params
        const searchParams = new SvelteURLSearchParams(params);
        console.log('Processing callback params:', params);

        // Use the client's callback method with the params
        // This processes the OAuth response in the iframe's storage context
        const result = await client.callback(searchParams);

        if (result?.session) {
            console.log(`Callback params processed for ${result.session.sub}`);
            authState.session = result.session;
            authState.isInitialized = true;

            // Create agent
            const { Agent } = await import('@atproto/api');
            authState.agent = new Agent(result.session);

            // Fetch profile info
            await fetchProfile(result.session);

            return result.session;
        }

        return null;
    } catch (err) {
        console.error('Failed to process callback params:', err);
        throw err;
    } finally {
        authState.isLoading = false;
    }
}

/**
 * Set up the postMessage listener for receiving auth callbacks from the login popup.
 * This should be called once when the app initializes in an iframe context.
 */
export function setupAuthMessageListener(): () => void {
    const handleMessage = async (event: MessageEvent) => {
        // Accept messages from our own origin (the login popup)
        if (event.origin !== `https://${PUBLIC_HOSTNAME}`) {
            return;
        }

        if (event.data?.type === 'juttu-auth-callback' && event.data.params) {
            console.log('Received auth callback params from login popup');
            try {
                await processCallbackParams(event.data.params);
                console.log('Authentication completed successfully');
            } catch (err) {
                console.error('Failed to process auth callback:', err);
            }
        } else if (event.data?.type === 'juttu-auth-success') {
            // Auth completed in redirect mode - re-init to check for session
            console.log('Received auth success signal, re-initializing auth...');
            // Note: This won't work due to storage partitioning, but we try anyway
            // The callback params flow is the primary mechanism
            await initAuth();
        }
    };

    window.addEventListener('message', handleMessage);
    console.log('Auth message listener set up');

    // Return cleanup function
    return () => {
        window.removeEventListener('message', handleMessage);
    };
}