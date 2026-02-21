// Reactive auth mock for page-level tests.
// Uses $state so that mutations (e.g. authState.agent = mockAgent) trigger
// Svelte effects in the component under test, just like the real auth module.
export const authState = $state({
	agent: null as any,
	session: null as any,
	profile: null as any,
	isInitialized: true,
	isLoading: false,
});

export const requestAuth = () => ({ success: false, fallbackUrl: null as string | null });
export const logout = async () => {};
export const openLoginPopup = async () => {};
