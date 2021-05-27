const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Demande = require('../models/demande');
const excel = require('exceljs');
const fs = require('fs');
const User = require('../models/users')
//Ajouter demande
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var demande = new Demande();
    demande.num = req.body.num;
    demande.statut=req.body.statut;
    demande.creatorId = req.body.creatorId;
    demande.note = req.body.note;
    if(req.body.typedemande)
    demande.typedemande = req.body.typedemande;
    demande.categorie = req.body.categorie;
    demande.products = req.body.products;
    demande.isCommand=req.body.isCommand;


    demande.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Demande créée avec succès", obj: data.id });
        }
    });
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demande.find().sort('-createdAt').exec(function (err, demandes) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting demandes", obj: demandes });
        }
    });
});
router.get('/multiple/:demIds', function (req, res, next) {
    var ids = req.params.demIds.toString().split(",");
    Demande.find({ _id: { $in: ids } }).exec(function (err, demandes) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting demandes", obj: demandes });
        }
    });
});
router.get('/last', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demande.find({}).sort({ _id: -1 }).limit(1).exec(function (err, demandes) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (demandes === undefined || demandes.length == 0) {
            name = 0;
        } else {
            name = demandes[0].num;
        }
        if (!name || name === 0) {
            name =  year + '- 0';
        } else {
            let x = String(name);
            let year_no = x.substr(0, 4)
            let demande_no = x.substr(5, x.length);
            if (String(year) === year_no) {
                tmp = Number(demande_no) + 1;
                name =   year_no + '-' +(tmp) 
            } else {
                name =  year + '- 0' ;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(name)
            res.json({ success: true, msg: "Derniére demande", obj: name });
        }

    })
})


//demande today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Demande.find({ 'createdAt': { $gte: today } }).exec(function (err, demandes) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today demandes", obj: demandes });
        }
    })
})
//demandes Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demande.find().count(function (err, count) {
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
    Demande.findById(req.params.id, function (err, post) {
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
    Demande.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Demande.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("demande supprimée avec succès");
    });

});
//Update demande en attente / expédiée
router.put('/statut/:demandeId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const demandeId = req.params.demandeId;
    const demande = req.body;
    Demande.updateOne(
        { _id: demandeId },
        {
            $set: {
                statut: demande.statut,
                confirmedBy:demande.confirmedBy,
                note:demande.note,
                updatedAt: Date.now(),
            }
        }, function (err, demande) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update statut demande", obj: demande });
            }

        })
});
router.put('/delete/:demandeId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const demandeId = req.params.demandeId;
    const active = req.body.active;
    Demande.updateOne({ "_id": demandeId }, { "active": active }, function (err, demande) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted demande successfully", obj: demande });
        }
    })
});
router.get('/recevoir/:demandeId', function(req, res, next) {
    var id = req.params.demandeId;
    Demande.update(
        { _id : id},
        {
            $set: {
                isCommand:true,
                updatedAt: Date.now(),
            }
        }, function (err, demande) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success update demande", obj: demande });
            }

        })
});





// export demande
router.get('/export/:type', function (req, res, next) {
    var type=req.params.type;
    Demande.find().sort('-createdAt').exec( async function (err, demandes) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('liste des demandes'); //creating worksheet
            for(demande of demandes){
                /*if(demande.enAttente && !demande.canceled){
                    demande.statut = 'En Attente';
                }
                if(demande.confirmed && !demande.done && !demande.commandEnCours){
                    demande.statut = 'Confirmée';
                }
                if(demande.confirmed && demande.commandEnCours && !demande.done){
                    demande.statut = 'Commande en cours';
                }
                if(demande.confirmed && demande.done && !demande.commandEnCours){
                    demande.statut = 'Finis';
                }
                if(demande.canceled){
                    demande.statut = 'Rejeté';
                }*/
                await User.findOne({ _id: demande.creatorId }, {fname : 1, lname: 1, _id: 0}, function (err, user) {
                    if (err) return next(err);
                    demande.creator = user.fname + ' ' + user.lname
                });
            }
            //  WorkSheet Header
            worksheet.columns = [
              { header: 'Numero', key: 'num', width: 10 },
              { header: 'Createur', key: 'creator', width: 30 },
              { header: 'Date de création', key: 'createdAt', width: 20},
              { header: 'Statut', key: 'statut', width: 20},
              { header: 'Note', key: 'note', width: 50, outlineLevel: 1 }
            ];
            // Add Array Rows
            worksheet.addRows(demandes);
            
            // Write to File.
            workbook.xlsx.writeFile("./uploads/liste_des_demandes.xlsx")
              .then(function() {
                const file = './uploads/liste_des_demandes.xlsx';
                //No need for special headers
                res.download(file);
              });
        }
    });
 });


module.exports = router;