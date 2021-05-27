var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var DemandeSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero de la demande \"{VALUE}\", est déja utiliser' },
    isCommand:{type:Boolean,default:false},
    statut:{type:String},
    typedemande:{type:String,default:"stock"},
    active: { type: Boolean, default: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
    confirmedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    note: { type: String },
    categorie:{type:String,required:true},
    demandeprix:{type:Boolean,default:false},
    products: [{
        _id:false,
        id_produit: { type: String },
        type_produit: { type: String },
        asked_quantite: { type: Number, required: true }
    }]

}, { timestamps: true });
DemandeSchema.index({
    'num': 'text'
});
DemandeSchema.plugin(require('mongoose-autopopulate'));
DemandeSchema.plugin(mongoosePaginate);
DemandeSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

DemandeSchema.pre('save', function (next) {
    next();
});




const Demande = module.exports = mongoose.model('Demande', DemandeSchema);


module.exports.getDemandeById = function (id, callback) {
    Demande.findById(id, callback);

}

