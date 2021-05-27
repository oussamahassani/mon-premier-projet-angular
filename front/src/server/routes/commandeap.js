const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Commandap = require('../models/commandeap');
const Demande = require('../models/demande');
const Fournisseur=require('../models/fournisseur')
const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;
const multer = require('multer');
const excel = require('exceljs');
var path = require('path');
const fields = ['name', 'enCours', 'confirmed', 'canceled', 'active', 'recu', 'prix_ht', 'tva', 'creatorId', 'fournisseur', 'createdAt'];

router.post('/ajouter', function (req, res, next) {

    var newcom = new Commandap();
    newcom.num = req.body.num;
    newcom.statut = req.body.statut;
    newcom.total_ht = req.body.total_ht
    newcom.total_tva = req.body.total_tva
    newcom.creatorId = req.body.creatorId;
    newcom.fournisseur = req.body.fournisseur;
    newcom.categorie = req.body.categorie;
    newcom.products = req.body.products;
    newcom.demand=req.body.demand;
    newcom.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Commande créé avec succès", obj: data.id });
        }
    });
});

//ajouter commandes
router.put('/add-multiple', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var commands = req.body;
    Commandap.insertMany(commands, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting commands", obj: result });
        }
    })

})
//Export CSV
router.get('/export/:type', function (req, res, next) {
    var type = req.params.type;
    Commandap.find().sort('-createdAt').exec( async function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('liste des bons de commande'); //creating worksheet
            for(command of commands)
            {
                await Demande.findOne({ _id: command.demande}, {num : 1, _id: 0}, async function (err, demande) {
                    if (err) return next(err);
                  await Fournisseur.findOne({_id: command.fournisseur}, {name : 1, _id: 0}, function(err,fournisseur){
                      if(err) return next(err);
                      command.fournisseur_name = fournisseur.name;

                  })  
                   command.demande_name = demande.num;
                });
                
            }
            //  WorkSheet Header
            worksheet.columns = [
                { header: 'Numero', key: 'num', width: 10 },
                { header: 'Total HT', key: 'total_ht', width: 30 },
                { header: 'Total TVA', key: 'total_tva', width: 30 },
                { header: 'Demande', key: 'demande_name', width: 10 },
                {header: 'Fournisseur', key:'fournisseur_name',width:20},
                { header: 'Statut', key: 'statut', width: 10 },
                { header: 'Note', key: 'note', width: 50, outlineLevel: 1 }
            ];

            // Add Array Rows
            worksheet.addRows(commands);

            // Write to File.
            workbook.xlsx.writeFile("./uploads/liste_des_commandes.xlsx")
                .then(function () {
                    const file = './uploads/liste_des_commandes.xlsx';
                    //No need for special headers
                    res.download(file);
                });
        }
    });
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Commandap.find().sort('-createdAt').exec(function (err, commands) {
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
    Commandap.find({ 'createdAt': { $gte: today } }).exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today commands", obj: commands });
        }
    })
})
//Commands Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Commandap.find().count(function (err, count) {
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
    Commandap.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by creator
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.userId;
    Commandap.find({ "creatorId": userId }).exec(function (err, commands) {
        if (err) return next(err);
        res.json(commands);
    });
});
//get by fournisseur
router.get('/fournisseur/:fournisseurId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var fournisseurId = req.params.fournisseurId;
    Commandap.find({ "fournisseur": fournisseurId }).exec(function (err, commands) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            //send notification
            res.json({ success: true, msg: "Success getting commands", obj: commands });
        }
    });
})
//get by reception
router.get('/reception/:recId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var recId = req.params.recId;
    if (!mongoose.Types.ObjectId.isValid(req.params.recId)) {
        return res.status(400).send({
            success: false, msg: 'Id is invalid ' + req.params.recId
        });
    }
    var objectId = mongoose.Types.ObjectId(recId);
    Commandap.findOne({bonreception: objectId }).exec(function (err, command) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            //send notification
            res.json({ success: true, msg: "Success getting command", obj: command });
        }
    });
})
//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Commandap.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Update command status, cancel, confirmed command
router.put('/statut/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const command = req.body;
    if (command.statut === "Canceled") {
        Commandap.update(
            { _id: commandId },
            {
                $set: {
                    statut: command.statut,
                    note: command.note,
                    updatedAt: Date.now()
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
    } else {
        Commandap.update(
            { _id: commandId },
            {
                $set: {
                    statut: command.statut,
                    updatedAt: Date.now()
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
    }


});
//Update bon achaat
router.put('/recevoir/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const bonreception = req.body;
    Commandap.update(
        { _id: commandId },
        {
            $set: {
                bonreception: bonreception.id,
                statut:'Confirmed',
                updatedAt: Date.now(),
            }
        }, function (err, command) {
            if (err) {
                console.dir(err);
                res.json({ success: false, msg: err });
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
    Commandap.update(
        { _id: commandId },
        {
            $addToSet: {
                products: {
                    id_produit: product.id_produit,
                    type_produit: product.type_produit,
                    asked_quantite: product.asked_quantite,
                    prix_ht: product.prix_ht,
                    updatedAt: Date.now()

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
router.put('/cancel/:commandId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const commandId = req.params.commandId;
    const statut = req.body.statut;
    Commandap.update(
        { "_id": commandId },
        {
           $set:{
               statut:statut
           }            
        }, function (err, command) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Command canceled succesfully", obj: command });
            }
        })
});

router.get('/last', function (req, res, next) {
    Commandap.find({}).sort({ _id: -1 }).limit(1).exec(function (err, command) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (command === undefined || command.length == 0) {
            name = 0;
        } else {
            name = command[0].num;
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
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Derniére facture", obj: name });
        }

    })
})
//get multiple
router.get('/getcommands/:comIds', function (req, res, next) {
    var ids = req.params.comIds.toString().split(",");
    Commandap.find({ _id: { $in: ids } }).exec(function (err, commands) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting commands", obj: commands });
        }
    });
});

module.exports = router;