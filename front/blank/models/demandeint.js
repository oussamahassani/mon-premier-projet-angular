var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let DemandeintSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero de la demande interne \"{VALUE}\", est déja utiliser' },
    statut:{type:String,required:true},
    active: { type: Boolean, default: true },
    client  : {type: mongoose.Schema.Types.ObjectId , ref :'Client', autopopulate: true},
    commandesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Commandsor'},
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
    confirmedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    note: { type: String },
    categorie:{type:String,required:true},
    prix_ht : {type : Number},
    tva : {type : Number},

    products: [{
        _id:false,
        id_produit: { type: String },
        type_produit: { type: String },
        asked_quantite: { type: Number, required: true },
        prix_vente : {type : Number}
    }]
}, { timestamps: true });
DemandeintSchema.index({
    'num': 'text'
});

DemandeintSchema.plugin(require('mongoose-autopopulate'));
DemandeintSchema.plugin(mongoosePaginate);
DemandeintSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produite"
});

DemandeintSchema.pre('save', function (next) {
    next();
});




const Demandeint = module.exports = mongoose.model('Demandeint', DemandeintSchema);


module.exports.getDemandeById = function (id, callback) {
    Demandeint.findById(id, callback);

}
