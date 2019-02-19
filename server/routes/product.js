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
router.post('/goodsadd', (req, res) => {
  let { classify, mask, productname, productprice, marketprice, purchaseprice, librarynum, purchaseweight, purchaseunit, discounts, promotion, promotionprice, productmsg } = req.body;

  const sqlStr = `insert into product(classify,mask,productname,productprice,marketprice,purchaseprice,librarynum,purchaseweight,purchaseunit,discounts,promotion,promotionprice,productmsg) values('${classify}','${mask}','${productname}','${productprice}','${marketprice}','${purchaseprice}','${librarynum}','${purchaseweight}','${purchaseunit}','${discounts}','${promotion}','${promotionprice}','${productmsg}')`

  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 判断受影响的行数
    if (data.affectedRows > 0) {
      // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
      res.send({ "error_code": 0, "reason": "插入数据成功" });
    } else {
      // 失败：返回给前端失败的数据对象
      res.send({ "error_code": 1, "reason": "插入数据失败" });
    }
  })
});
//请求商品列表
router.post("/goodslist", (req, res) => {
  let { pageSize, currentPage } = req.body;
  let sqlStr = `select * from product order by ctime desc`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    let total = data.length;
    let n = (currentPage - 1) * pageSize;
    sqlStr += ` limit ${n},${pageSize}`;
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      let dataArr = data.map(v => {
        return params = {
          id: v.id,
          classify: v.classify,
          mask: v.mask,
          productname: v.productname,
          productprice: v.productprice,
          marketprice: v.marketprice,
          librarynum: v.librarynum,
          promotionprice: v.promotionprice,
          libraryPrice: v.marketprice * v.librarynum,
          totalSales: v.productprice * v.librarynum
        }
      })
      res.send({dataArr,total});
    })
  })
})
//删除数据
router.get("/goodsdelete", (req, res) => {
  let { id } = req.query;
  const sqlStr = `delete from product where id = ${id}`
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ "error_code": 0, "reason": "删除数据成功" })
    } else {
      res.send({ "error_code": 1, "reason": "删除数据失败" })
    }
  })
})
//修改数据
router.get("/goodsedit", (req, res) => {
  let { id } = req.query;
  const sqlStr = `select * from product where id = ${id}`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    res.send(data)
  })
})
//保存修改
router.post("/goodseditsave", (req, res) => {
  let {
    editId,
    mask,
    classify,
    productname,
    productprice,
    marketprice,
    librarynum,
    promotionprice } = req.body;
  console.log(
    editId,
    mask,
    classify,
    productname,
    productprice,
    marketprice,
    librarynum,
    promotionprice)
  const sqlStr = `update product set mask='${mask}',promotionprice='${promotionprice}', classify='${classify}', productname='${productname}', productprice='${productprice}', marketprice='${marketprice}', librarynum='${librarynum}' where id=${editId}`;
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ "error_code": 0, "reason": "修改账户成功" })
    } else {
      res.send({ "error_code": 1, "reason": "修改账户失败" })
    }
  })
})
module.exports = router;
