var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var Dossierfournissuer = new mongoose.Schema({
  fournisseur :{type: mongoose.Schema.Types.ObjectId,ref: 'Fournisseur',required:true, autopopulate: true},
  exp:{type:String,required:false},
  date: { type: Date},
  RefBC:{type:String},
  referencefacture:{type:Number,default:0,required:true,min:0},
  devise:{type:String,required:true},
  mtdevise:{type:String,required:true,default:true},
  tconversion:{type:String},
  mtdinar:{type:String},
  Rdeclation:{type:String,default:false},
  droitD:{type:String,required:false},
  tva:{type:String,required:true},
  avanceis:{type:Number},
  refQ:{type:String},
  assurence:{type:String,required:true},
  Magasinage:{type:String,required:true},
  Fret:{type:String,required:true},
  Transit:{type:String,required:false},
  Transport:{type:String,required:false},
  creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true, autopopulate: true },
  active: { type: Boolean, default: true },
  photo:{type:String}
}, { timestamps: true });


Dossierfournissuer.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit: "
});
Dossierfournissuer.plugin(mongoosePaginate);
Dossierfournissuer.plugin(require('mongoose-autopopulate'));
Dossierfournissuer.pre('save', function (next) {
  next();
});




const Matiere = module.exports = mongoose.model('Dossierfournissuer', Dossierfournissuer);

module.exports.getMatiereById = function (id, callback) {
  Matiere.findById(id, callback);

}


