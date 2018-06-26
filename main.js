const Koa = require('koa');
const router = require('./app/route/wechat');
const app = new Koa();
require('./env');
const {sys} = require('./.env.toml');

const bodyParser = require('koa-bodyparser')

app.use(bodyParser())

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(sys.port, () => {
    console.log(`server is running on ${sys.port}`)
});
