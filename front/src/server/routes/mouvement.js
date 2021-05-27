const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Mouvement = require('../models/mouvement');
//Ajouter Mouvement
router.post('/ajouter',passport.authenticate('jwt', {session: false}), function (req, res, next) {
 
    var mouvement = new Mouvement();
    mouvement.num=req.body.num
    mouvement.id_lot=req.body.id_lot
    mouvement.quantite=req.body.quantite
    mouvement.id_produit=req.body.id_produit;
    mouvement.type_produit=req.body.type_produit
    mouvement.code_brbl=req.body.code_brbl
    mouvement.entree=req.body.entree
    mouvement.prix_ref=req.body.prix_ref
    mouvement.prix_cmp=req.body.prix_cmp
    mouvement.quantite_stock=req.body.quantite_stock;
    mouvement.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Mouvement crée avec succées", obj: data.id });
        }
    });
});
router.put('/add-multiple', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var mouvements = req.body;
    Mouvement.insertMany(mouvements, function (err, result) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Ajout de mouvements avec succées ", obj: result });
        }
    })

})
//Read all
router.get('/',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    Mouvement.find().sort('-createdAt').exec(function (err, mouvements) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting Mouvement", obj: mouvements });
        }
    });
});
router.get('/dernier',passport.authenticate('jwt',{session:false}),function(req,res,next){
    Mouvement.find({}).sort({ _id: -1 }).limit(1).exec(function (err, mouvement){
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier Mouvement", obj: mouvement });
        }
    })
})
router.get('/last',passport.authenticate('jwt',{session:false}), function(req, res, next){
    Mouvement.find({}).sort({ _id: -1 }).limit(1).exec(function (err, mouvements) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (mouvements === undefined || mouvements.length == 0) {
            name = 0;
        } else {
            name = mouvements[0].num;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let Mouvement_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(Mouvement_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier Mouvement", obj: name });
        }
        
    })
})


//Mouvement today
router.get('/today',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Mouvement.find({ 'createdAt': { $gte: today } }).exec(function (err, mouvements) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today Mouvement", obj: mouvements });
        }
    })
})
//Mouvements Number
router.get('/nbr',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Mouvement.find().count(function (err, count) {
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
    Mouvement.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by users
router.get('/getMouvements/:mouvIds', function(req, res, next) {
    var ids = req.params.mouvIds.toString().split(",");
    Mouvement.find({_id : {$in : ids} }).exec(function (err, mouvements) {
      if (err) {
        res.json({ success: false, msg: "Error" });
    } else {
        res.json({ success: true, msg: "Success getting Mouvements", obj: mouvements });
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
    Mouvement.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Mouvement.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json("Mouvement supprimée avec succès");
    });

});


//products_no,mode_paiement
  router.put('/delete/:invId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const bonId = req.params.invId;
    const active = req.body.active;
    Mouvement.update({ "_id": bonId }, { "active": active }, function (err, mouvement) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted Mouvement successfully", obj: mouvement });
        }
    })
  });
///mouvement/getMouvements/
router.get('/getMouvement/:prodId', function(req, res, next) {
    //var ids = req.params.prodIds.toString().split(",");
    var id=req.params.prodId;
    Mouvement.find({id_produit : id }).exec(function (err, mouvements) {
      if (err) {
        res.json({ success: false, msg: "Error" });
    } else {
        res.json({ success: true, msg: "Success getting mouvements", obj: mouvements });
    }
    });
  });

module.exports = router;