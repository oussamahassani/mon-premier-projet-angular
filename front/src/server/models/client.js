var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mat_fis: { type: String, required: true },
    tel: { type: Number, required: true },
    adresse:{type:String,required:true},
    email:{type:String,required:true},
    zone:{type:String},
    active:{type:Boolean,default:true},
    creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true},
    commands_no:{type:Number,default:0},
    chiffre_affaire:{type:Number,default:0}
}, { timestamps: true });

ClientSchema.index({ 
    name: 'text',
    mat_fis:'text',
    tel:'text',
    adresse:'text',
    email:'text',
    zone:'text'
});


ClientSchema.plugin(mongoosePaginate);
ClientSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

ClientSchema.pre('save', function (next) {
    next();
});




const Client = module.exports = mongoose.model('Client', ClientSchema);


module.exports.getClientById = function (id, callback) {
    Client.findById(id, callback);

}
module.exports.getClientByEmail = function(email, callback){
    const query = {email : email} ;
    Client.findOne(query ,callback);
    
  }

