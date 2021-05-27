const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const passport = require('passport');
const excel = require('exceljs');
const Services = require('../models/services');
    /* POST: save a new bill */
    router.post('/ajouter', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        console.log(req.body)
      let service = new Services();
      service.num= req.body.num;
      service.total= req.body.total;
      service.active= req.body.active;
      service.name = req.body.name;
     service.image = req.body.image
      service.tva= req.body.tva;
      service.fournisseurs=req.body.fournisseur;
      service.creatorId= req.body.creatorId;
      service.note=req.body.note;

      service.save(function(err,data){
          if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Services créé avec succès", obj : data.id});
          } 
        });
});


    router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        console.log(req.body , req.params.id) 
        Services.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Mise à jour avec succès"});
          } 
            });
      });
       

        
     router.get('/last', function(req, res, next){
        Services.find({}).sort({ _id: -1 }).limit(1).exec(function (err, service) {
          var now = new Date();
          let year = now.getFullYear();
          var name = 0;
          if (service === undefined || service.length == 0) {
              name = 0;
          } else {
              name = service[0].numero;
          }
          if (!name || name === 0) {
              name = '0' + year;
          } else {
              let x = String(name);
              let year_no = x.substr(x.length - 4, 4)
              let service = x.substr(0, x.length - 4);
              if (String(year) === year_no) {
                  tmp = Number(service) + 1;
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
        Services.find().sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Services.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Services.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      //Delete
router.put('/delete/:serviceid',passport.authenticate('jwt', { session: false }), function (req, res, next) {
  const facId = req.params.serviceid;
  const active = req.body.active;
  Services.findByIdAndUpdate({ "_id": facId }, { "active": active }, function (err, services) {
      if (err) {
          console.log(err);
          res.json({ success: false, msg: "Error" });
      } else {
          res.json({ success: true, msg: "Deleted services successfully", obj: services });
      }
  })
});

router.get('/export/:type', function (req, res, next) {
    let type = req.params.type;
    Services.find().sort('-createdAt').exec(function (err, services) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('liste des services'); //creating worksheet

            services.forEach(service => {
               
                if (service.active) {
                    service.statut = 'Actif';
                } else {
                    service.statut = 'Inactif';
                }
            });
            //  WorkSheet Header
            worksheet.columns = [
                { header: 'numero', key: 'num', width: 10 },
                { header: 'Désignation', key: 'name', width: 30 },
                { header: 'prix', key: 'total', width: 10 },
                { header: 'tva', key: 'tva', width: 10 },
                { header: 'statut', key: 'statut', width: 10 },
                { header: 'note', key: 'note', width: 15 },

            ];
            // Add Array Rows
            worksheet.addRows(services);
                   
            // Write to File.
            workbook.xlsx.writeFile("./uploads/liste_des_services.xlsx")
                .then(function () {
                   
                    const file = './uploads/liste_des_services.xlsx';
                    //No need for special headers
                    console.log('worksheet',file)
                    res.download(file);
                });
        }
    });
});

      
      router.get('/services/:fourId',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Services.find({"fournisseur" : req.params.fourId }).sort('-updatedAt').exec(function (err, services) {
          if (err) return next(err);
          res.json(bills);
        });
      });
      router.get('/services/:creatorId',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Services.find({"creatorId" : req.params.creatorId }).sort('-updatedAt').exec(function (err, services) {
          if (err) return next(err);
          res.json(bills);
        });
      });
      router.put('/justiffac/:id', function(req, res, next) {
        var id = req.params.id;
        const body=req.body;
        Services.updateOne(
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
      router.get('/multiple/:ids', function (req, res, next) {
        let ids = req.params.ids.toString().split(",");
        Services.find({ _id: { $in: ids } }).exec(function (err, serv) {
            if (err) {
                res.json({ success: false, msg: "Error" });
            } else {
                res.json({ success: true, msg: "Success getting Services", obj: serv });
            }
        });
    });
    router.put('/commander/:ids', function (req, res, next) {
        let ids = req.params.ids.toString().split(",");
        Services.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    demandeEnCours: true,
                    updatedAt: Date.now(),
                }
            }, function (err, serv) {
                if (err) {
                    res.json({ success: false, msg: "Error" });
                } else {
                    res.json({ success: true, msg: "Services mise a jour avec succées", obj: serv });
                }
    
            })
    });

module.exports = router ;