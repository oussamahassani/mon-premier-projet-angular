var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var CommandSchema = new mongoose.Schema({
    name: { type: String, required: true,unique: 'Numero de commande \"{VALUE}\", est déja utiliser'},
    enCours:{type:Boolean,required:true,default:true},
    confirmed:{type:Boolean,required:true,default:false},
    canceled:{type:Boolean,required:true,default:false},
    active:{type:Boolean,default:true},
    liv:{type:Boolean,default:false},
    bon_liv:{type: mongoose.Schema.Types.ObjectId,ref: 'Livraison',required:false},
    date_liv:{type:Date,required:true},
    prix_ht:{type:Number,required:true},
    tva:{type:Number,required:true},
    creatorId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true},
    client:{type:mongoose.Schema.Types.ObjectId, ref:'Client',required:true},
    products:[
        {
            product_id:{type:mongoose.Schema.Types.ObjectId, ref:'Product',required:true},
            quantite:{type:Number,required:true},
            updatedAt:{type:Date,default:Date.now}
        }
    ]
  }, {timestamps: true});

  CommandSchema.index({ 
    name: 'text',
});


CommandSchema.plugin(mongoosePaginate);
  CommandSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

  CommandSchema.pre('save', function(next) {
    next();
  });


 

    const Command = module.exports = mongoose.model('Command', CommandSchema);


  module.exports.getCommandById = function(id, callback){
    Command.findById(id,callback);
    
  }

