var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
mongoose.connection.on("connected", function() {
    console.log("Mongoose connected sucess.")
});

mongoose.connection.on("error", function() {
    console.log("Mongoose connected fail.")
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose connected disconnected.")
});
//加载商品列表
router.get("/list", function(req, res, next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param('pageSize'));
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");
    let skip = (page - 1) * pageSize;
    let params = {};
    let priceGt = '',
        priceLte = '';
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLte = 500;
                break;
            case '1':
                priceGt = 500;
                priceLte = 1000;
                break;
            case '2':
                priceGt = 1000;
                priceLte = 10000;
                break;
            case '3':
                priceGt = 10000;
                priceLte = 1000000;
                break;

        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte,
            }
        }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });

    goodsModel.exec(function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

//加入到购物车
router.post("/addCart", function(req, res, next) {
    var userId = '100000077',
        productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({ userId: userId }, function(err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            console.log("userDoc:" + userDoc);
            if (userDoc) {
                var goodsItem = '';
                userDoc.cartList.forEach(function(item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save(function(err2, doc2) {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message,
                                result: ''
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'suc'
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, function(err1, doc) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                console.log(doc);
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save(function(err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        }
    })
});
// var admin = new User({
//     "userId": '100000077',
//     "userName": 'admin',
//     "userPwd": 'admin',
//     "orderList": Array,
//     "cartList": [{
//         "productId": String,
//         "productName": String,
//         "salePrice": String,
//         "productImage": String,
//         "checked": String,
//         "productNum": String
//     }],
//     "addressList": [{
//         "addressId": String,
//         "userName": String,
//         "streetName": String,
//         "postCode": Number,
//         "tel": Number,
//         "isDefault": Boolean
//     }]
// })

// admin.save(function(err, ret) {
//     if (err) {
//         console.log('保存失败~')
//     } else {
//         console.log('保存成功')
//         console.log(ret)
//     }
// })
module.exports = router;