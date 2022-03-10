const Sinon = require('sinon');
const { Request, Response, Headers } = require('@control/cloudflare-workers-router/test/utils/http');

before(() => {
	global.Request = Request;
	global.Response = Response;
	global.Headers = Headers;

	global.DATABASE = {
		get: () => Promise.resolve(),
		put: () => Promise.resolve(),
		delete: () => Promise.resolve()
	};

	global.DEFAULT_RESPONSE = 'http://jocolina.com';
	global.AUTH_TOKEN = 'fake_token';
});

