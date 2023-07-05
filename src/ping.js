
class Ping {
	perf({ id, name, value, icon }) {
		const auth = btoa(`${PING_USERNAME}:${PING_PASSWORD}`);

		return fetch('https://api-status.jocolina.com/performance', {
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
