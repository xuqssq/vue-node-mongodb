var mongoose = require('mongoose')
var userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productId": String,
        "productName": String,
        "salePrice": String,
        "productImage": String,
        "checked": String,
        "productNum": String
    }],
    "addressList": [{
        "addressId": {
            type: Number,
        },
        "userName": String,
        "streetName": String,
        "postCode": Number,
        "tel": String,
        "isDefault": Boolean
    }]
});
module.exports = mongoose.model('User', userSchema);