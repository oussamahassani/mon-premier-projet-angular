var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var CommandsorSchema = new mongoose.Schema({
  num: { type: String, required: true },
  active: { type: Boolean, default: true },
  categorie : {type:String},
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
  products: [
    {
      _id:false,
      id_produit: { type: String },
      type_produit: { type: String }, 
      asked_quantite: { type: Number, required: true },
      prix_vente: { type: Number }, 
    }
  ]
}, { timestamps: true });

CommandsorSchema.index({
  num: 'text',
});

CommandsorSchema.plugin(require('mongoose-autopopulate'));
CommandsorSchema.plugin(mongoosePaginate);
CommandsorSchema.plugin(beautifyUnique, {
  defaultMessage: "Un erreur c\'est produit: "
});

CommandsorSchema.pre('save', function (next) {
  next();
});




const Commandsor = module.exports = mongoose.model('Commandsor', CommandsorSchema);


module.exports.getCommandsorById = function (id, callback) {
  Commandsor.findById(id, callback);

}

