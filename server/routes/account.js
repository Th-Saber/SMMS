var express = require('express');
var router = express.Router();
// 引入连接数据库模块
const connection = require('./connect')
// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
  // 设置响应头 解决跨域(目前最主流的方式)
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

//分配路由
//添加账户
router.post('/accountadd', (req, res) =>{
  let{username,password,usergroup} = req.body;
  const sqlStr = `insert into account(username,password,usergroup) values('${username}','${password}','${usergroup}')`
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    // 判断受影响的行数
    if (data.affectedRows > 0) {  
      // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
      res.send({"error_code": 0, "reason":"插入数据成功"});
    } else {
      // 失败：返回给前端失败的数据对象
      res.send({"error_code": 1, "reason":"插入数据失败"});
    }
  })
});
//账户管理
router.post("/accountmanage",(req,res)=>{
  let {pageSize,currentPage} = req.body;
  let sqlStr = `select * from account order by ctime desc`;
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    let total = data.length;
    let n = (currentPage-1)*pageSize;
    sqlStr +=` limit ${n},${pageSize}`;
    connection.query(sqlStr,(err,data)=>{
      if(err) throw err;
      res.send({data,total});
    })
    
  })
  
})
//账户删除
router.get("/accountdelete",(req,res)=>{
  let {id} = req.query;
  const sqlStr = `delete from account where id = ${id}`
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.affectedRows>0){
      res.send({"error_code":0,"reason":"删除数据成功"})
    }else{
      res.send({"error_code":1,"reason":"删除数据失败"})
    }
  })
})
//批量删除
router.get("/accountbatchDelete",(req,res)=>{
  let{selectedId} = req.query;
  // 构造sql语句
  const sqlStr = `delete from account where id in (${selectedId})`;
  connection.query(sqlStr,(err,data)=>{
    if(data.affectedRows>0){
      res.send({"error_code":0,"reason":"批量删除数据成功"})
    }else{
      res.send({"error_code":1,"reason":"批量删除数据失败"})
    }
  })
})
//账户修改
router.get("/accountedit",(req,res)=>{
  let {id} = req.query;
  const sqlStr = `select * from account where id = ${id}`;
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    res.send(data)
  })
})
// 账户修改保存
router.post("/accounteditsave",(req,res)=>{
   let{ username,usergroup,editId }=req.body;
   console.log(username,usergroup,editId)
   const sqlStr = `update account set username='${username}', usergroup='${usergroup}' where id=${editId}`;
   connection.query(sqlStr,(err,data)=>{
     if(err) throw err;
     if(data.affectedRows>0){
      res.send({"error_code":0,"reason":"修改账户成功"})
     }else{
      res.send({"error_code":1,"reason":"修改账户失败"})
     }
   })
})
//验证旧密码
router.get("/checkOldPwd",(req,res)=>{
  let{ oldpwd,username }=req.query;
  //console.log(oldpwd,username)
  const sqlStr = `select * from account where username='${username}' and password='${oldpwd}'`
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    console.log(data[0]);
    if(data.length){
      res.send({"error_code":0,"reason":"原密码输入正确"})
    }else{
      res.send({"error_code":1,"reason":"原密码错误！请重新输入"})
    }

  })
})
router.post("/savenewpwd",(req,res)=>{
  let{oldpwd,newpwd,username}=req.body;
  console.log(oldpwd,newpwd,username);
  const sqlStr = `update account set password='${newpwd}' where username='${username}' and password='${oldpwd}'`;
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.affectedRows>0){
      res.send({error_code:0,reason:"密码修改成功,请重新登陆！"})
    }else{
      res.send({error_code:1,reason:"密码修改失败"})
    }
  })
})

module.exports = router;
