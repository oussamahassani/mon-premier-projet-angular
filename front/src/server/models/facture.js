var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var FactureSchema = new mongoose.Schema({
    numero: { type: String, required: true,unique: 'Numero de la facture \"{VALUE}\", est déja utiliser' },
    active:{type:Boolean,default:true},
    ht: { type: Number, required: true },
    tva: { type: Number, required: true },
    timbre_fiscale: { type: Number},
    frais_livraison: { type: Number},
    bon_livraisons: [{
        numero: { type: String, default: '', trim: true },
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livraison' }
    }],
    isReception:{type:Boolean,default:false},
    bon_receptions: [{
        numero: { type: String, default: '', trim: true },
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livraison' }
    }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', autopopulate: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', autopopulate: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true, required: true },
    categorie : {type:String},
    payement:{
       paid_status:{type:Boolean,required:true,default:false},
       mode_paiement:{type:String},
       user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true}
    },
    justif_facture:{type:String}
}, { timestamps: true });

FactureSchema.index({ 
    numero: 'text',
    amount:'text',
    'bon_livraisons.numero':'text',
    'payement.mode_paiement':'text'
});


FactureSchema.plugin(require('mongoose-autopopulate'));
FactureSchema.plugin(mongoosePaginate);
FactureSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});


FactureSchema.pre('save', function (next) {
    next();
});





const Facture = module.exports = mongoose.model('Facture', FactureSchema);

module.exports.getFactureById = function (id, callback) {
    Facture.findById(id, callback);

}

module.exports.getFactureByNumero = function (numero, callback) {
    const query = { numero: numero };
    Facture.findOne(query, callback);

}

