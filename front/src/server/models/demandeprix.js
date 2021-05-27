var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let DemandeprixSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero de la demande interne \"{VALUE}\", est déja utiliser' },
    statut:{type:String,required:true},
    active: { type: Boolean, default: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
    note: { type: String },
    prix_ht : {type : Number},
    note : {type : String},
    categorie : {type : String , default:'stock'},
    tva : {type : Number},
    matiere  : { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', autopopulate: true },
    service  : { type: mongoose.Schema.Types.ObjectId, ref: 'Service', autopopulate: true  },
    fournisseurs: [  {fournisseur: {type:mongoose.Schema.Types.ObjectId,ref:'Fournisseur', autopopulate: true} ,
    prix_evoiyer : {type: Number , default : 0 } ,
    delais_de_livraison: {type:String }, 
    modaliter_de_payement : {type:String }, 
    devis_envoiyer : {type : String}}],
    asked_quantite : { type: Number },
    asked_prix : { type: Number },
    datelicraison_prevu : { type: Date },
  
}, { timestamps: true });

DemandeprixSchema.plugin(require('mongoose-autopopulate'));
DemandeprixSchema.plugin(mongoosePaginate);
DemandeprixSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produite"
});

DemandeprixSchema.pre('save', function (next) {
    next();
});




 module.exports = mongoose.model('Demandeprix', DemandeprixSchema);
