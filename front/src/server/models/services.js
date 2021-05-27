var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ServiceSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero du bon de livraison \"{VALUE}\", est déja utiliser' },
    total:{type:Number,required:false},
    active:{type:Boolean,default:true},
    image:{type:String},
    name:{type:String,required:true},
    tva:{type:Number,required:true},
    fournisseurs:[ {prix_ht:{type:Number},
    delais_de_livraison: {type:String },
    modaliter_de_payement : {type:String } ,
    fournisseur:{type:mongoose.Schema.Types.ObjectId, ref:'Fournisseur',required:true,autopopulate: true}}],
    creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true ,autopopulate: true },
    note:{type:String},
}, { timestamps: true });

ServiceSchema.plugin(require('mongoose-autopopulate'));
ServiceSchema.plugin(mongoosePaginate);
ServiceSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

ServiceSchema.pre('save', function (next) {
    next();
});




 module.exports = mongoose.model('Service', ServiceSchema);




