// 网络请求监控脚本 - 仅用于调试
(function () {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            // 记录所有外部请求
            const url = args[0]?.toString() || '';
            if (url && !url.startsWith('/') && !url.startsWith('http://localhost')) {
                console.debug('[网络监控] 外部请求:', url);
            }
            return originalFetch.apply(this, args);
        };

        // 监控所有XMLHttpRequest
        const origXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            const url = args[1]?.toString() || '';
            if (url && !url.startsWith('/') && !url.startsWith('http://localhost')) {
                console.debug('[网络监控] XHR外部请求:', url);
            }
            return origXhrOpen.apply(this, args);
        };

        // 拦截Cloudflare 请求
        const blockPatterns = [
            '/cdn-cgi/rum',
            'cloudflare-static',
            'cloudflare.com'
        ];

        // 创建一个MutationObserver检查新添加的脚本
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        // 检查新添加的脚本标签
                        if (node.nodeName === 'SCRIPT' && node.src) {
                            for (const pattern of blockPatterns) {
                                if (node.src.includes(pattern)) {
                                    console.debug('[网络监控] 已拦截Cloudflare脚本:', node.src);
                                    node.parentNode.removeChild(node);
                                    break;
                                }
                            }
                        }
                    });
                }
            });
        });

        // 开始观察文档变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        console.debug('[网络监控] 网络监控已启用');
    }
})(); 