var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var typeMatSchema = new mongoose.Schema({
  category: { type: String, required: true},
  name:     { type: String, required: true, unique: 'Le nom \"{VALUE}\", est déja utiliser' },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

typeMatSchema.index({
  'name': 'text',
});
typeMatSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit"
});
typeMatSchema.plugin(mongoosePaginate);

typeMatSchema.pre('save', function (next) {
  next();
});




const typeMat = module.exports = mongoose.model('typeMat', typeMatSchema);

module.exports.gettypeMatById = function (id, callback) {
  typeMat.findById(id, callback);

}

