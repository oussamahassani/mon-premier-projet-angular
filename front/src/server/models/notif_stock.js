var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var notifStockSchema = new mongoose.Schema({
  prod_ids: [{
    id_produit: { type: String },
    type_produit: { type: String },
  }],
  read: { type: Boolean, default: false },
}, { timestamps: true });

notifStockSchema.index({
  'name': 'text',
});
notifStockSchema.plugin(beautifyUnique, {
  defaultMessage: "Une erreur c\'est produit"
});
notifStockSchema.plugin(mongoosePaginate);

notifStockSchema.pre('save', function (next) {
  next();
});




const notifStock = module.exports = mongoose.model('notifStock', notifStockSchema);

module.exports.getnotifStockById = function (id, callback) {
  notifStock.findById(id, callback);

}

