var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: 'Le UGS \"{VALUE}\", est déja utiliser' },
  name: { type: String, required: true, unique: 'Le nom \"{VALUE}\", est déja utiliser' },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  prix: { type: Number, required: true },
  tva: { type: Number, required: true },
  promo: { type: Number },
  remise: { type: Number },
  creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true},
  active: { type: Boolean, default: true }
}, { timestamps: true });

ProductSchema.index({
  'code': 'text',
  'name': 'text',
  'prix': 'text'
});
ProductSchema.plugin(beautifyUnique, {
  defaultMessage: "Un erreur c\'est produit: "
});
ProductSchema.plugin(mongoosePaginate);

ProductSchema.pre('save', function (next) {
  next();
});




const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function (id, callback) {
  Product.findById(id, callback);

}

