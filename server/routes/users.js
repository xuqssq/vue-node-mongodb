var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('./../util/util');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//登录接口
router.post("/login", function(req, res, next) {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }
    User.findOne(param, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            if (doc) {
                res.cookie("userId", doc.userId, {
                    path: '/',
                    maxAge: 5000 * 60 * 60
                });
                res.cookie("userName", doc.userName, {
                    path: '/',
                    maxAge: 5000 * 60 * 60
                });
                // req.session.user = doc;
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        userName: doc.userName
                    }
                })
            }
        }
    });
});

// 退出登录
router.post("/logout", function(req, res, next) {
    res.cookie("userId", "", {
        psth: "/",
        maxAge: -1
    });
    res.json({
        status: "0",
        msg: '',
        result: ''
    })
});

router.get("/checkLogin", function(req, res, next) {
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '',
            result: req.cookies.userName || ''
        });
    } else {
        res.json({
            status: '1',
            msg: '未登录',
            result: ''
        })
    }
});
//购物车数量
router.get("/getCartCount", function(req, res, next) {
    if (req.cookies && req.cookies.userId) {
        var userId = req.cookies.userId;
        User.findOne({ userId: userId }, function(err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                let cartList = doc.cartList;
                let cartCount = 0;
                cartList.map(function(item) {
                    cartCount += parseInt(item.productNum);
                })
                res.json({
                    status: '0',
                    msg: '',
                    result: cartCount
                })
            }
        })
    }
})

//购物车列表
router.get("/cartList", function(req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({ userId }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                });
            }
        }
    })
});

//购物车删除
router.post("/cartDel", function(req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.productId;
    User.update({
        userId: userId
    }, {
        $pull: {
            'cartList': {
                'productId': productId
            }
        }
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.messaage,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            });
        }
    });
});

//控制购物车商品数量
router.post("/cartEdit", function(req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({ "userId": userId, "cartList.productId": productId }, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked,
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.messaage,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            });
        }
    })
});
//处理全选
router.post("/editCheckAll", function(req, res, next) {
    var userId = req.cookies.userId,
        checkAll = req.body.checkAll ? '1' : '0';
    User.findOne({ userId: userId }, function(err, user) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (user) {
                user.cartList.forEach((item) => {
                    item.checked = checkAll;
                })
                user.save(function(err1, doc) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        });
                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: 'suc'
                        });
                    }
                })
            }
        }
    });
});

//查询收货地址列表
router.get("/addressList", function(req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: doc.addressList
            })
        }
    });
});

//设置默认地址
router.post("/setDefault", function(req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (!addressId) {
        res.json({
            status: '1003',
            msg: 'addressId is null',
            result: ''
        });
    } else {
        User.findOne({ userId: userId }, function(err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                });
            } else {
                var addressList = doc.addressList;
                addressList.forEach((item) => {
                    if (item.addressId == addressId) {
                        item.isDefault = true;
                    } else {
                        item.isDefault = false;
                    }
                });

                doc.save(function(err1, doc1) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        });
                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: ''
                        });
                    }
                })
            }
        });
    }
});
// 删除地址
router.post("/delAddress", function(req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    User.update({
        userId: userId
    }, {
        $pull: {
            'addressList': {
                'addressId': addressId
            }
        }
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: ''
            })
        }
    })
})

// 新增收货地址
router.post("/addNewAddress", function(req, res, next) {
    var userId = req.cookies.userId,
        userName = req.body.userName,
        streetName = req.body.streetName,
        postCode = req.body.postCode,
        tel = req.body.tel
    User.findOne({ userId: userId }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {

            (function() {

                addressId = doc.addressList.length + parseInt(Math.random() * 500)
            })()
            var newAdd = {
                addressId: addressId,
                userName: userName,
                streetName: streetName,
                postCode: postCode,
                tel: tel,
                isDefault: false
            }
            if (newAdd.userName != '' || newAdd.streetName != '' || newAdd.postCode != '' || newAdd.tel != '') {
                doc.addressList.push(newAdd)
                doc.save(function(err2, doc2) {
                    if (err2) {
                        res.json({
                            status: '0',
                            msg: err2.message,
                            result: ''
                        })
                    } else {
                        res.json({
                            status: '1',
                            msg: '',
                            result: '添加信息成功'
                        })
                    }
                })
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: '请输入正确信息'
                })
            }

        }
    })
})

//生成订单
router.post("/payMent", function(req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId,
        orderTotal = req.body.orderTotal;
    User.findOne({ userId: userId }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            });
        } else {
            var address = '',
                goodsList = [];
            //获取当前用户的地址信息
            doc.addressList.forEach((item) => {
                    if (addressId == item.addressId) {
                        address = item;
                    }
                })
                //获取用户购物车的购买商品
            doc.cartList.filter((item) => {
                if (item.checked == '1') {
                    goodsList.push(item);
                }
            });

            var platform = '622';
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);

            var sysDate = new Date().Format('yyyyMMddhhmmss');
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
            var orderId = platform + r1 + sysDate + r2;
            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: '1',
                createDate: createDate
            };

            doc.orderList.push(order);

            doc.save(function(err1, doc1) {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: err.message,
                        result: ''
                    });
                } else {
                    res.json({
                        status: "0",
                        msg: '',
                        result: {
                            orderId: order.orderId,
                            orderTotal: order.orderTotal
                        }
                    });
                }
            });
        }
    })
});

// 根据订单id查询订单信息
router.get("/orderDetail", function(req, res, next) {
    var userId = req.cookies.userId,
        orderId = req.param("orderId");
    User.findOne({ userId: userId }, function(err, userInfo) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            var orderList = userInfo.orderList;
            if (orderList.length > 0) {
                var orderTotal = 0
                orderList.forEach((item) => {
                    if (item.orderId == orderId) {
                        orderTotal = item.orderTotal;
                    }
                });
                if (orderTotal > 0) {
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            orderId: orderId,
                            orderTotal: orderTotal
                        }
                    })
                } else {
                    res.json({
                        status: '120002',
                        mag: '无此订单',
                        result: ''
                    })
                }
            } else {
                res.json({
                    status: '120001',
                    mag: '当前用户未创建订单',
                    result: ''
                })
            }
        }
    })
})
module.exports = router;