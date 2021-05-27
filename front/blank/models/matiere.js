var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var MatiereSchema = new mongoose.Schema({
    reference :{type:String,unique:'La reference \"{VALUE}\", est déja utiliser',required:true},
    designation:{type:String,required:false},
    stock: { type: Number, default: 0,min:0 },//theorique   
    stock_reel:{type:Number,default:0,min:0},//stock reel
    stock_securite:{type:Number,default:0,required:true,min:0},
    stock_max:{type:Number,default:0,required:true,min:0},
    isExpDate:{type:Boolean,required:true,default:true},
    mesure_securite:{type:String},
    norme_qualite:{type:String},
    demandeEnCours:{type:Boolean,default:false},
    categorie:{type:String,required:false},
    famille:{type:String,required:true},
    fournisseurs:[{
      fournisseur:{type:mongoose.Schema.Types.ObjectId,ref:'Fournisseur', autopopulate: true},
      prix_ht:{type:Number},
      delais_de_livraison: {type:String },
       modaliter_de_payement : {type:String }
    }],
    tva:{type:Number},
    cmp:{type:Number,default:0},
    prix_achat:{type:Number,min:0,required:true},
    prix_initial:{type:Number,min:0,required:true},
    nature_stock:{type:String,required:true},
    image:{type:String,required:false},
    fodec:{type:String},
  creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true, autopopulate: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

MatiereSchema.index({
  'reference': 'text',
  'designation': 'text'
});
MatiereSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit: "
});
MatiereSchema.plugin(mongoosePaginate);
MatiereSchema.plugin(require('mongoose-autopopulate'));
MatiereSchema.pre('save', function (next) {
  next();
});




const Matiere = module.exports = mongoose.model('Matiere', MatiereSchema);

module.exports.getMatiereById = function (id, callback) {
  Matiere.findById(id, callback);

}









/**
 *     lots_sortie:[{
      _id:false,
      code:{type:String},
      quantite:Number,
      note:{type:String},
      date_sortie:{type:Date,default:Date.now},
      user:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true}
   }],
 */

//SORTIE D'UN LOT DEJA MAWJOUD FIFO



