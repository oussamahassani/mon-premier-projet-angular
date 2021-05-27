const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Client = require('../models/client');
const multer = require('multer');
//Add Client
router.post('/ajouter',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var client = new Client();
    client.name=req.body.name;
    client.mat_fis=req.body.mat_fis;
    client.tel=req.body.tel;
    client.adresse=req.body.adresse;
    client.email=req.body.email;
    client.zone=req.body.zone;
    client.creatorId=req.body.creatorId;
    client.commands_no=req.body.commands_no;
    

    client.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(data);
            res.json({ success: true, msg: "Client créé avec succès", obj: data.id });
        }
    });
});
//Get all clients
router.get('/',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    Client.find().sort('-createdAt').exec(function (err, clients) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting clients", obj: clients });
        }
    });
});
//Get clients nbr
router.get('/nbr',passport.authenticate('jwt', {session: false}),function (req, res, next){
    Client.find({active:true}).count(function(err, count){
      if(err) return next(err);
      res.json(count);
  });
})
//Update client
router.put('/:id',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    console.log(req.body)
    Client.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) 
        res.json({success : false , msg :err})
        else
        res.json({success : true , msg:'modifier avec succeé'});
    });
});

//Get client by id
router.get('/:id',passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Client.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


//Delete
router.delete('/delete/:clientId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const clientId = req.params.clientId;
    Client.deleteOne({ "_id": clientId }, function (err, client) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted client successfully", obj: client });
        }
    })
});



module.exports = router;