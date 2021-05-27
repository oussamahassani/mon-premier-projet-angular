const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TypeMat = require('../models/typeMat');
const passport = require('passport');

//Add typeMat
router.post('/create', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var typeMat = new TypeMat(req.body);
    typeMat.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            console.log(err);
        } else {
            console.log(data);
            res.json({ success: true, msg: "Famille créé avec succès", obj: data.id });
        }
    });
});

//Get 20 typeMats
router.get('/bycat/:category', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    TypeMat.find({category:req.params.category}).sort('-createdAt').exec(function (err, typeMats) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting typeMats", obj: typeMats });
        }
    });
});

router.get('/name/:category/:search', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var search = req.params.search;

    TypeMat.find({ name: { $regex: search, $options: 'i' }, category:req.params.category }).exec(function (err, typeMats) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting typeMats", obj: typeMats });
        }
    });

})

router.get('/active/:category', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    TypeMat.find({ active: true, category:req.params.category }).exec(function (err, typeMats) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting typeMats", obj: typeMats });
        }
    });

})

router.get('/allactive', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    TypeMat.find({ active: true}).exec(function (err, typeMats) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting typeMats", obj: typeMats });
        }
    });

})


//Update typeMat
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: "l'Id est invalid: " + req.params.id
        });
    }
    TypeMat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Le type de matiére à été modifier", obj: post });
        }
    });
});

//Get typeMat by id
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    TypeMat.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


router.put('/delete/:prodId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const prodId = req.params.prodId;
    const active = req.body.active;
    TypeMat.update({ "_id": prodId }, { "active": active }, function (err, typeMat) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted typeMat successfully", obj: typeMat });
        }
    })
});

module.exports = router;