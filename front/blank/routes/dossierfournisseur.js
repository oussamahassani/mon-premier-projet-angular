const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Dossierfournissuer = require('../models/dossierfournissuer');
const multer = require('multer');
const passport = require('passport');

//Add matiere
router.post('/ajouter', function (req, res, next) {

    var dossierfournissuer = new Dossierfournissuer();
    dossierfournissuer.fournisseur = req.body.fournisseur;
    dossierfournissuer.exp = req.body.exp;
    dossierfournissuer.date = req.body.date;
    dossierfournissuer.RefBC = req.body.RefBC;
    dossierfournissuer.referencefacture = req.body.referencefacture;
    dossierfournissuer.devise = req.body.devise;
    dossierfournissuer.mtdevise = req.body.mtdevise;
    dossierfournissuer.tconversion = req.body.tconversion;
    dossierfournissuer.mtdinar=req.body.mtdinar;
    dossierfournissuer.Rdeclation = req.body.Rdeclation;
    dossierfournissuer.droitD = req.body.droitD;
    dossierfournissuer.tva = req.body.tva;
    dossierfournissuer.avanceis = req.body.avanceis;
    dossierfournissuer.refQ = req.body.refQ;
    dossierfournissuer.assurence = req.body.assurence;
    dossierfournissuer.Magasinage=req.body.Magasinage;
    dossierfournissuer.Fret = req.body.Fret;
    dossierfournissuer.Transit=req.body.Transit;
    dossierfournissuer.Transport=req.body.Transport;
    dossierfournissuer.creatorId = req.body.creatorId;
    dossierfournissuer.photo = req.body.photo;
    dossierfournissuer.save(function (err, data) {
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
    Dossierfournissuer.find().sort('-createdAt').exec(function (err, dossier) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting dossier", obj: dossier });
        }
    });
});



//Get matieres nbr
router.get('/nbr', function (req, res, next) {
    Dossierfournissuer.find({ active: true }).count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Update matiere
router.patch('/update/:id', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Dossierfournissuer.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success updating dossier", obj: post });
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
    Dossierfournissuer.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



//Add matière
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/dossierfournissuer'); //image storage path
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


router.post('/add', async function (req, res, next) {
    upload(req, res, function (err) {
        console.log(req.file)
        if (err instanceof multer.MulterError) {
            return res.status(500).json({success : false ,msg:err +"muttelerror"})
          // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json({success : false ,msg:err +"uncow error"})
          // An unknown error occurred when uploading.
        } 
        
        return res.status(200).send({success : true , msg:'devis enregistrer'})
    //     // Everything went fine.
      })
  
  })




module.exports = router;
