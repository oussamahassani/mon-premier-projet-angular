var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var LivraisonSchema = new mongoose.Schema({
    num: { type: String, required: true, unique: 'Numero du bon de livraison \"{VALUE}\", est déja utiliser' },
    delievered:{type:Boolean,default:false},
    enAttente:{type:Boolean,default:true},
    products_no:{type:Number,required:true},
    total:{type:Number,required:true},
    active:{type:Boolean,default:true},
    frais:{type:Number,required:true},
    command:{type:mongoose.Schema.Types.ObjectId, ref:'Command',required:true},
    tva:{type:Number,required:true},
    client:{type:mongoose.Schema.Types.ObjectId, ref:'Client',required:true},
    creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true},
    note:{type:String},
    date_livraison:{type:Date},
    facture:{type:Boolean,default:false},
    justif_livraison:{type:String},
    facture_id:{type:mongoose.Schema.Types.ObjectId, ref:'Facture',required:false},
}, { timestamps: true });
LivraisonSchema.index({
    'num': 'text',
    'total': 'text',
  });

  LivraisonSchema.plugin(mongoosePaginate);
LivraisonSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

LivraisonSchema.pre('save', function (next) {
    next();
});




const Livraison = module.exports = mongoose.model('Livraison', LivraisonSchema);


module.exports.getLivraisonById = function (id, callback) {
    Livraison.findById(id, callback);

}

