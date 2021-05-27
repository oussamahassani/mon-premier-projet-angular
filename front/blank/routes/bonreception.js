const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Bonreception = require('../models/bonreception');
//Ajouter Bonreception
//num,delievered,enAttente,products_no,total,mode_paiement,command,client,
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var bonreception = new Bonreception();
    bonreception.num = req.body.num
    bonreception.statut = req.body.statut
    bonreception.total_ht = req.body.total_ht
    bonreception.total_tva = req.body.total_tva
    bonreception.command = req.body.command
    bonreception.categorie = req.body.categorie
    bonreception.fournisseur = req.body.fournisseur
    bonreception.creatorId = req.body.creatorId
    bonreception.note = req.body.note
    bonreception.products = req.body.products


    bonreception.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Bon de reception créé avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Bonreception.find().sort('-createdAt').exec(function (err, bonreceptions) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting bon de receptions", obj: bonreceptions });
        }
    });
});

router.get('/last', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Bonreception.find({}).sort({ _id: -1 }).limit(1).exec(function (err, bonreception) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (bonreception === undefined || bonreception.length == 0) {
            name = 0;
        } else {
            name = bonreception[0].num;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let bonreception_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(bonreception_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier bon de reception", obj: name });
        }

    })
})


//Bonreception today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Bonreception.find({ 'createdAt': { $gte: today } }).exec(function (err, bonreceptions) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today Bon de receptions", obj: bonreceptions });
        }
    })
})
//Bonreceptions Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Bonreception.find().count(function (err, count) {
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
    Bonreception.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by users
router.get('/getBonreceptions/:bonIds', function (req, res, next) {
    var ids = req.params.bonIds.toString().split(",");
    console.log(ids)
    Bonreception.find({ _id: { $in: ids } }).exec(function (err, bonreceptions) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            console.log(bonreceptions)
            res.json({ success: true, msg: "Success getting Bon de receptions", obj: bonreceptions });
        }
    });
});
//get by fournisseur
router.get('/fournisseur/:fournisseurId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.fournisseurId;
    Bonreception.find({ "fournisseur": userId }).exec(function (err, bonreceptions) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            //send notification
            res.json({ success: true, msg: "Success getting receptions", obj: bonreceptions });
        }
    });
});
//get by command
router.get('/command/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var commandId = req.params.commandId;
    Bonreception.find({ "command": commandId }).exec(function (err, bonreceptions) {
        if (err) return next(err);
        res.json(bonreceptions);
    });
})

router.put('/recevoir/:bonIds', function (req, res, next) {
    var ids = req.params.bonIds.toString().split(",");
    const facture = req.body;
    Bonreception.updateMany(
        { _id: { $in: ids } },
        {
            $set: {
                facture_id: facture.id,
                updatedAt: Date.now(),
            }
        }, function (err, bonreception) {
            if (err) {
                res.json({ success: false, msg: err });
            } else {
                res.json({ success: true, msg: "Success update Bon de reception", obj: bonreception });
            }

        })
});
router.put('/justifrec/:id', function (req, res, next) {
    var id = req.params.id;
    const body = req.body;
    Bonreception.updateOne(
        { _id: id },
        {
            $set: {
                justif_reception: body.src,
                updatedAt: Date.now(),
            }
        }, function (err, bonreception) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update Bon de reception", obj: bonreception });
            }

        })
});
router.put('/justifac/:id', function (req, res, next) {
    var id = req.params.id;
    const body = req.body;
    Bonreception.updateOne(
        { _id: id },
        {
            $set: {
                justif_facture: body.src,
                updatedAt: Date.now(),
            }
        }, function (err, bonreception) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update Bon de reception", obj: bonreception });
            }

        })
});


//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Bonreception.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Bonreception.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Bonreception supprimée avec succès");
    });

});
//Update Bonreception en attente / expédiée
router.put('/statut/:bonreceptionId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const bonreceptionId = req.params.bonreceptionId;
    const bonreception = req.body;
    Bonreception.update(
        { _id: bonreceptionId },
        {
            $set: {
                statut:bonreception.statut,
                //recu: bonreception.recu,
                //enAttente: bonreception.enAttente,
                date_livraison: Date.now(),
            }
        }, function (err, bonreception) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //send notification
                res.json({ success: true, msg: "Success update statut bon de reception", obj: bonreception });
            }

        })
});

//products_no,mode_paiement


router.put('/delete/:bonId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const bonId = req.params.bonId;
    const active = req.body.active;
    Bonreception.update({ "_id": bonId }, { "active": active }, function (err, bonreception) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted Bon de reception successfully", obj: bonreception });
        }
    })
});


module.exports = router;