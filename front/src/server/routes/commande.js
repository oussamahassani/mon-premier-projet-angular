const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Command = require('../models/commande');
//Ajouter commande ,passport.authenticate('jwt', {session: false})
router.post('/ajouter', function (req, res, next) {
    Command.find({}).sort({ _id: -1 }).limit(1).exec(function (err, command) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (command === undefined || command.length == 0) {
            name = 0;
        } else {
            name = command[0].name;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let command_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(command_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        var newcom = new Command();

        newcom.name = name;
        newcom.canceled = req.body.canceled;
        newcom.confirmed = req.body.confirmed;
        newcom.enCours = req.body.enCours;
        newcom.liv=req.body.liv;
        newcom.date_liv = req.body.date_liv;
        newcom.prix_ht = req.body.prix_ht;
        newcom.tva = req.body.tva;
        newcom.products = req.body.products;
        newcom.creatorId = req.body.creatorId;
        newcom.client = req.body.client;
        newcom.save(function (err, data) {
            if (err) {
                res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            } else {
                console.log(data);
                res.json({ success: true, msg: "Commande créé avec succès", obj: data.id });
            }
        });
    })
    /**/
});

//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Command.find().sort('-createdAt').exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting commands", obj: commands });
        }
    });
});
//Command today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Command.find({ 'createdAt': { $gte: today } }).exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today commands", obj: commands });
        }
    })
})
//Commands Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Command.find().count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Get by id
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Command.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by creator
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.userId;
    Command.find({ "creatorId": userId }).exec(function (err, commands) {
        if (err) return next(err);
        res.json(commands);
    });
});
//get by client
router.get('/client/:clientId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var clientId = req.params.clientId;
    Command.find({ "client": clientId }).exec(function (err, commands) {
        if (err) return next(err);
        res.json(commands);
    });
})
//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Command.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Update command status, cancel, confirmed command
router.put('/statut/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const command = req.body;
    Command.updateOne(
        { _id: commandId },
        {
            $set: {
                canceled: command.canceled,
                confirmed: command.confirmed,
                enCours: command.enCours,
                liv:command.liv,
                updatedAt: Date.now(),
            }
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //send notification
                res.json({ success: true, msg: "Success update statut command", obj: command });
            }

        })
});
//Update livraison
router.put('/livrer/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const livraison = req.body;
    Command.updateOne(
        { _id: commandId },
        {
            $set: {
                bon_liv:livraison.id,
                liv:true,
                updatedAt: Date.now(),
            }
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //send notification
                res.json({ success: true, msg: "Success update statut command", obj: command });
            }

        })
});
//Add product to command
router.put('/product/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const product = req.body.product;
    Command.updateOne(
        { _id: commandId },
        {
            $addToSet: {
                products: {
                    product_id: product.product_id,
                    quantite: product.quantite,

                }
            }
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //Notify
                res.json({ success: true, msg: "Success adding product to command", obj: command });
            }

        })
});

//Delete
router.put('/delete/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const canceled = req.body.canceled;
    Command.updateOne({ "_id": commandId }, { "canceled": canceled,
    "confirmed":false,
    "liv":false,
    "enCours":true }, function (err, command) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted command successfully", obj: command });
        }
    })
});

module.exports = router;