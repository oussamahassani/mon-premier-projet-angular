const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Demandeprix= require('../models/demandeprix');
const  nodemailer = require('nodemailer');
const multer = require('multer');
var fs = require('fs');
var pdf = require('html-pdf');

let transport =nodemailer.createTransport({
       host: "smtp.gmail.com",
      port: 587,
       secure: false, // upgrade later with STARTTLS
    // // service: 'gmail',
   
     auth: {
       user: "xprsolutionstunisie@gmail.com",
       pass: "Xpr@Azc@147"
        },
         tls: {
           rejectUnauthorized: false
       }
     });
//send mail
router.post('/sendmail', function(req, res, next) {
    let Pdf = "<html>";
    Pdf += "<div style='background: rgb(204,204,204); padding:20px'>";
    Pdf += "<div style='box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width:100%;margin:auto ; padding :30px; background:white'>"; 
    Pdf += "<img src='https://www.hayatsu.com.tr/Assets/Build/assets/images/logo/logo.png' style='margin:auto;display: block'>"; 
    Pdf+="<p>Demande de prix pour  un matiere</p>";
    Pdf+="<p>Notre societé Hayat  est  actuellement en   projet ,nous souhaite  avoir une idée des tarifs que vous appliquez pour ce type de matiere</p>"
    Pdf+= " <p>je vous saurai gré de bien vouloir me dresser un devis chiffré et m’indiquer une estimation de la date de livraison pour la liste suivants <span style='text-decoration: underline;color:blue'>"+ req.body.desigination+"</span> </p>";
    Pdf+= "<p> datereception  "+ req.body.date_reception + "</p>"
    Pdf+="<p> quantiter demander  "+req.body.quantiterdemander +"</p>"
    Pdf+="<p> modaliter de payement  "+req.body.modaliter +"</p>"
   Pdf+="<p>Je vous prie de me faire parvenir le devis à l’adresse mail suivante "+req.body.emailfrom +"</p>";
   Pdf+="<p> Veuillez agréer Madame/Monsieur, mes salutations respectueuses.</p>";
    Pdf+="<p>  pour plus d'information merci de  nous contacter sur  "+req.body.emailfrom+"/p>"
    Pdf += "<p>Bonne journée</p> <p> Siganture :"+req.body.name +" </p> </div></div>";
    Pdf += "</html>";
  //prepare email body text
  let Body = "<html>";
   Body += "<div style='background: rgb(204,204,204); padding:20px'>";
   Body += "<div style='box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width:500px;margin:auto ; padding :30px; background:white'>"; 
     Body += "<img src='https://www.hayatsu.com.tr/Assets/Build/assets/images/logo/logo.png' style='margin:auto;display: block'>"; 
     Body+= "<p>"+ req.body.message + "</p>"
     Body+=   "<p> Notre service clients est disponible pour toutes questions sur<span style='text-decoration: underline;color:blue'>contact@hayet.tn</span> </p>";
     Body += "<p>Bonne journée</p>  </div></div>";
  Body += "</html>";
          

                        

   
    let html =    Pdf //fs.readFileSync('./test/businesscard.html', 'utf8');
    let options = { format: 'Letter' };
    
    pdf.create(html, options).toFile('./uploads/devis/123.pdf', function(err, resutlta) {
      if (err) return console.log(err);
      else{
        let mailOptions = { 
            headers: {
                "x-priority": "1",
                "x-msmail-priority": "High",
                importance: "high"
             },
            from: "xprsolutionstunisie@gmail.com",
            to: req.body.email, 
            subject: " Bienvenue sur", html: Body,
            attachments: [{
            //   filename: 'file.pdf',
            //   content: resutlta.filename,
            //   contentType: 'application/pdf'
            path:resutlta.filename
            }]};
                            transport.sendMail(mailOptions, function (err) {
      if (err) { return res.status(200).send({ success:false, msg: err.message }); }
         return  res.status(200).send({success:true, msg :"mail envoiyeé avec suceé ." });
     }); 
      } 
    });
   

})
// uplod photo
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
     cb(null, './uploads/devis'); //image storage path
    },
    filename: function (req, file, cb) {
   //  var datetimestamp = Date.now();
     cb(null, file.originalname);
    }
  });
 

  let upload = multer({ storage: storage }).single('file')
  router.post('/upload',function(req, res , next) {
  
    upload(req, res, function (err) {
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
 

     
  
 
//Add demandeprix
router.post('/ajouter', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var demandedeprix = new Demandeprix();
    demandedeprix.num=req.body.num;
    demandedeprix.statut=req.body.statut;
    demandedeprix.creatorId=req.body.creatorId;
    demandedeprix.note=req.body.note;
    demandedeprix.prix_ht=req.body.prix_ht;
    demandedeprix.tva=req.body.tva;
    demandedeprix.categorie = req.body.categorie;
    if(req.body.service)
    demandedeprix.service=req.body.service
    demandedeprix.matiere = req.body._id
    demandedeprix.fournisseurs=req.body.fournisseurs
    demandedeprix.datelicraison_prevu=req.body.datereception
    demandedeprix.asked_quantite = req.body.asked_quantite
    demandedeprix.asked_prix = req.body.asked_prix
    demandedeprix.modaliter_de_payement = req.body.modaliter_de_payement
    demandedeprix.save(function (err, data) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "demande prix créé avec succès", obj: data.id });
        }
    });
});
router.get('/', function (req, res, next) {
    Demandeprix.find().sort('-createdAt').exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting demande", obj: fournisseurs });
        }
    });
});


router.get('/matricule/:search/:type', function (req, res, next) {
    var search = req.params.search;
    var type=req.params.type;
    Demandeprix.find({categorie: type,active:true,mat_fis: { $regex: search, $options: 'i' } }).exec(function (err, fournisseurs) {
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Success getting fournisseurs", obj: fournisseurs });
        }
    });
})
//Get Demandeprix nbr
router.get('/nbr', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demandeprix.find({ active: true }).count(function (err, count) {
        if (err) return next(err);
        res.json(count);
    });
})
router.get('/last', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    Demandeprix.find({}).sort({ _id: -1 }).limit(1).exec(function (err, demandes) {
        var now = new Date();
        let year = now.getFullYear();
        var num = 0;
        if (demandes === undefined || demandes.length == 0) {
            num = 0;
        } else {
            num = demandes[0].num;
        }
        if (!num || num === 0) {
            num = year + "-" + "0";
        } else {
            let x = String(num);

            let year_no = x.substr(x.length-4, x.length)
            let demandeint_no = x.substr(0, x.length-5);
            console.log(String(year)  , year_no)
            if (String(year) === year_no) {
                tmp = Number(demandeint_no) + 1;
                num =(tmp) +  '-' +  year_no 
            } else {
                num =  "0 -" + year
            }
        }
        if (err) {
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            console.log(num)
            res.json({ success: true, msg: "Derniére demande interieur demandeint", obj: num });
        }

    })
})
//Update Demandeprix
router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Demandeprix.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Modification effectué avec succès", obj: post });
        }
    });
});
//Get Demandeprix by id
router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Id is invalid ' + req.params.id
        });
    }
    Demandeprix.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
        } else {
            res.json({ success: true, msg: "Modification effectué avec succès", obj: post });
        }
    });
});
//Delete
router.put('/delete/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const Ids = req.params.id;
    Demandeprix.findByIdAndUpdate({ "_id": Ids }, { "active": false }, function (err, demande) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error" });
        } else {
            res.json({ success: true, msg: "Deleted demande successfully", obj: demande });
        }
    })
});
module.exports = router;