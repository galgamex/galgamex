// 拦截Cloudflare RUM请求
(function () {
    if (typeof window !== 'undefined') {
        // 使用Fetch API拦截
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
            // 检查URL是否为Cloudflare RUM请求
            if (typeof url === 'string' && (
                url.includes('/cdn-cgi/rum') ||
                url.includes('cloudflare') && url.includes('beacon')
            )) {
                // 返回一个成功的空响应，避免控制台错误
                console.debug('已拦截Cloudflare RUM请求:', url);
                return Promise.resolve(new Response(JSON.stringify({}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            // 正常处理其他请求
            return originalFetch.apply(this, arguments);
        };

        // 使用XMLHttpRequest拦截
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string' && (
                url.includes('/cdn-cgi/rum') ||
                url.includes('cloudflare') && url.includes('beacon')
            )) {
                // 将URL重写为无害URL
                console.debug('已拦截Cloudflare RUM XHR请求:', url);
                arguments[1] = 'data:text/plain,{}';
            }
            return originalXHROpen.apply(this, arguments);
        };

        console.debug('Cloudflare RUM请求拦截已启用');
    }
})(); 