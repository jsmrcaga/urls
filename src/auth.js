module.exports = (callback) => {
	return (request, ...args) => {
		if(!request.headers.get('Authorization')) {
			return new Response(null, { status: 401 });
		}

		const token = request.headers.get('Authorization').replace(/^Bearer/gi, '').trim();

		// Auth token is bound globally via environment
		if(token !== globalThis.AUTH_TOKEN) {
			return new Response(null, { status: 403 });
		}

		return callback(request, ...args);
	};
};
