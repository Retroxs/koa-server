const axios = require('axios')
const userModel = require('../model/user');
require('../../env');
const {wechat, pmoi} = require("../../.env.toml");
const OAuth = require('co-wechat-oauth');
const client = new OAuth(wechat.app_id, wechat.app_secret);
const url = client.getAuthorizeURL(wechat.redirct_url, wechat.state, wechat.scope);

async function wechatOauth(ctx, next) {
    let {code} = ctx.query;
    let token = await client.getAccessToken(code);
    let {openid} = token.data;
    let userInfo = await client.getUser(openid);

    try {
        const user = await userModel.getUserByOpenid(openid);
        if (!user) {
            await createPmUser(userInfo.openid);
            await userModel.createUser(openid)
            ctx.body = "注册成功";
        } else {
            ctx.body = "您已经注册";
        }
    } catch (e) {
        console.log(e);
    }
    await next()
}

async function createPmUser(openid) {
    //登录pm,获取access_token
    const login_res = await axios.post(pmoi.auth_host,
        {
            grant_type: "password",
            scope: "*",
            client_id: pmoi.client_id,
            client_secret: pmoi.client_secret,
            username: pmoi.username,
            password: pmoi.password
        });
    let {access_token} = login_res.data;

    axios.defaults.headers.common['Authorization'] = "Bearer " + access_token;
    const {
        usr_firstname,
        usr_lastname,
        usr_email,
        usr_due_date,
        usr_status,
        usr_role,
        usr_new_pass,
        usr_cnf_pass
    } = pmoi.guest;

    try {
        const current_user = await axios.post(`http://127.0.0.1:8081/api/1.0/workflow/user`, {
            usr_username: openid,
            usr_firstname,
            usr_lastname,
            usr_email,
            usr_due_date,
            usr_status,
            usr_role,
            usr_new_pass,
            usr_cnf_pass,
        });
    } catch (e) {
        console.log(e.response.data)
    }
}

module.exports = {
    wechatOauth
}