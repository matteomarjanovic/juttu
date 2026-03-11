interface JuttuConfig {
    userHandle: string;
    articleId: string;
    hostname?: string;
    theme?: 'light' | 'dark' | 'auto';
}

class JuttuEmbed {
    private config: JuttuConfig;
    private iframe: HTMLIFrameElement | null = null;
    private container: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor(config: JuttuConfig) {
        this.config = {
            theme: 'light',
            ...config
        };

        this.init();
    }

    private init(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    private detectTheme(): 'light' | 'dark' {
        // Create a temp element inside the container to inherit the site's text color
        const container = document.getElementById('juttu-comments');
        if (!container) return 'light';

        const tempDiv = document.createElement('div');
        container.appendChild(tempDiv);

        const computedStyle = window.getComputedStyle(tempDiv);
        const color = computedStyle.color;
        container.removeChild(tempDiv);

        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return 'light';

        const [r, g, b] = rgb.map(Number);

        // Disqus algorithm: light scheme when inherited text color is dark
        // (between #000000 and #787878, i.e. each RGB channel <= 120)
        // #787878 = rgb(120, 120, 120)
        // If text is dark, background is light → use light theme
        // If text is light, background is dark → use dark theme
        const isTextDark = r <= 120 && g <= 120 && b <= 120;

        return isTextDark ? 'light' : 'dark';
    }

    private getTheme(): string {
        if (this.config.theme === 'auto') {
            return this.detectTheme();
        }
        return this.config.theme || 'light';
    }

    private render(): void {
        this.container = document.getElementById('juttu-comments');
        if (!this.container) {
            console.error('Juttu: Container #juttu-comments not found');
            return;
        }

        const { userHandle, articleId, hostname } = this.config;
        const theme = this.getTheme();
        const iframeUrl = `${hostname}/comments/${encodeURIComponent(userHandle)}/${encodeURIComponent(articleId)}?theme=${theme}`;

        this.iframe = document.createElement('iframe');
        this.iframe.src = iframeUrl;
        this.iframe.style.width = '100%';
        this.iframe.style.border = 'none';
        this.iframe.style.minHeight = '400px';
        this.iframe.style.display = 'block';
        this.iframe.setAttribute('title', 'Juttu Comments');
        this.iframe.setAttribute('loading', 'lazy');
        this.iframe.setAttribute('scrolling', 'no');

        window.addEventListener('message', this.handleMessage.bind(this));
        this.container.appendChild(this.iframe);
        this.setupResizeObserver();
    }

    private handleMessage(event: MessageEvent): void {
        if (event.origin !== new URL(this.config.hostname!).origin) {
            return;
        }

        if (event.data?.type === 'juttu-resize' && typeof event.data.height === 'number') {
            if (this.iframe) {
                this.iframe.style.height = `${event.data.height}px`;
            }
        }
    }

    private setupResizeObserver(): void {
        if (!this.container) return;

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (this.iframe) {
                    this.iframe.contentWindow?.postMessage(
                        {
                            type: 'juttu-width-change',
                            width: entry.contentRect.width
                        },
                        this.config.hostname!
                    );
                }
            }
        });

        this.resizeObserver.observe(this.container);
    }

    public destroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.iframe && this.iframe.parentNode) {
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
        }
    }
}

export { JuttuEmbed };

// Auto-init when loaded as script tag
if (typeof window !== 'undefined') {
    (window as unknown as { JuttuEmbed: typeof JuttuEmbed }).JuttuEmbed = JuttuEmbed;

    // Store reference to script before it might become null
    const currentScript = document.currentScript as HTMLScriptElement;

    if (currentScript) {
        // If defer/async, wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => autoInitFromScript(currentScript));
        } else {
            autoInitFromScript(currentScript);
        }
    }
}

function autoInitFromScript(script: HTMLScriptElement): void {
    const userHandle = script.getAttribute('data-bsky-user-handle');
    const articleId = script.getAttribute('data-article-id');
    const theme = script.getAttribute('data-theme') as 'light' | 'dark' | 'auto' | null;
    let hostname = script.getAttribute('data-hostname');

    if (!userHandle || !articleId) {
        console.error(
            'Juttu: Missing required attributes data-bsky-user-handle and/or data-article-id'
        );
        return;
    }

    // If hostname not provided, derive it from the script's src URL
    if (!hostname && script.src) {
        try {
            const scriptUrl = new URL(script.src);
            hostname = scriptUrl.origin;
        } catch {
            console.error('Juttu: Could not determine hostname from script src');
            return;
        }
    }

    new JuttuEmbed({
        userHandle,
        articleId,
        theme: theme || 'light',
        hostname: hostname || undefined
    });
}
