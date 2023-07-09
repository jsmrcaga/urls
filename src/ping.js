class Ping {
	perf({ id, name, value, icon }) {
		if(!globalThis.performance_logger) {
			return Promise.reject(new Error('No service binding for perf worker'));
		}

		const auth = btoa(`${globalThis.PING_USERNAME}:${globalThis.PING_PASSWORD}`);

		// Small vendor lock-in
		return globalThis.performance_logger.fetch(globalThis.PING_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify([{
				id,
				name,
				project: 'urls',
				page_hosts: ['status.jocolina.com'],
				points: [{
					value,
					date: new Date().toISOString()
				}]
			}]),
			headers: {
				Authorization: `Basic ${auth}`,
				'Content-Type': 'application/json'
			}
		}).catch(e => {
			console.error(e);
		});
	}
}

const ping = new Ping();
module.exports = ping;
