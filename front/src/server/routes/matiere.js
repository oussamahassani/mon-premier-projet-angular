const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Matiere = require('../models/matiere');
const NotifStock = require('../models/notif_stock');
const multer = require('multer');
const excel = require('exceljs');
const fs = require('fs');
const passport = require('passport');

//Add matiere
router.post('/ajouter', function (req, res, next) {

    var matiere = new Matiere();
    matiere.reference = req.body.reference;
    matiere.designation = req.body.designation;
    matiere.image = req.body.image;
    matiere.stock = req.body.stock;
    matiere.stock_reel = req.body.stock_reel;
    matiere.stock_securite = req.body.stock_securite;
    matiere.stock_max = req.body.stock_max;
    matiere.categorie = req.body.categorie;
    matiere.famille=req.body.famille;
    matiere.creatorId = req.body.creatorId;
    matiere.isExpDate = req.body.isExpDate;
    matiere.mesure_securite = req.body.mesure_securite;
    matiere.norme_qualite = req.body.norme_qualite;
    matiere.demandeEnCours = req.body.demandeEnCours;
    matiere.fournisseurs = req.body.fournisseurs;
    matiere.tva = req.body.tva;
    matiere.prix_achat = req.body.prix_achat;
    matiere.cmp = req.body.prix_achat;
    matiere.nature_stock = req.body.nature_stock;
    matiere.prix_initial=req.body.prix_achat;
   matiere.fodec= req.body.fodec 
     matiere.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            console.log(err);
        } else {
            res.json({ success: true, msg: "Matiere créé avec succès", obj: data.id });
        }
    });
});
//Get 20 matieres
router.get('/', function (req, res, next) {
    Matiere.find().sort('-createdAt').exec(function (err, matieres) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting matieres", obj: matieres });
        }
    });
});
router.put('/updatemultiple' , function(req , res , next) {
   
       console.log( req.body.demande.fournisseurs,req.body.demande._id)
    Matiere.findByIdAndUpdate(req.body.demande._id, {fournisseurs :req.body.demande.fournisseurs} , function (err, matieres) {
    
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success  update matieres", obj: matieres });
        }
})

})
router.get('/label/:search', function (req, res, next) {
    var search = req.params.search;

    Matiere.find({ designation: { $regex: search, $options: 'i' } }).exec(function (err, matieres) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting matieres", obj: matieres });
        }
    });

})
router.get('/reference/:search', function (req, res, next) {
    var search = req.params.search;
    Matiere.find({ reference: { $regex: search, $options: 'i' } }).exec(function (err, matieres) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting matieres", obj: matieres });
        }
    });
})


router.put('/commander/:matiereIds', function (req, res, next) {
    var ids = req.params.matiereIds.toString().split(",");
    Matiere.updateMany(
        { _id: { $in: ids } },
        {
            $set: {
                demandeEnCours: true,
                updatedAt: Date.now(),
            }
        }, function (err, matiere) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Matiére mise a jour avec succées", obj: matiere });
            }

        })
});


//Get matieres nbr
router.get('/nbr', function (req, res, next) {
    Matiere.find({ active: true }).count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Update matiere
router.put('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Matiere.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success updating matiere", obj: post });
        }
    });
});

