const express = require('express');
const router = express.Router();
const Resize = require("../config/resize");
const upload = require ("../config/uploadMiddleware")
const path = require('path');
const Entity=require('../config/entity');
const passport = require('passport');
const Fournisseur = require('../models/fournisseur');
const NotifStock = require('../models/notif_stock');

router.post('/upload', upload.single('image'), async function (req, res) {
    const imagePath = './uploads/';
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({success:false,error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    const imgSrc="/uploads/"+filename;
    return res.status(200).json({success:true, name: imgSrc });
});
router.put('/:skip/:limit', function (req, res, next) {

  var sort = req.body.sort;
  var sortOrder = req.body.sortOrder;
  var myquery=null;
  if(req.body.query)
  {
      myquery=req.body.query;
  }
  let obj = { active: 1, createdAt:-1}
  if(sort)
  {
    if (sort.length > 0) {
        for (let i = 0; i < sort.length; i++) {
            obj[sort[i]] = sortOrder[i];
        }
    } else {
        obj = {createdAt:-1};
    }
  }
  let query = {};
  if (req.body.searchText && req.body.searchText.length > 0) {
        query = {
            $and: [{
                $text: {
                    $search: req.body.searchText
                }
            }]
        };
      req.params.skip = 0;
  }

  if(myquery)
        query = {...query, ...myquery};

  var options = {
      sort: obj,
      offset: req.params.skip,
      limit: req.params.limit
  };
  Entity.getEntity(req.body.entity).paginate(query, options, function (err, result) {
      if (err) {
          res.json({ success: false, msg: err });
      } else {
          res.json({ success: true, msg: "Success getting items", obj: result });
      }
  });
})
router.post('/nbr/:entity',passport.authenticate('jwt', {session: false}),function (req, res, next){
  var ent=req.params.entity;
  let query = {};
    if(typeof req.body.query !== 'string'){
        query = {...query, ...req.body.query}; 
    } else{
        query.active = true;
    }
    Entity.getEntity(ent).find(query).count(function(err, count){
        if(err) return next(err);
        res.json(count);
    });
})


router.get('/last', function (req, res, next) {
    Fournisseur.find({}).sort({ _id: -1 }).limit(1).exec(function (err, fournisseur) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (fournisseur === undefined || fournisseur.length == 0) {
            name = 0;
        } else {
            name = fournisseur[0].ref;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let fournisseur_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(fournisseur_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Dernier fournisseur", obj: name });
        }

    })
})

router.get('/getAlertStockMP', function (req, res, next) {
    NotifStock.find({read:false}).sort({ createdAt: -1 }).limit(1).exec(function (err, notifStock) {
        if (err) {
            res.json({ success: false, msg: err.message });
        } else {
            res.json({ success: true, obj: notifStock });
            if(notifStock.length){
                NotifStock.findByIdAndUpdate(notifStock[0]._id, {read:true}, function (err, post) {
                    if (err) {
                        console.log(err);
                        return
                    } 
                });
            }
        }

    })
})
  module.exports = router;  

  /** if(ent==="facture" && type)
      {
          if(type==="interne")
          {
            query = {
                $and: [{
                    $text: {
                        $search: req.body.searchText
                    }
                }, {    
                    active: true,
                    isReception:true
                }]
            };
          }else{
            query = {
                $and: [{
                    $text: {
                        $search: req.body.searchText
                    }
                }, {    
                    active: true,
                    isReception:false
                }]
            };
          }
        
      }
      
      
      else  */

      /** if(ent==="facture" && type)
      {
        if(type==="interne")
        {
            query = {active:true,isReception:true};
        }else{
            query = {active:true,isReception:false};
        }
      }else   */



      /* if((ent==="demande" || ent==="commandeap") && req.body.type)
      {
        switch (req.body.type)
        {
          case 0:
            //all
            query = {active: true};
            break;
          case 1:
            //confirmed
            query = {active: true,statut:"Confirmed"};
            break;
         case 2:
           //attente
           query={active:true,statut:"attente"}
           break;
         case 3:
            query = {active: true,statut:"Canceled"};
           //canceled
           break;       
        }
      }
      else{*/
        

     // }