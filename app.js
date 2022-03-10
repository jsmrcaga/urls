const { App } = require('@control/cloudflare-workers-router');

const router = require('./src/router');

const app = new App(router);

app.listen();