//Get matiere by id
router.get('/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Matiere.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



router.put('/update-quantite/:matIds', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var ids = req.params.matIds.toString().split(",");
    var stocks = req.body;
    Matiere.find({ _id: { $in: ids } }).exec(function (err, matieres) {
        if (err) return next(err);
        for (let matiere of matieres) {
            let mat = stocks.filter(x => x.matiere_id === String(matiere._id))[0];
            let qte = mat.quantite;
            console.log('mat ::');
            console.log(mat);
            matiere.cmp = ((matiere.stock * matiere.prix_achat) + (qte * mat.prix_ht)) / (matiere.stock + qte) ;
            matiere.stock = matiere.stock + qte;
            matiere.stock_reel = matiere.stock;
        }
        Matiere.collection.bulkWrite(
            matieres.map((matiere) => {
                return {
                    updateOne: {
                        filter: { _id: matiere._id },
                        update: {
                            $set: {
                                cmp : matiere.cmp,
                                stock: matiere.stock,
                                stock_reel: matiere.stock_reel
                            }
                        },
                        upsert: true
                    }
                }
            }), {}, (err, result) => {
                if (err) {
                    res.json({ success: false, msg: "Error" });
                } else {
                    res.json({ success: true, msg: "Matiere updated successfully", obj: result });
                }
            })
    })
})
//update reception cmp
//update with cmp
router.put('/update-quantite-reception/:matIds', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var ids = req.params.matIds.toString().split(",");
    var stocks = req.body;
    Matiere.find({ _id: { $in: ids } }).exec(function (err, matieres) {
        if (err) return next(err);
        for (let matiere of matieres) {
            let qte = stocks.filter(x => x.matiere_id === String(matiere._id))[0].quantite;
            let prix_cmp=stocks.filter(x=>x.matiere_id===String(matiere._id))[0].prix_achat
            matiere.stock = matiere.stock + qte;
            matiere.stock_reel = matiere.stock;
            matiere.prix_achat=prix_cmp
        }
        Matiere.collection.bulkWrite(
            matieres.map((matiere) => {
                return {
                    updateOne: {
                        filter: { _id: matiere._id },
                        update: {
                            $set: {
                                stock: matiere.stock,
                                stock_reel: matiere.stock_reel,
                                prix_achat:matiere.prix_achat
                            }
                        },
                        upsert: true
                    }
                }
            }), {}, (err, result) => {
                if (err) {
                    res.json({ success: false, msg: err });
                } else {
                    res.json({ success: true, msg: "Matiere updated successfully", obj: result });
                }
            })
    })
})
//update stock reel
router.put('/update-multiple/:matIds', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var ids = req.params.matIds.toString().split(",");
    var stocks = req.body;
    console.log(stocks)
    Matiere.find({ _id: { $in: ids } }).exec(function (err, matieres) {
        if (err) return next(err);
        var NotifStockids = [];
        for (let matiere of matieres) {
            let qte = stocks.filter(x => x.id_produit === String(matiere._id))[0].stock_reel;
            matiere.stock = qte;
            matiere.stock_reel = qte;
            if (matiere.stock <= matiere.stock_securite) {
                NotifStockids.push({
                    id_produit: matiere._id,
                    type_produit: matiere.categorie
                });
            }
        }
        if (NotifStockids.length) {
            var notifStock = new NotifStock;
            notifStock.prod_ids = NotifStockids;
            notifStock.save(function (err, data) {
                if (err) {
                    res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
                    console.log(err);
                }
                req.app.io.emit('stockmin', 'notif for you !');
            });
        }
        Matiere.collection.bulkWrite(
            matieres.map((matiere) => {
                return {
                    updateOne: {
                        filter: { _id: matiere._id },
                        update: {
                            $set: {
                                stock: matiere.stock,
                                stock_reel: matiere.stock_reel
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
                    res.json({ success: true, msg: "Matiere updated successfully", obj: result });
                }
            })
    })
})
router.put('/update-fournisseur/:matIds', function (req, res, next) {
    var ids = req.params.matIds.toString().split(",");
    var stocks = req.body;
    Matiere.find({ _id: { $in: ids } }).exec(function (err, matieres) {
        if (err) return next(err);
        for (let matiere of matieres) {
            let prix = stocks.filter(x => x.matiere_id === String(matiere._id))[0].prix_ht;
            let fournisseur = stocks.filter(x => x.matiere_id === String(matiere._id))[0].fournisseur
            let index = matiere.fournisseurs.findIndex(item => String(item.fournisseur) === fournisseur);
            if (index != -1) {
                matiere.fournisseurs[index].prix_ht = prix;
            }
        }
        Matiere.collection.bulkWrite(
            matieres.map((matiere) => {
                return {
                    updateOne: {
                        filter: { _id: matiere._id },
                        update: {
                            $set: {
                                fournisseurs: matiere.fournisseurs
                            }
                        },
                        upsert: true
                    }
                }
            }), {}, (err, result) => {
                if (err) {
                    res.json({ success: false, msg: "Error" });
                } else {
                    res.json({ success: true, msg: "Matiere updated successfully", obj: result });
                }
            })
    })
    /* var id = req.params.matId;
     var fournisseur=req.body;
     Matiere.update(
         { _id : id,fournisseurs: { $elemMatch: { fournisseur: fournisseur.id} }},
         {
             $set: {
                 "fournisseurs.$.prix_ht": fournisseur.prix_ht,
                 updatedAt: Date.now(),
             }
         }, function (err, matiere) {
             if (err) {
                 res.json({ success: false, msg: "Error" });
             } else {
                 res.json({ success: true, msg: "Success update matiere", obj: matiere });
             }
 
         })*/
});

router.put('/delete/:matId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const matId = req.params.matId;
    const active = req.body.active;
    Matiere.update({ "_id": matId }, { "active": active }, function (err, matiere) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted matiere successfully", obj: matiere });
        }
    })
});
//get multiple
router.get('/getmatieres/:matIds', function (req, res, next) {
    var ids = req.params.matIds.toString().split(",");
    Matiere.find({ _id: { $in: ids } }).exec(function (err, matieres) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting matieres", obj: matieres });
        }
    });
});
//get by fournisseur
router.get('/getbyfournisseur/:fournId', function (req, res, next) {
    var id = req.params.fournId;
    Matiere.find({
        fournisseurs: {
            $elemMatch: {
                fournisseur: id
            }
        }
    }).exec(function (err, matieres) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting matieres", obj: matieres });
        }
    })
})
// export matière
router.get('/export/:type', function (req, res, next) {
    var type = req.params.type;
    Matiere.find().sort('-createdAt').exec(function (err, matiers) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('liste des matiers premier'); //creating worksheet

            matiers.forEach(matier => {
                matier.global = matier.stock_reel * matier.cmp ;
                if (matier.active) {
                    matier.statut = 'Actif';
                } else {
                    matier.statut = 'Inactif';
                }
            });
            //  WorkSheet Header
            worksheet.columns = [
                { header: 'Référence', key: 'reference', width: 10 },
                { header: 'Désignation', key: 'designation', width: 30 },
                { header: 'Unité', key: 'nature_stock', width: 10 },
                { header: 'Stock', key: 'stock_reel', width: 10 },
                { header: 'Stock minimum', key: 'stock_securite', width: 15 },
                { header: 'CMP', key: 'cmp', width: 20 },
                { header: 'Valeur global', key: 'global', width: 30 },
                { header: 'Prix de référence', key: 'prix_achat', width: 20 },
            ];
            // Add Array Rows
            worksheet.addRows(matiers);

            // Write to File.
            workbook.xlsx.writeFile("./uploads/liste_des_matieres_premiere.xlsx")
                .then(function () {
                    const file = './uploads/liste_des_matieres_premiere.xlsx';
                    //No need for special headers
                    res.download(file);
                });
        }
    });
});

