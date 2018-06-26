const Router = require('koa-router');
const router = new Router({ prefix: '/api'});

const { wechatOauth } = require("../controller/user");

router.get('/wechat/oauth',wechatOauth);
router
    .get('/a',async (ctx,next)=> {
        ctx.redirect('http://baidu.com');
        await next()
    })
    .post('/a',async (ctx,next) => {
        ctx.body = ctx.request.body;
        await next()
    })

module.exports = router;
