const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Commandsor = require('../models/commandesor');
const MiddleSortie=require('../config/middleSortie');

//Ajouter commande sorie ,passport.authenticate('jwt', {session: false})
router.post('/ajouter', function (req, res, next) {
    
    MiddleSortie.updateMatieres(MiddleSortie.parsMatiereIds(req.body.products),req.body.products, function(result){
        console.log(result)
      if(result.success)
      {
        var newcom = new Commandsor();
        newcom.num = req.body.num;
        newcom.categorie = req.body.categorie,
        newcom.creatorId = req.body.creatorId;
        newcom.products = req.body.products;
        newcom.save(function (err, data) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
            } else {
                
                res.json({ success: true, msg: "Commande sortie créé avec succès", obj: data.id });
            }
        });
      }else{
        res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message,obj:res_middle.err });

      }
    })
 
});
//Read all
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Commandsor.find().sort('-createdAt').exec(function (err, commandssor) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting commands sorites", obj: commandssor });
        }
    });
});
//Command today
router.get('/today', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Commandsor.find({ 'createdAt': { $gte: today } }).exec(function (err, commandssor) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting today commands sorties", obj: commandssor });
        }
    })
})
//Commands Number
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Commandsor.find().count(function (err, count) {
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
    Commandsor.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//get by creator
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userId = req.params.userId;
    Commandsor.find({ "creatorId": userId }).exec(function (err, commandssor) {
        if (err) return next(err);
        res.json(commandssor);
    });
});

//ajouter commandes
router.put('/add-multiple', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var commands = req.body;
    Commandsor.insertMany(commands, function(err,result){
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting commands", obj: result });
        }
    })

})
//Modification
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Commandsor.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});





router.get('/last', function(req, res, next){
    Commandsor.find({}).sort({ _id: -1 }).limit(1).exec(function (err, commands) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (commands === undefined || commands.length == 0) {
            name = 0;
        } else {
            name = commands[0].num;
        }
        if (!name || name === 0) {
           name = year + "-" + "0";
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let command_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(command_no) + 1;
                name = year_no + '-' + (tmp) ;
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
router.get('/getcommandssor/:comIds', function(req, res, next) {
    var ids = req.params.comIds.toString().split(",");
    Commandsor.find({_id : {$in : ids} }).exec(function (err, commandssor) {
      if (err) {
        res.json({ success: false, msg: "Error" });
    } else {
        res.json({ success: true, msg: "Success getting commands sorties", obj: commandssor });
    }
    });
  });

module.exports = router;