//Add matière
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/tmp'); //image storage path
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


router.post('/importer:id', passport.authenticate('jwt', { session: false }), upload, async function (req, res, next) {
    creatorId = req.params.id;
    if (req.file) {
        upload(req, res, async function (err) {
            if (err) {
                // An error occurred when uploading
                return res.status(422).send("an Error occured");
            }
            // No error occured.
            path = req.file.destination + '/' + req.file.filename;
            const workbook = new excel.Workbook();
            var bulk = Matiere.collection.initializeUnorderedBulkOp();

            await workbook.xlsx.readFile(path).then(function () {
                var worksheet = workbook.getWorksheet(1);
                var row;
                worksheet.eachRow(function (filerow, rowNumber) {
                    if (rowNumber > 1) {
                        row = worksheet.getRow(rowNumber);
                        bulk.insert({
                            reference: row.getCell(1).value,
                            label: row.getCell(2).value,
                            designation: row.getCell(2).value,
                            stock: row.getCell(3).value,
                            stock_securite: row.getCell(4).value,
                            stock_max: row.getCell(5).value,
                            mesure_securite: row.getCell(7).value,
                            norme_qualite: row.getCell(8).value,
                            categorie: row.getCell(9).value,
                            nature_stock : row.getCell(10).value,
                            creatorId :mongoose.Types.ObjectId(creatorId),
                            active : true
                          
                        });
                    }
                });
                bulk.execute(function (err, result) {
                    if (err) {
                        console.log(err)
                        return res.json({ success: false, msg: err.writeErrors[0].err.errmsg + ', contacter votre adminstrateur' });
                    }
                    return res.json({ success: true, msg: "Matières ajouter avec succès" });
                });

            }).catch(err => res.json({ success: false, msg: "Une erreur c'est produite" }));
        });
    }
});


module.exports = router;
