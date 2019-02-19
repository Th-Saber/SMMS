var express = require('express');
var router = express.Router();
// 引入连接数据库模块
const connection = require('./connect')
//引入jwt  模块
const jwt = require("jsonwebtoken");
//定义密匙
const secretKey = 'zhaozilong';
// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
  // 设置响应头 解决跨域(目前最主流的方式)
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

//验证登陆
router.post('/logincheck', (req, res) =>{
  let {username,password} = req.body;
  const sqlStr = `select * from account where username='${username}' and password='${password}'`;
  connection.query(sqlStr,(err,data)=>{
    if (err) throw err;
    //console.log(data)
    if(data.length){
      let accountdata = data[0];
      let dataStr = JSON.stringify(accountdata);
      let accountObj =JSON.parse(dataStr);
      //发一个令牌（通行证）  
      // 生成token
      const token = jwt.sign(accountObj, secretKey, {expiresIn: 60 * 60})
      res.send({
        'error_code': 0,
        'reason': '欢迎您!登录成功！',
         token,
         username:accountObj.username
      })
    }else{
      res.send({"error_code":1,"reason":"登陆失败！请检查用户名密码"})
    }
  })
  
});

module.exports = router;
