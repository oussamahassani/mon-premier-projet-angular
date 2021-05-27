const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const passport = require('passport');

//Add Product
router.post('/ajouter', function (req, res, next) {

    var product = new Product();
    product.code = req.body.code;
    product.name = req.body.name;
    product.image = req.body.image;
    product.prix = req.body.prix;
    product.tva = req.body.tva;
    product.promo = req.body.promo;
    product.remise = req.body.remise;
    product.creatorId = req.body.creatorId;

    product.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            console.log(err);
        } else {
            console.log(data);
            res.json({ success: true, msg: "Produit créé avec succès", obj: data.id });
        }
    });
});
//Get 20 products
router.get('/', function (req, res, next) {
    Product.find().sort('-createdAt').limit(4).exec(function (err, products) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting products", obj: products });
        }
    });
});

router.get('/name/:search', function (req, res, next) {
    var search = req.params.search;

    Product.find({ name: { $regex: search, $options: 'i' } }).exec(function (err, products) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting products", obj: products });
        }
    });

})
router.get('/code/:search', function (req, res, next) {
    var search = req.params.search;
    Product.find({ code: { $regex: search, $options: 'i' } }).exec(function (err, products) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting products", obj: products });
        }
    });
})





//Get products nbr
router.get('/nbr', function (req, res, next) {
    Product.find({ active: true }).count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Update product
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success updating product", obj: post });
        }
    });
});

//Get product by id
router.get('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Product.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Delete
router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Product.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Trip supprimé avec succès");
    });

});
router.put('/delete/:prodId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const prodId = req.params.prodId;
    const active = req.body.active;
    Product.update({ "_id": prodId }, { "active": active }, function (err, product) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted product successfully", obj: product });
        }
    })
});

//Update product quantité
router.put('/qte/:productId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const productId = req.params.productId;
    const stock = req.body.stock;
    Product.update({ "_id": productId }, {
        $set: {
            "stock": stock
        }
    }, function (err, product) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success updating product qte number", obj: product });
        }
    })
});


module.exports = router;