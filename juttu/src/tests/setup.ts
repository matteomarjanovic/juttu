// Stub browser APIs not available in jsdom
Object.defineProperty(document, 'requestStorageAccess', {
	value: () => Promise.resolve(),
	writable: true,
});

// jsdom does not implement ResizeObserver
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};
