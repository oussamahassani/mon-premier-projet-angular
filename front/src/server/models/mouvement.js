
var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var MouvementSchema=new mongoose.Schema({
    num:{type:String,required:true,unique:'Numero \"{VALUE}\", est déja utiliser' },
    id_lot:{type:mongoose.Schema.Types.ObjectId,ref: 'Lot',required:true, autopopulate: true},
    quantite:{type:Number,required:true},
    id_produit:{type:mongoose.Schema.Types.ObjectId,ref: 'Matiere',required:true},
    code_brbl:{type:String,required:false},
    type_produit:{type:String,required:true},
    entree:{type:Boolean},
    prix_ref:{type:Number,required:true},
    prix_cmp:{type:Number,required:true},
    quantite_stock:{type:Number,required:true}
}, {timestamps:true})

MouvementSchema.index({
  'code': 'text'
});
MouvementSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produite "
});
MouvementSchema.plugin(require('mongoose-autopopulate'));
MouvementSchema.plugin(mongoosePaginate);

MouvementSchema.pre('save', function (next) {
  next();
});




const Mouvement = module.exports = mongoose.model('Mouvement', MouvementSchema);

module.exports.getMouvementById = function (id, callback) {
  Mouvement.findById(id, callback);

}
