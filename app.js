const { App } = require('@control/cloudflare-workers-router');

const router = require('./src/router');

const app = new App(router);

app.error((error) => {
	console.error(error);

	return fetch('https://api.logsnag.com/v1/log', {
		method: 'POST',
		body: JSON.stringify({
			project: 'urls',
			channel: 'errors',
			event: error.message || 'Unknown error',
			description: error.stack,
			notify: true,
		}),
		headers: {
			Authorization: `Bearer ${LOGSNAG_TOKEN}`,
			'Content-Type': 'application/json'
		}
	}).finally(() => {
		return new Response(null, { status: 500 });
	});
});

app.listen();
