const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const passport = require('passport');
const Facture = require('../models/facture');
const Commandap=require('../models/commandeap')
const Commandsor = require('../models/commandesor');
    /* POST: save a new bill */
    router.post('/ajouter', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      var facture = new Facture();
      facture.numero= req.body.numero;
      facture.ht= req.body.ht;
      facture.tva= req.body.tva;
      facture.categorie = req.body.categorie;
      if(!req.body.isReception)
      {
        facture.timbre_fiscale= req.body.timbre_fiscale;
        facture.frais_livraison=req.body.frais_livraison;
        facture.bon_livraisons= req.body.bon_livraisons;
        facture.client=req.body.client;
      }else{
        facture.isReception=req.body.isReception;
        facture.bon_receptions=req.body.bon_receptions;
        facture.fournisseur=req.body.fournisseur;
      }
    
      facture.creatorId= req.body.creatorId;
      facture.payement=req.body.payement;
      

      facture.save(function(err,data){
          if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Facture créé avec succès", obj : data.id});
          } 
        });
});


    router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Facture.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Mise à jour avec succès"});
          } 
            });
      });
//Bonreceptions Number
router.get('/nbr/:type', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var type=req.params.type;
    if(type)
    {
        if(type==="interne")
        {
            Facture.find({isReception:true}).count(function (err, count) {
                if (err) return next(err);
                res.json(count);
            });
        }else{
            Facture.find({isReception:false}).count(function (err, count) {
                if (err) return next(err);
                res.json(count);
            });
        }
    }
    
})

 //Update livraison en attente / expédiée
router.put('/statut/:factureId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  const factureId = req.params.factureId;
  const facture = req.body;
  Facture.update(
      { _id: factureId},
      {
          $set: {
                  payement: facture.payement,
                  updatedAt: Date.now(),
          }
      }, function (err, facture) {
          if (err) {
              console.log(err);
              res.json({ success: false, msg: "Error" });
          } else {
              //send notification
              res.json({ success: true, msg: "Success update statut facture", obj: facture });
          }

      })
});

       

        
     router.get('/last', function(req, res, next){
      Facture.find({}).sort({ _id: -1 }).limit(1).exec(function (err, facture) {
          var now = new Date();
          let year = now.getFullYear();
          var name = 0;
          if (facture === undefined || facture.length == 0) {
              name = 0;
          } else {
              name = facture[0].numero;
          }
          if (!name || name === 0) {
              name = '0' + year;
          } else {
              let x = String(name);
              let year_no = x.substr(x.length - 4, 4)
              let facture_no = x.substr(0, x.length - 4);
              if (String(year) === year_no) {
                  tmp = Number(facture_no) + 1;
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
  router.get('/lastcommandap', function(req, res, next){
    Commandap.find({}).sort({ _id: -1 }).limit(1).exec(function (err, command) {
        var now = new Date();
        console.log(command)
        console.log(command[0])
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
        console.log(name)
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Derniére commande", obj: name });
        }

    })
})
router.get('/lastcommandsor', function(req, res, next){
    Commandsor.find({}).sort({ _id: -1 }).limit(1).exec(function (err, command) {
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
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      Facture.find().sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Facture.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Facture.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      //Delete
router.put('/delete/:facId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  const facId = req.params.facId;
  const active = req.body.active;
  Facture.update({ "_id": facId }, { "active": active }, function (err, facture) {
      if (err) {
          console.log(err);
          res.json({ success: false, msg: "Error" });
      } else {
          res.json({ success: true, msg: "Deleted facture successfully", obj: facture });
      }
  })
});



      
      router.get('/getbillsByclient/:ClientId',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Facture.find({"client" : req.params.ClientId }).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });
      router.get('/getbillsByCreator/:creatorId',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Facture.find({"creatorId" : req.params.creatorId }).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });
      router.put('/justiffac/:id', function(req, res, next) {
        var id = req.params.id;
        const body=req.body;
        Facture.updateOne(
            { _id : id  },
            {
                $set: {
                    justif_facture:body.src,
                    updatedAt: Date.now(),
                }
            }, function (err, facture) {
                if (err) {
                    res.json({ success: false, msg: "Error" });
                } else {
                    res.json({ success: true, msg: "Success update facture", obj: facture });
                }
    
            })
      });
      
      router.get('/multiple/:facIds', function (req, res, next) {
        var ids = req.params.facIds.toString().split(",");
        Facture.find({ _id: { $in: ids } }).exec(function (err, factures) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success getting facture", obj: factures });
            }
        });
    });
module.exports = router ;