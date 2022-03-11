const Sinon = require('sinon');
const { expect } = require('chai');

const { ShortUrl } = require('../src/model');

const router = require('../src/router');

describe('Routing', () => {
	describe('Short URL retrieval', () => {
		it('Gets a short URL', done => {
			const stub = Sinon.stub(global.DATABASE, 'get').callsFake(() => {
				return Promise.resolve(JSON.stringify({
					visits: [],
					tag: '1234',
					url: 'http://google.com'
				}));
			});

			const visited_stub = Sinon.stub(ShortUrl.prototype, 'visited');
			const save_stub = Sinon.stub(ShortUrl.prototype, 'save').callsFake(function() { return this; });

			const request = new global.Request({
				method: 'GET',
				url: 'http://plep.com/1234'
			});

			const { callback, params } = router.route(request);

			expect(params).to.be.deep.eql({ tag: '1234' });
			
			callback(request, params).then(response => {
				expect(response.status).to.be.eql(302);
				expect(response.headers.get('Location')).to.be.eql('http://google.com');

				expect(visited_stub.calledOnce).to.be.true;
				expect(save_stub.calledOnce).to.be.true;
			}).catch(e => {
				done(e);
			}).finally(() => {
				stub.restore();
				visited_stub.restore();
				save_stub.restore();
				done();
			});
		});

		it('Returns the 404 if no tag is present', done => {
			const stub = Sinon.stub(global.DATABASE, 'get').callsFake(() => Promise.resolve(null));

			const request = new global.Request({
				method: 'GET',
				url: 'http://plep.com/1234'
			});

			const visited_stub = Sinon.stub(ShortUrl.prototype, 'visited');
			const save_stub = Sinon.stub(ShortUrl.prototype, 'save').callsFake(function() { return this; });

			const { callback, params } = router.route(request);

			expect(params).to.be.deep.eql({ tag: '1234' });

			callback(request, params).then(response => {
				expect(response.status).to.be.eql(404);

				expect(visited_stub.called).to.be.false;
				expect(save_stub.called).to.be.false;
			}).catch(e => {
				done(e);
			}).finally(() => {
				stub.restore();
				visited_stub.restore();
				save_stub.restore();
				done();
			});
		});
	});

	describe('Tag creation', () => {
		it('Returns 401', () => {
			const request = new global.Request({
				method: 'POST',
				url: 'https://ple.com/custom_tag',
				body: {
					url: 'http://google.com'
				}
			});

			const { callback, params } = router.route(request);

			expect(callback).to.be.instanceof(Function);
			expect(params.tag).to.be.eql('custom_tag');

			const response = callback(request, params);
			expect(response.status).to.be.eql(401);
		});

		it('Creates a tag', done => {
			const stub = Sinon.stub(global.DATABASE, 'put').callsFake(() => Promise.resolve());

			const request = new global.Request({
				method: 'POST',
				url: 'https://ple.com/custom_tag',
				headers: {
					Authorization: `Bearer ${global.AUTH_TOKEN}`
				},
				body: {
					url: 'http://google.com'
				}
			});

			const { callback, params } = router.route(request);

			expect(callback).to.be.instanceof(Function);
			expect(params.tag).to.be.eql('custom_tag');

			callback(request, params).then(response => {
				expect(stub.calledOnce).to.be.true;
				const { firstCall } = stub;
				// Sinon returns true for first arg even if there are others
				expect(firstCall.calledWith('url-custom_tag')).to.be.true;

				expect(response.status).to.be.eql(201);
				expect(stub.calledOnce).to.be.true;
			}).catch(e => done(e)).finally(() => {
				stub.restore();
				done();
			});
		});
	});
});
