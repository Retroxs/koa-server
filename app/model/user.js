const db = require('../config/db'); 
const userModel = '../schema/user';
const User = db.import(userModel);

async function getUserByOpenid(openid) { // 注意是async function 而不是function。对于需要等待promise结果的函数都需要async await。
    let user= await User.findOne({
        where :{
            openid:openid
        }
    }); // 用await控制异步操作，将返回的Promise对象里的数据返回出来。也就实现了“同步”的写法获取异步IO操作的数据
    return user;
};

async function createUser(openid) {
    await User.create({
        openid,
        username:openid,
        password:openid
    });
    return true
}

module.exports = {
    getUserByOpenid,
    createUser
}

