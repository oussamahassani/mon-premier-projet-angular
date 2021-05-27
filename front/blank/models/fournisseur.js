var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var FournisseurSchema = new mongoose.Schema({
    ref:{type:String},
    name: { type: String, required: true },
    mat_fis: { type: String, required: true },
    tel: { type: Number, required: true },
    email:{type:String,required:true},
    adresse:{type:String},
    categorie:{type:String, required:true},
    type:{type:Boolean,required:true},
    prestataire:{type:Boolean,default:false},
    place:{type:String,required:true},
    total_achat:{type:Number,default:0},
    note:{type:String},
    creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true, autopopulate: true },
    logo:{type:String,required:false},
    active:{type:Boolean,default:true},
    reclamtion : [{reclamtiontype:{ type: Array,
        
        default: ['marchandise endomager']},
        description : {type : String , required:true} ,
        date : {type:Date } ,
        mode_de_transfomtion : {type : Array  ,   default: ['email'] },
        statut  : {type : String , default:"en cours"}
        }]
    }
        , { timestamps: true });

FournisseurSchema.index({ 
    name: 'text',
    mat_fis:'text',
    tel:'text',
    adresse:'text',
    email:'text',
    adresse:'text'
});

FournisseurSchema.plugin(require('mongoose-autopopulate'));
FournisseurSchema.plugin(mongoosePaginate);
FournisseurSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

//enum :['verbal', 'email','courier'] , 
//enum :['marchandise endomager ','livraison non comforme' , 'facture eroneé' , 'livraison incomplete' , 'retard de livraison' , 'autre'],




const Fournisseur = module.exports = mongoose.model('Fournisseur', FournisseurSchema);


module.exports.getFournisseurById = function (id, callback) {
    Fournisseur.findById(id, callback);

}
module.exports.getFournisseurByEmail = function(email, callback){
    const query = {email : email} ;
    Fournisseur.findOne(query ,callback);
    
  }


