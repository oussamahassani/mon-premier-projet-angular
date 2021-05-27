var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var BonreceptionSchema = new mongoose.Schema({
    num: { type: String, required: true,unique: 'Numero \"{VALUE}\", est déja utiliser' },
    statut:{type:String},
    total_ht: { type: Number, required: true },
    total_tva: { type: Number, required: true },
    categorie : {type :String},
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true, autopopulate: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
    note: { type: String },
    facture_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Facture', required: false, autopopulate: true },
    products: [{
        _id:false,
        id_produit: { type: String },
        type_produit: { type: String },
        asked_quantite: { type: Number, required: true },
        livred_quantite: { type: Number, required: true },
        ht_unitaire: {type:Number,required:true},
        nbr_lot:{type:Number,required:true},
        lots:[]
    }],
    justif_reception:{type:String},
    justif_facture:{type:String},
    date_livraison:{type:Date}


}, { timestamps: true });
BonreceptionSchema.index({
    'num': 'text'
});

BonreceptionSchema.plugin(require('mongoose-autopopulate'));
BonreceptionSchema.plugin(mongoosePaginate);
BonreceptionSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

BonreceptionSchema.pre('save', function (next) {
    next();
});




const Bonreception = module.exports = mongoose.model('Bonreception', BonreceptionSchema);


module.exports.getBonreceptionById = function (id, callback) {
    Bonreception.findById(id, callback);

}

