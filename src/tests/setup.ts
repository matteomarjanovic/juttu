// Stub browser APIs not available in jsdom
Object.defineProperty(document, 'requestStorageAccess', {
	value: () => Promise.resolve(),
	writable: true,
});
