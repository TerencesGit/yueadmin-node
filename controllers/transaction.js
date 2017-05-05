const Partner = require('../models/partner')
const User = require('../models/user')
const Role = require('../models/role')
const Organize = require('../models/organize')
const Notice = require('../models/notice')
const Brand = require('../models/brand')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

//交易平台 订单
exports.home = function(req, res){
	res.render('transaction/order_manage', {title: '订单列表'})
}
// 商品列表
exports.getWareList = function(req, res) {
	const wareList = [{
        ware_code: '10000000000001',
        ware_name: '普吉岛',
        provider_id: '上海巴黎',
        create_time: '2017-06-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '已通过'
      }, {
        ware_code: '02',
        ware_name: '马尔代夫',
        provider_id: '上海巴黎',
        create_time: '2017-04-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '待审核'
      }, {
        ware_code: '03',
        ware_name: '巴厘岛',
        provider_id: '上海巴黎',
        create_time: '2017-05-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '已通过'
      }, {
        ware_code: '04',
        ware_name: '三亚旅拍',
        provider_id: '上海巴黎',
        create_time: '2017-05-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '已通过'
      }, {
        ware_code: '05',
        ware_name: '三亚旅拍',
        provider_id: '上海巴黎',
        create_time: '2017-05-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '已通过'
      }, {
        ware_code: '06',
        ware_name: '三亚旅拍',
        provider_id: '上海巴黎',
        create_time: '2017-12-02',
        ware_kind: '独立类型',
        suggested_price: '58800.00',
        key_words: '三亚,旅拍',
        status: '上架',
        verify_status: '已通过'
    }]
    setTimeout(() => {
      res.json({wareList: wareList})
    }, 1000)
}
// 商品添加
exports.addWare = function(req, res) {
	console.log(req.body)
    setTimeout(() => {
      res.json({status: 2})
    }, 1000)
}
// 商品详情
exports.wareDetail = function(req, res) {
    console.log(req.query)
    const ware = {
        ware_code: '10000000000001',
        name: '普吉岛旅拍',
        provider: '上海巴黎',
        kind: '独立类型',
        price: '10,000,00',
        days: '2',
        keyWords: '三亚,旅拍',
        parent: '',
        status: '上架',
        date1: '2017-06-02',
        city: '',
        settle: '自动结算',
        channel: 'web渠道',
        minute: '1',
        desc: '三亚旅拍'

    }
    setTimeout(() => {
      res.json({ware: ware})
    }, 1000)
}
exports.imageUpload = function(req, res) {
    console.log('imageUpload')
    console.log(req.session)
    console.log(req.files)
    // const fileData = req.files.brandLogo
    // if(fileData && fileData.originalFilename){
    //     let filePath = fileData.path;
    //     fs.readFile(filePath, function(err, data){
    //         let timestamp = Date.now();
    //         let type = fileData.name.split('.')[1];
    //         let brand_logo = 'brand_' + timestamp + '.' +type;
    //         let newPath = path.join(__dirname, '../', 'public/upload/brand/' + brand_logo);
    //         let logoUrl = 'http://localhost:3000/upload/brand/'+brand_logo;
    //         fs.writeFile(newPath, data, function(err){
    //             if(err) console.log(err)
    //             setTimeout(() => {
    //               res.json({status: 2, logoUrl: logoUrl})
    //             }, 1000)
    //         })
    //     })
    // }
    // return res.json({})
}
//品牌logo上传
exports.brandUpload = function(req, res) {
    console.log(req.files)
    console.log(req.files.brandLogo)
    const fileData = req.files.brandLogo
    if(fileData && fileData.originalFilename){
        let filePath = fileData.path;
        fs.readFile(filePath, function(err, data){
            let timestamp = Date.now();
            let type = fileData.name.split('.')[1];
            let brand_logo = 'brand_' + timestamp + '.' +type;
            let newPath = path.join(__dirname, '../', 'public/upload/brand/' + brand_logo);
            let logoUrl = 'http://localhost:3000/upload/brand/'+brand_logo;
            fs.writeFile(newPath, data, function(err){
                if(err) console.log(err)
                setTimeout(() => {
                  res.json({status: 2, logoUrl: logoUrl})
                }, 1000)
            })
        })
    } else {
      res.json({ok: true, data: 'http://localhost:3000/upload/brand/brand_1493706574428.jpg'})
    }
}
// 添加品牌
exports.addBrand = function(req, res) {
    console.log(req.body)
    const brand = req.body
    if (typeof brand === 'object') {
        const _brand = new Brand(brand)
        _brand.save(function(err, brand){
            console.log(brand)
            if(err) console.log(err)
             setTimeout(() => {
              res.json({status: 1})
            }, 1000)
        })
    }else {
        res.json({status: 0})
    }
}
// 保存品牌
exports.saveBrand = function(req, res) {
    const brandObj = req.body,
          brandId = brandObj.brandId;
    var _brand;
    if (brandId) {
        Brand.findById(brandId, function(err, brand){
            _brand = _.extend(brand, brandObj)
            _brand.save(function(err, brand){
                if(err) {
                    console.log(err)
                    setTimeout(() => {
                      res.json({status: 1, message: '编辑失败'})
                    }, 1000)
                } else {
                    setTimeout(() => {
                      res.json({status: 1, message: '编辑成功'})
                    }, 1000)
                }
            })
        })
    } else {
        _brand = new Brand(brandObj)
        _brand.save(function(err, brand){
            if(err) {
                console.log(err)
                setTimeout(() => {
                  res.json({status: 1, message: '添加失败'})
                }, 1000)
            } else {
                setTimeout(() => {
                  res.json({status: 1, message: '添加成功'})
                }, 1000)
            }
        })
    }
}
// 品牌列表
exports.brandManage = function(req, res) {
    var brandList = [], 
        brandObj = {};
    Brand.fetch(function(err, brands){
        if(err) {
          console.log(err)
        } else {
          setTimeout(function(){
            brands.forEach(function(brand) {
                brand.brandId = brand._id
            })
            console.log(brands)
            res.json({brands: brands})
          }, 1000)
        }
    })
}
// 品牌删除
exports.brandDel = function(req, res) {
    console.log(req.query.id)
    const brandId = req.query.id
    if(brandId) {
        Brand.remove({_id: brandId}, function(err, msg){
          setTimeout(function(){
            res.json({status: 1, message: '删除成功'})
          }, 1000)
        })
    }
}
// 品牌详情
exports.brandDetail = function(req, res) {
    let id = req.query.id;
    if(id) {
        Brand.findById(id, function(err, brand){
            if (err) {
                console.log(err)
                setTimeout(function() {
                    res.json({status: 0, message: '获取失败'})
                }, 1000)
            } else {
                brand.brandId = brand._id
                console.log(brand)
                setTimeout(function() {
                    res.json({status: 1, message: '获取成功', brand: brand})
                }, 1000)
            }
        })
    }
}