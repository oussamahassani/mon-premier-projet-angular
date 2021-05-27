const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Inventaire = require('../models/inventaire');
//Ajouter inventaire
router.post('/ajouter',passport.authenticate('jwt', {session: false}), function (req, res, next) {
 
    var inventaire = new Inventaire();
    inventaire.num=req.body.num
    inventaire.resultat=req.body.resultat
    inventaire.total=req.body.total
    inventaire.pourcentage=req.body.pourcentage;
    inventaire.creatorId=req.body.creatorId;
    inventaire.categorie = req.body.categorie;
    inventaire.note=req.body.note
    inventaire.products=req.body.products
    inventaire.periode_last=req.body.periode_last
    inventaire.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Inventaire crée avec succées", obj: data.id });
        }
    });
});
//Read all
router.get('/',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    Inventaire.find().sort('-createdAt').exec(function (err, inventaires) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting inventaire", obj: inventaires });
        }
    });
});
router.get('/dernier',passport.authenticate('jwt',{session:false}),function(req,res,next){
    Inventaire.find({}).sort({ _id: -1 }).limit(1).exec(function (err, inventaire){
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier inventaire", obj: inventaire });
        }
    })
})
router.get('/last',passport.authenticate('jwt',{session:false}), function(req, res, next){
    Inventaire.find({}).sort({ _id: -1 }).limit(1).exec(function (err, inventaire) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (inventaire === undefined || inventaire.length == 0) {
            name = 0;
        } else {
            name = inventaire[0].num;
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
})


//inventaire today
router.get('/today',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Inventaire.find({ 'createdAt': { $gte: today } }).exec(function (err, inventaires) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today inventaire", obj: inventaires });
        }
    })
})
//inventaires Number
router.get('/nbr',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Inventaire.find().count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
//Get by id
router.get('/:id',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Inventaire.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by users
router.get('/getInventaires/:invIds', function(req, res, next) {
    var ids = req.params.invIds.toString().split(",");
    Inventaire.find({_id : {$in : ids} }).exec(function (err, inventaires) {
      if (err) {
        res.json({ success: false, msg: "Error" });
    } else {
        res.json({ success: true, msg: "Success getting inventaires", obj: inventaires });
    }
    });
  });


//Modification
router.put('/:id',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Inventaire.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//Delete
router.delete('/:id',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Inventaire.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("inventaire supprimée avec succès");
    });

});


//products_no,mode_paiement
  router.put('/delete/:invId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const bonId = req.params.invId;
    const active = req.body.active;
    Inventaire.update({ "_id": bonId }, { "active": active }, function (err, inventaire) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted inventaire successfully", obj: inventaire });
        }
    })
  });


module.exports = router;