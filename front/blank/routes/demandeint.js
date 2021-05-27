const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Demandeint = require('../models/demandeint');
//Ajouter demande int
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    /** */
    var demandeint = new Demandeint();
    demandeint.num = req.body.num;
    demandeint.statut = req.body.statut;
    demandeint.creatorId = req.body.creatorId;
    demandeint.note = req.body.note;
    demandeint.categorie = req.body.categorie;
    demandeint.client = req.body.client;
    demandeint.products = req.body.products;
    demandeint.prix_ht = req.body.prix_ht;
    demandeint.tva = req.body.tva;
    demandeint.prix_ttc = req.body.prix_ttc;


    demandeint.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Demande interieur créée avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
   console.log(req.body)
    Demandeint.find().sort('-createdAt').exec(function (err, demandesint) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: "Success getting demandes interieurs", obj: demandesint });
        }
    });
});

router.get('/last', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demandeint.find({}).sort({ _id: -1 }).limit(1).exec(function (err, demandesint) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (demandesint === undefined || demandesint.length == 0) {
            name = 0;
        } else {
            name = demandesint[0].num;
        }
        if (!name || name === 0) {
            name = year + "-" + "0";
        } else {
         console.log(name)
       
            let x = String(name);
            let year_no = x.substr(0, 4)
            let demandeint_no = x.substr(5, x.length);
            if (String(year) === year_no) {
                console.log("found name")
                tmp = Number(demandeint_no) + 1;
                name =   year_no + '-'  +(tmp)
            } else {
                name = year + "-" + "0";
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Derniére demande interieur demandeint", obj: name });
        }

    })
})


//demande today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Demandeint.find({ 'createdAt': { $gte: today } }).exec(function (err, demandesint) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today demandes interieurs", obj: demandesint });
        }
    })
})
//demandes int Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demandeint.find().count(function (err, count) {
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
    Demandeint.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Demandeint.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Demandeint.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("demande interieur supprimée avec succès");
    });

});
//Update demande int en attente / expédiée
router.put('/statut/:demandeintId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const demandeintId = req.params.demandeintId;
    const demandeint = req.body;
    Demandeint.update(
        { _id: demandeintId },
        {
            $set: {
                statut: demandeint.statut,
                confirmedBy: demandeint.confirmedBy,
                updatedAt: Date.now(),
            }
        }, function (err, demandeint) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update statut demande interieur", obj: demandeint });
            }

        })
});
router.put('/delete/:demandeintId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const demandeintId = req.params.demandeintId;
    const active = req.body.active;
    Demandeint.update({ "_id": demandeintId }, { "active": active }, function (err, demandeint) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted demande interieur successfully", obj: demandeint });
        }
    })
});

router.put('/repondre/:demandeintId', function (req, res, next) {
    var id = req.params.demandeintId;
    Demandeint.update(
        { _id: id },
        {
            $set: {
                statut: "Confirmed",
                confirmedBy: demandeint.confirmedBy,
                updatedAt: Date.now()
            }
        }, function (err, bonreception) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update Bon de reception", obj: bonreception });
            }

        })
});
router.get('/recevoir/:demandeintId/:comId', function (req, res, next) {
    var id = req.params.demandeintId;
    var comId=req.params.comdId;
    Demandeint.update(
        { _id: id},
        {
            $set: {
                commandesor:comId,
                updatedAt: Date.now(),
            }
        }, function (err, demandeint) {
            if (err) {
                console.log(err)
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update demande int", obj: demandeint });
            }

        })
});


module.exports = router;