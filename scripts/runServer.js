const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    console.log(`> Next.js server starting on http://${hostname}:${port}`);

    createServer(async (req, res) => {
        try {
            // 解析URL
            const parsedUrl = parse(req.url, true);
            const { pathname } = parsedUrl;

            // 打印请求路径以便调试
            console.log(`> Request: ${req.url}`);

            // 检查是否是静态资源请求
            if (pathname.startsWith('/_next/') ||
                pathname.startsWith('/static/') ||
                pathname.startsWith('/images/') ||
                pathname.endsWith('.js') ||
                pathname.endsWith('.css')) {

                console.log(`> Handling static asset: ${pathname}`);

                // 特别检查文档页和排行榜页的资源
                if (pathname.includes('doc-bundle') || pathname.includes('leaderboard-bundle')) {
                    console.log(`> Special handling for ${pathname}`);
                }
            }

            // 对于文档页和排行榜页的请求，确保正确加载资源
            if (pathname.startsWith('/doc') || pathname.startsWith('/leaderboard')) {
                console.log(`> Important route detected: ${pathname}`);
            }

            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
}); 