const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Livraison = require('../models/livraison');
//Ajouter livraison
//num,delievered,enAttente,products_no,total,mode_paiement,command,client,
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var livraison = new Livraison();
    livraison.num = req.body.num;
    livraison.delievered = req.body.delievered;
    livraison.enAttente = req.body.enAttente;
    livraison.products_no = req.body.products_no;
    livraison.total = req.body.total;
    livraison.command = req.body.command;
    livraison.client = req.body.client;
    livraison.creatorId = req.body.creatorId;
    livraison.note = req.body.note;
    livraison.frais = req.body.frais;
    livraison.date_livraison = req.body.date_livraison;
    livraison.tva = req.body.tva;


    livraison.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Livraison créé avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Livraison.find().sort('-createdAt').exec(function (err, livraisons) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting livraisons", obj: livraisons });
        }
    });
});

router.get('/last', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Livraison.find({}).sort({ _id: -1 }).limit(1).exec(function (err, livraison) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (livraison === undefined || livraison.length == 0) {
            name = 0;
        } else {
            name = livraison[0].num;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let livraison_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(livraison_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Derniére livraison", obj: name });
        }

    })
})


//Livraison today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Livraison.find({ 'createdAt': { $gte: today } }).exec(function (err, livraisons) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today livraisons", obj: livraisons });
        }
    })
})
//Livraisons Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Livraison.find().count(function (err, count) {
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
    Livraison.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get multiple
router.get('/getlivraisons/:livIds', function (req, res, next) {
    var ids = req.params.livIds.toString().split(",");
    Livraison.find({ _id: { $in: ids } }).exec(function (err, livraisons) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting livraison", obj: livraisons });
        }
    });
});
//get by client
router.get('/client/:clientId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.clientId;
    Livraison.find({ "client": userId }).exec(function (err, livraisons) {
        if (err) return next(err);
        res.json(livraisons);
    });
});
//get by command
router.get('/command/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var commandId = req.params.commandId;
    Livraison.find({ "command": commandId }).exec(function (err, livraisons) {
        if (err) return next(err);
        res.json(livraisons);
    });
})
//Facture ajouter livraison
router.put('/payer/:livIds', function (req, res, next) {
    var ids = req.params.livIds.toString().split(",");
    const facture = req.body;
    Livraison.updateMany(
        { _id: { $in: ids } },
        {
            $set: {
                facture_id: facture.id,
                facture: true,
                updatedAt: Date.now(),
            }
        }, function (err, livraison) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update livraison", obj: livraison });
            }

        })
});
router.put('/justifliv/:id', function (req, res, next) {
    var id = req.params.id;
    const body = req.body;
    Livraison.updateOne(
        { _id: id },
        {
            $set: {
                justif_livraison: body.src,
                updatedAt: Date.now(),
            }
        }, function (err, livraison) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update livraison", obj: livraison });
            }

        })
});
/*Update livraison
router.put('/payer/:livId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const livId = req.params.livId;
    
    const facture = req.body;
    Livraison.update(
        { _id: commandId },
        {
            $set: {
                facture_id:facture.id,
                facture:true,
                updatedAt: Date.now(),
            }
        }, function (err, livraison) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update livraison", obj: livraison });
            }

        })
});*/
//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Livraison.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Livraison.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Livraison supprimée avec succès");
    });

});
//Update livraison en attente / expédiée
router.put('/statut/:livraisonId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const livraisonId = req.params.livraisonId;
    const livraison = req.body;
    console.log(req.body);
    Livraison.update(
        { _id: livraisonId },
        {
            $set: {
                delievered: livraison.delievered,
                enAttente: livraison.enAttente,
                updatedAt: Date.now(),
            }
        }, function (err, livraison) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                //send notification
                res.json({ success: true, msg: "Success update statut livraison", obj: livraison });
            }

        })
});

//products_no,mode_paiement

//update products number
router.put('/prod/:livraisonId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var livraisonId = req.params.livraisonId;
    var products_no = req.body.products_no;

    Livraison.update({ '_id': livraisonId }, { $set: { products_no: products_no } }, function (err, livraison) {

        if (err) {
            res.json({ success: false, msg: "Probleme" });
        } else {
            res.json({ success: true, msg: "Livraison mis a jour", obj: livraison });
        }
    });
})
router.put('/delete/:livId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const livId = req.params.livId;
    const active = req.body.active;
    Livraison.update({ "_id": livId }, { "active": active }, function (err, livraison) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted livraison successfully", obj: livraison });
        }
    })
});


module.exports = router;