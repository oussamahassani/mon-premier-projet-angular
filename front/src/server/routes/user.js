const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const User = require('../models/users')

router.post('/register',  function (req, res, next) {
    var user = new User(req.body);
    user.save(function (err) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Utilisateur créé avec succès" });
        }
    });
});
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.body.password && req.body.password.length < 50) {
        bcrypt.hash(req.body.password, null, null, function (err, hash) {
            if (err) return next(err);
            req.body.password = hash;

            User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) {
                    res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
                } else {
                    res.json({ success: true, msg: "Mise à jour aves succès" });
                }
            });
        });
    }
    else {
        delete req.body.password;
        delete req.body.cpassword;
        User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) {
                res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            } else {
                res.json({ success: true, msg: "Mise à jour aves succès" });
            }
        });
    }
});
router.post('/auth', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }, (err, user) => {
        if (err) console.log(err);
        if (!user) {
            return res.json({ success: false, msg: "Impossible de se connecter, l'email entré ne correspond à aucun compte" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                delete user.password;
                let userToken = new User(user);
                let finalToken = userToken.toJSON()
                delete finalToken.password;
                const token = jwt.sign(finalToken, config.secret, {
                    expiresIn: 199900
                });
                res.json({
                    success: true,
                    token: 'XPRS ' + token
                })
                console.log(res.json)
            }
            else {
                return res.json({ success: false, msg: "Impossible de se connecter, mot de passe incorrect" });
            }
        });


    });
});
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.find(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
router.put('/zone/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    let zone = req.body.zone;
    User.find({
        'zone': zone
    }).exec(function (err, post) {
        if (err) return next(err);
        res.json(post);
    })
});
router.put('/delete/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const userId = req.params.userId;
    const active = req.body.active;
    User.update({ "_id": userId }, { "active": active }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted user successfully", obj: user });
        }
    })
});





module.exports = router;