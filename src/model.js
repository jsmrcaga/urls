class Tracker {
	constructor({ name=null, tag, visits=[],  notify=false }) {
		this.name = name;
		this.visits = visits;
		this.tag = tag || Math.floor(Math.random() * 0x100000000).toString(16).slice(0, 6);
		this.notify = notify;
	}

	static get_id(id) {
		const prefix = this.prefix;
		return `${prefix}-${id}`;
	}

	static get(id) {
		return DATABASE.get(this.get_id(id)).then(data => {
			if(data === null) {
				return null;
			}

			const model_data = JSON.parse(data);
			return new this(model_data);
		});
	}

	toJSON() {
		return {
			visits: this.visits,
			tag: this.tag
		};
	}

	visited(headers) {
		this.visits.push(headers);
	}

	save() {
		return DATABASE.put(this.constructor.get_id(this.tag), JSON.stringify(this)).then(() => this);
	}
}

class ShortUrl extends Tracker {
	static prefix = 'url';

	constructor({ url, ...rest }) {
		super(rest);
		this.url = url;
	}


	toJSON() {
		return {
			url: this.url,
			...super.toJSON()
		};
	}
}

class Pixel extends Tracker {
	static prefix = 'pixel';
}

module.exports = { ShortUrl, Pixel };
