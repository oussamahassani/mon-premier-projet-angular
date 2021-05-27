var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var LotSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: 'Code \"{VALUE}\", est déja utiliser' },
  quantite: { type: Number, min: 0, required: true },
  quantite_originale:{type:Number,min:0,required:true},
  ht_unitaire: { type: Number, min: 0, required: true },
  note: { type: String },
  is_comfirmed : { type: Boolean, default: true} ,
  is_deranger  : { type: Boolean, default:false} ,
  id_produit: { type: String, required: true },
  type_produit: { type: String, required: true },
  reception: { type: mongoose.Schema.Types.ObjectId, ref: 'Bonreception', required: function () { return this.code != "lot0" + this.id_produit } },
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: function () { return this.code != "lot0" + this.id_produit } },
  isExpire: { type: Boolean, default: false },
  date_expiration: {
    type: Date, required: function () {
      if (this.isExpire && this.code != "lot0"+''+this.id_produit) {
        return true
      }else{
        return false;
      }
    }
  },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

LotSchema.index({
  'code': 'text'
});
LotSchema.plugin(beautifyUnique, {
  defaultMessage: "Un erreur c\'est produit: "
});
LotSchema.plugin(mongoosePaginate);

LotSchema.pre('save', function (next) {
  next();
});




const Lot = module.exports = mongoose.model('Lot', LotSchema);

module.exports.getLotById = function (id, callback) {
  Lot.findById(id, callback);

}