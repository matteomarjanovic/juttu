import { JuttuWidget } from './widget';

// ─── Auto-Init ────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
	(window as unknown as Record<string, unknown>).JuttuWidget = JuttuWidget;

	const currentScript = document.currentScript as HTMLScriptElement | null;

	function autoInitFromScript(script: HTMLScriptElement): void {
		const apiUrl = script.getAttribute('data-api-url');
		const theme = (script.getAttribute('data-theme') ?? 'auto') as 'auto' | 'light' | 'dark';

		if (!apiUrl) {
			console.error('Juttu: Missing data-api-url attribute on script tag');
			return;
		}
		const container = document.getElementById('juttu-comments');
		if (!container) {
			console.error('Juttu: No element with id="juttu-comments" found on this page');
			return;
		}
		new JuttuWidget(container, { apiUrl, theme });
	}

	if (currentScript) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => autoInitFromScript(currentScript));
		} else {
			autoInitFromScript(currentScript);
		}
	}
}
