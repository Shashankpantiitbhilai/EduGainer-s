const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Define your routes here
const routes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:id/:token',
    '/otp-verify/:id',
    '/chat/home',
    '/Policies',
    '/library/fee-pay',
    // Removed admin routes
    '/resources',
    '/library',
    '/classes',
    '/classes-reg/:id',
    '/classes/success/:id',
    '/new-reg',
    '/success/:id',
    '/dashboard/:id',
    '/profile/:id',
    '/stationary/home',
];

// Filter out admin routes
const filteredRoutes = routes.filter(route => !route.startsWith('/admin'));

// Create a sitemap
const sitemap = new SitemapStream({ hostname: 'https://edugainers.com' });

// Create a readable stream from the filtered routes array
const stream = Readable.from(filteredRoutes.map(route => ({
    url: route,
    changefreq: 'daily',
    priority: 0.7
})));

streamToPromise(stream.pipe(sitemap)).then(data => {
    fs.writeFileSync('public/sitemap.xml', data.toString());
}).catch(console.error);
