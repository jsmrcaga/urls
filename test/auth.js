const Sinon = require('sinon');
const { expect } = require('chai');
const auth = require('../src/auth');

describe('Auth middleware', () => {
	it('Returns 401 if no authorization header', () => {
		const request = new global.Request({});
		request.headers = new Headers();

		const cb = Sinon.fake.returns(5);
		const wrapped = auth(cb);

		expect(wrapped).to.be.an.instanceof(Function);

		const result = wrapped(request);
		expect(result).to.be.an.instanceof(global.Response);
		expect(result.status).to.be.eql(401);
		expect(cb.called).to.be.false;
	});

	it('Returns 403 because of invalid token', () => {
		const request = new global.Request({});
		request.headers = new Headers();
		request.headers.set('Authorization', 'plep');

		const cb = Sinon.fake.returns(5);
		const wrapped = auth(cb);

		expect(wrapped).to.be.an.instanceof(Function);

		const result = wrapped(request);
		expect(result).to.be.an.instanceof(global.Response);
		expect(result.status).to.be.eql(403);
		expect(cb.called).to.be.false;
	});

	it('Returns the result of the callback function', () => {
		const request = new global.Request({});
		request.headers = new Headers();
		request.headers.set('Authorization', 'fake_token');

		const cb = Sinon.fake.returns(5);
		const wrapped = auth(cb);

		expect(wrapped).to.be.an.instanceof(Function);

		const result = wrapped(request);
		expect(result).to.be.eql(5)
	});
});
