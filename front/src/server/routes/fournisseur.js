const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Fournisseur = require('../models/fournisseur');
const multer = require('multer');
const excel = require('exceljs');
const fs = require('fs');
var path = require('path');

 
//Add fournisseur
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var fournisseur = new Fournisseur();
    fournisseur.ref=req.body.ref;
    fournisseur.name=req.body.name;
    fournisseur.mat_fis=req.body.mat_fis;
    fournisseur.tel=req.body.tel;
    fournisseur.email=req.body.email;
    fournisseur.adresse=req.body.adresse;
    fournisseur.categorie=req.body.categorie;
    fournisseur.type=req.body.type;
    fournisseur.place=req.body.place;
    fournisseur.total_achat=req.body.total_achat;
    fournisseur.note=req.body.note;
    fournisseur.creatorId=req.body.creatorId;
    fournisseur.logo=req.body.logo;
    fournisseur.prestataire=req.body.prestataire;
    fournisseur.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Fournisseur créé avec succès", obj: data.id });
        }
    });
});
router.put('/test/:id', function (req, res, next) {
   
    const fournisseurId = req.params.id 
    Fournisseur.findByIdAndUpdate({_id : fournisseurId } , { $push: {reclamtion: req.body }}, function (err, fournisseur) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "add reclamation successfully", obj: fournisseur });
        }
    })
    })
    router.put('/changestatut/:id', function (req, res, next) {
        
        const fournisseurId = req.params.id
        Fournisseur.updateOne(
            { _id: fournisseurId, "reclamtion._id":req.body._id  },
            { $set: { "reclamtion.$.statut" : req.body.statut } }, function (err, fournisseur) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "update reclamation successfully", obj: fournisseur });
            }
        })
    })
//Get 20 fournisseurs
router.get('/', function (req, res, next) {
    Fournisseur.find().sort('-createdAt').exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });
});
router.get('/type/:type', function (req, res, next) {
   var type=req.params.type;
    Fournisseur.find({ categorie: type,active:true}).sort('-createdAt').limit(5).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });
});
router.get('/name/:search/:type', function (req, res, next) {
    var search = req.params.search;
    var type=req.params.type;
    Fournisseur.find({ categorie: type,active:true,name: { $regex: search, $options: 'i' } }).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });

})
router.get('/ref/:search/:type', function (req, res, next) {
    var search = req.params.search;
    var type=req.params.type;
    Fournisseur.find({ categorie:type,active:true,ref: { $regex: search, $options: 'i' } }).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });

})
router.get('/matricule/:search/:type', function (req, res, next) {
    var search = req.params.search;
    var type=req.params.type;
    Fournisseur.find({categorie: type,active:true,mat_fis: { $regex: search, $options: 'i' } }).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });
})
//Get fournisseurs nbr
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Fournisseur.find({ active: true }).count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Update fournisseur
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Fournisseur.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Modification effectué avec succès", obj: post });
        }
    });
});
//Get fournisseur by id
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Fournisseur.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Modification effectué avec succès", obj: post });
        }
    });
});
//Delete
router.put('/delete/:fournisseurId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const fournisseurId = req.params.fournisseurId;
    const active = req.body.active;
    Fournisseur.update({ "_id": fournisseurId }, { "active": active }, function (err, fournisseur) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted fournisseur successfully", obj: fournisseur });
        }
    })
});
//get multiple
router.get('/getfournisseurs/:fournIds', function (req, res, next) {
    var ids = req.params.fournIds.toString().split(",");
    Fournisseur.find({ _id: { $in: ids } }).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });
});

router.get('/export/:type', function (req, res, next) {
    var type=req.params.type;
    Fournisseur.find().sort('-createdAt').exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('liste des fournisseurs'); //creating worksheet
            
            fournisseurs.forEach(fournisseur => {
                if(fournisseur.active){
                    fournisseur.statut = 'Actif';
                }else{
                    fournisseur.statut = 'Inactif';
                }
            });
            //  WorkSheet Header
            worksheet.columns = [
              { header: 'Référence', key: 'ref', width: 10 },
              { header: 'Nom', key: 'name', width: 30 },
              { header: 'Adresse', key: 'adresse', width: 30},
              { header: 'Téléphone', key: 'tel', width: 10},
              { header: 'email', key: 'email', width: 25},
              { header: 'Statut', key: 'statut', width: 10},
              { header: 'Matricule fiscale', key: 'mat_fis', width: 20},
              { header: 'Note', key: 'note', width: 50,  outlineLevel: 1}
            ];
            
            // Add Array Rows
            worksheet.addRows(fournisseurs);
            
            // Write to File.
            workbook.xlsx.writeFile("./uploads/liste_des_fournisseurs.xlsx")
              .then(function() {
                const file = './uploads/liste_des_fournisseurs.xlsx';
                //No need for special headers
                res.download(file);
              });
        }
    });
 });

 //Add fournisseursss
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
   console.log(req.params.id)

    if (req.file){
        upload(req, res, async function (err) {
         if (err) {
          // An error occurred when uploading
          return res.status(422).send("an Error occured");
         }  
         // No error occured.
         path = req.file.destination+'/'+req.file.filename;
         const workbook = new excel.Workbook();
         var bulk = Fournisseur.collection.initializeUnorderedBulkOp(); 

         await workbook.xlsx.readFile(path).then(function() {
            var worksheet = workbook.getWorksheet(1);
            var row;
            worksheet.eachRow(function(filerow, rowNumber) {
                if(rowNumber>1){
                    row = worksheet.getRow(rowNumber);
                    bulk.insert( {
                         creatorId :mongoose.Types.ObjectId(req.params.id),
                         ref: row.getCell(1).value,
                         name: row.getCell(2).value,
                         adresse: row.getCell(3).value,
                         tel: row.getCell(4).value,
                         email: row.getCell(5).value,
                         mat_fis: row.getCell(7).value,
                         note: row.getCell(8).value,
                         logo:'',
                         categorie:row.getCell(9).value,
                         type:row.getCell(6).value=="oui" ? true : false ,
                         place:row.getCell(7).value,
                         total_achat:"0",
                         active : true ,

                        });
                    console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                 }
            });
            bulk.execute(function(err, result) {
                if(err) {
                    return res.json({ success: false, msg: err.writeErrors[0].err.errmsg + ', contacter votre adminstrateur'});
                }
               return res.json({ success: true, msg: "Fournisseurs ajouter avec succès" });
            });

        }).catch(err => res.json({ success: false, msg: "Une erreur c'est produite" }));
       }); 
      }
});

module.exports = router;