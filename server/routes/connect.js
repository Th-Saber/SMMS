// 引入mysql
const mysql = require("mysql");
//创建连接对象
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"smms"
  })
// 执行连接方法 
connection.connect(() => {
    console.log('数据库连接成功!')
})

// 把连接对象暴露出去
module.exports = connection;  