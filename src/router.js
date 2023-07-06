const { ShortUrl, Pixel } = require('./model');
const auth = require('./auth');
const { Router } = require('@control/cloudflare-workers-router');

const ping = require('./ping');

const router = new Router();

router.post('/:tag', auth((request, { tag }) => {
	return request.json().then(body => {
		const { url, ...rest } = body;
		if(!url) {
			return Response('url is needed', { status: 400 });
		}

		const short_url = new ShortUrl({ tag, url, ...rest });
		return short_url.save();
	}).then(() => {
		return new Response(null, { status: 201 });
	});
}));

router.get('/:tag', (request, { tag }, preprocessed, event) => {
	// Get short url
	const start = Date.now();
	let get_duration;
	return ShortUrl.get(tag).then(short_url => {
		get_duration = Date.now() - start;

		if(short_url === null) {
			// Short tag does not exist, so we simulate the response
			return new Response(null, { status: 404 });
		}

		short_url.visited(Object.fromEntries(request.headers.entries()));

		// Do not will worker but execute asynchornously
		event.waitUntil(short_url.save());

		// Perform real async performance request
		const perf_request = ping.perf({
			id: 'urls-kv-read',
			name: 'urls: KV read',
			value: get_duration,
		});

		event.waitUntil(perf_request);

		return new Response(null, {
			status: 302,
			headers: {
				Location: short_url.url
			}
		});
	});
});

router.get('/:tag/qr.png', (request, { tag }) => {
	return ShortUrl.get(tag).then(short_url => {
		if(short_url === null) {
			// Short tag does not exist, so we simulate the response
			return new Response(null, { status: 404 });
		}

		const qr_url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(short_url.url)}&size=256x256&qzone=2&format=png`
		return new Response(null, {
			status: 302,
			headers: {
				Location: qr_url
			}
		});
	});
});

router.get('/:tag/stats', auth((request, { tag }) => {
	// get stats for given url
	return ShortUrl.get(tag).then(short => {
		// Router will automatically stringify
		return {
			...short,
			visit_count: short.visits.length
		};
	});
}));

router.get('/pixel/:tag/stats', auth((request, { tag }) => {
	// get stats for given url
	return Pixel.get(tag).then(pixel => {
		// Router will automatically stringify
		return {
			...pixel,
			visit_count: pixel.visits.length
		};
	});
}));

router.post('/pixel/:tag', auth((request, { tag }) => {
	// Creates a named pixel, to simplify tracking
	return request.json().then(body => {
		const pixel = new Pixel({ tag, ...body });
		return pixel.save();
	}).then(() => {
		return new Response(null, { status: 201 });
	});
}));

router.get('/:tag/p.gif', (request, { tag }) => {
	const headers = Object.fromEntries(request.headers.entries());

	return Pixel.get(tag).then(pixel => {
		if(pixel === null) {
			// Pixels can auto create
			const pixel = new Pixel({ tag, visits: [headers] });
			return pixel.save();
		}

		pixel.visited(headers);
		return pixel.save();

	}).then(response => {
		// Tracking for pixel
		const pixel_str = atob('R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==');
		const encoder = new TextEncoder();
		const pixel_bytes = encoder.encode(pixel_str);

		return new Response(pixel_bytes, {
			headers: {
				'Content-Type': 'image/gif'
			}
		});
	});
});

module.exports = router;
