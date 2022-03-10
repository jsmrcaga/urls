class Tracker {
	constructor({ name=null, tag, visits=[],  notify=false }) {
		this.name = name;
		this.visits = visits;
		this.tag = tag || Math.floor(Math.random() * 0x100000000).toString(16).slice(0, 6);
		this.notify = notify;
	}

	visited(headers) {
		this.visits.push(headers);
	}

	get_id() {
		return this.tag;
	}

	toJSON() {
		return {
			visits: this.visits,
			tag: this.tag
		};
	}

	save() {
		return DATABASE.put(this.tag, JSON.stringify(this)).then(() => this);
	}
}

class ShortUrl extends Tracker {
	constructor({ url, ...rest }) {
		super(rest);
		this.url = url;
	}

	get_id() {
		return `url-${this.tag}`;
	}

	toJSON() {
		return {
			url: this.url,
			...super.toJSON()
		};
	}
}

class Pixel extends Tracker {
	get_id() {
		return `pixel-${this.tag}`;
	}
}

module.exports = { ShortUrl, Pixel };
