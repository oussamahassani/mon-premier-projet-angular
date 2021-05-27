var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var CommandapSchema = new mongoose.Schema({
  num: { type: String, required: true, unique: 'Numero du bon achat \"{VALUE}\", est déja utiliser' },
  statut:{type:String},
  active: { type: Boolean, default: true },
  total_ht: { type: Number, required: true },
  total_tva: { type: Number, required: true },
  bonreception: { type: mongoose.Schema.Types.ObjectId, ref: 'Bonreception', autopopulate: true},
  demand:{type: mongoose.Schema.Types.ObjectId, ref:'Demande',required:true, autopopulate: true},
  note: { type: String },
  categorie: {type:String},
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true, autopopulate: true },
  products: [
    {
      _id:false,
      id_produit: { type: String },
      type_produit: { type: String },
      asked_quantite: { type: Number, required: true },
      prix_ht: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

CommandapSchema.index({
  num: 'text',
});

CommandapSchema.plugin(require('mongoose-autopopulate'));
CommandapSchema.plugin(mongoosePaginate);
CommandapSchema.plugin(beautifyUnique, {
  defaultMessage: "Un erreur c\'est produit: "
});

CommandapSchema.pre('save', function (next) {
  next();
});




const Commandap = module.exports = mongoose.model('Commandap', CommandapSchema);


module.exports.getCommandapById = function (id, callback) {
  Commandap.findById(id, callback);

}

