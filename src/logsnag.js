class Logsnag {
	insight({ title, value, icon }) {
		return fetch('https://api.logsnag.com/v1/insight', {
			method: 'POST',
			body: JSON.stringify({
				project: 'urls',
				title,
				value,
				icon
			}),
			headers: {
				Authorization: `Bearer ${LOGSNAG_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}).catch(e => {
			console.error(e);
		});
	}
}

const logsnag = new Logsnag;
module.exports = logsnag;
