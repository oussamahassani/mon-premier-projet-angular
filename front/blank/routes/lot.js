const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Lot = require('../models/lot');
const Reception = require('../models/bonreception')
//Ajouter lot
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var lot = new Lot();
    lot.code = req.body.code;
    lot.creatorId = req.body.creatorId
    lot.quantite = req.body.quantite
    lot.quantite_originale=req.body.quantite_originale
    lot.ht_unitaire = req.body.ht_unitaire
    lot.note = req.body.note
    lot.id_produit = req.body.id_produit
    lot.type_produit = req.body.type_produit
    lot.reception = req.body.reception
    lot.fournisseur = req.body.fournisseur
    lot.isExpire = req.body.isExpire
    lot.is_comfirmed = req.body.is_comfirmed
    lot.is_deranger = req.body.is_deranger

    if (lot.isExpire) {
        lot.date_expiration = req.body.date_expiration;
    }
    lot.save(function (err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Lot crée avec succées", obj: data.id });
        }
    });
});
//Ajouter plusieurs lots
router.put('/add-multiple', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var lots = req.body;
    Lot.insertMany(lots, function (err, result) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: err.errmsg });
        } else {
            res.json({ success: true, msg: "Ajout de lots ", obj: result });
        }
    })

})
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Lot.find().sort('-createdAt').exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting lot", obj: lots });
        }
    });
});
/*router.put('/multiple/:prodIds',passport.authenticate('jwt',{session:false}), function(req, res, next){
     let to_lots=req.body;
     var ids = req.params.prodIds.toString().split(",");
     if(lots && lots.length>0)
     {
        Lot.find({ id_produit: { $in: ids } }).sort({"_id":-1}).limit(lots.length).exec(function(err,res){
            if(err)
            {
                res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            }else{
               for(let lot of to_lots)
               {
                   let x=lots.filter(x=>x.id_produit===lot.id_produit);
                   if(x && x.length==1)
                   {

                   }
               }
            }
         })
     }
     
     Lot.aggregate(
        [
            { $match : { id_produit : { "$in" : ids} } },
            { $group: { "_id" : "$id_produit", createdAt: { $last: "$date" } } }
        ],
        function(err,result) {
    
        }
    );
     for(let lot of lots)
     {
         //get lot by type and id
     }
})
//plusieurs lots, id_produit, type de produit
router.get('/last/:prodId/:type',passport.authenticate('jwt',{session:false}), function(req, res, next){
    let id=req.params.prodId;
    let type=req.params.type
    Lot.find({id_produit:id,type_produit:type}).sort({ _id: -1 }).limit(1).exec(function (err, lots) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (lots === undefined || lots.length == 0) {
            name = 0;
        } else {
            name = lots[0].num;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let inventaire_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(inventaire_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier inventaire", obj: name });
        }
        
    })
})*/


//lots today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Lot.find({ 'createdAt': { $gte: today } }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today lots", obj: lots });
        }
    })
})
//inventaires Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Lot.find().count(function (err, count) {
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
    Lot.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by ids
router.get('/getLots/:lotIds', function (req, res, next) {
    var ids = req.params.lotIds.toString().split(",");
    Lot.find({ _id: { $in: ids } }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting lots", obj: lots });
        }
    });
});
//verify codes
router.get('/verifycodes/:codes', function (req, res, next) {
    var codes = req.params.codes.toString().split(",");
    Lot.find({ code: { $in: codes } }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            if (lots && lots.length > 0) {
                res.json({ success: true, msg: "Les codes fournis existent déjà", obj: true });
            } else {
                Reception.find({ "products.lots": { $elemMatch: { code: { $in: codes } } } }).exec(function (err, receptions) {
                    if (err) {
                        res.json({ success: false, msg: "Error" });
                    } else {
                        if (receptions && receptions.length > 0) {
                            res.json({ success: true, msg: "Les codes fournis existent déjà", obj: true });
                        } else {
                            res.json({ success: true, msg: "Les codes fournis n'existent pas", obj: false });
                        }
                    }
                })
            }
        }
    });
});
//verifycodes-recu
router.get('/verifycodes-recu/:codes', function (req, res, next) {
    var codes = req.params.codes.toString().split(",");
    Lot.find({ code: { $in: codes } }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            if (lots && lots.length > 0) {
                res.json({ success: true, msg: "Les codes fournis existent déjà", obj: true });
            } else {
                res.json({ success: true, msg: "Les codes fournis n'existent pas", obj: false });
            }
        }
    });
  });
router.put('/update-multiple/:lotIds', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var ids = req.params.lotIds.toString().split(",");
    var stocks = req.body;
    Lot.find({ _id: { $in: ids } }).exec(function (err, lots) {
        if (err) return next(err);
        for (let lot of lots) {
            let qte = stocks.filter(x => x.id_lot === String(lot._id))[0].stock_reel;
            lot.quantite = qte;
        }
        Lot.collection.bulkWrite(
            lots.map((lot) => {
                return {
                    updateOne: {
                        filter: { _id: lot._id },
                        update: {
                            $set: {
                                quantite: lot.quantite
                            }
                        },
                        upsert: true
                    }
                }
            }), {}, (err, result) => {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: "Error" });
                } else {
                    res.json({ success: true, msg: "Lots updated successfully", obj: result });
                }
            })
    })
})
//getLotsByMatiere
router.get('/getLotsByMultipleProd/:ids', function (req, res, next) {
    var ids = req.params.ids.toString().split(",");
    Lot.find({ id_produit: { $in: ids } }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Lots recupérer avec succées", obj: lots });
        }
    });
});


//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Lot.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Lot.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("inventaire supprimée avec succès");
    });

});


//products_no,mode_paiement
router.put('/delete/:lotId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const lotId = req.params.lotId;
    const active = req.body.active;
    Lot.update({ "_id": lotId }, { "active": active }, function (err, lot) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted lot successfully", obj: lot });
        }
    })
});
router.get('/getLotsByProd/:prodId', function (req, res, next) {
    //var ids = req.params.prodIds.toString().split(",");
    var id = req.params.prodId;
    Lot.find({ id_produit: id }).exec(function (err, lots) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting lots", obj: lots });
        }
    });
});


module.exports = router;