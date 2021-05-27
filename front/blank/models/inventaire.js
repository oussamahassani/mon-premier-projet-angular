var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var InventaireSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero \"{VALUE}\", est déja utiliser' },
    resultat: { type: Boolean, default: false },
    total: { type: Number, required: true },
    pourcentage: { type: Number },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true  },
    note: { type: String },
    categorie : {type:String , required : true},
    periode_last:{type:Date,required:true},
    products: [{
        _id:false,
        id_produit: { type: String },
        type_produit: { type: String },
        lots: [{
            _id: false,
            id_lot: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
            stock_reel: { type: Number, required: true },
            stock_theorique: { type: Number, required: true }
        }]
    }]

}, { timestamps: true });
InventaireSchema.index({
    'num': 'text'
});

InventaireSchema.plugin(require('mongoose-autopopulate'));
InventaireSchema.plugin(mongoosePaginate);
InventaireSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

InventaireSchema.pre('save', function (next) {
    next();
});




const Inventaire = module.exports = mongoose.model('Inventaire', InventaireSchema);


module.exports.getInventaireById = function (id, callback) {
    Inventaire.findById(id, callback);
}
