var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology',false);


var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: 'Nom d\'utilisateur \"{VALUE}\", est déja utiliser'},
    fname:    { type: String, required: true, unique: false},
    lname:    { type: String, required: true, unique: false},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    password: { type: String, required: true, unique: false},
    adress:   { type: String, required: true, unique: false},
    image: {type:String,required:false,unique:false},
    gender:   { type: String, unique: false},
    tel:      { type: String, required: true, unique: 'Numero de téléphone \"{VALUE}\", est déja utiliser'},
    active :  {type : Boolean , default : true},
    //Zone uniquement pour les commerciaux
    zone:{type:String},
    creatorId:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true, autopopulate: true},
    salaire:{type:String},
    permissions:[{
      _id: false,
      id:{type:mongoose.Schema.Types.ObjectId,ref:'groupe', autopopulate: true}
    }]
  }, {timestamps: true});
  UserSchema.index({
    'username': 'text',
    'fname': 'text',
    'lname': 'text',
    'email':'text',
    'adress':'text',
    'tel':'text',
    'salaire':'text',
    'zone':'text'
  });

  UserSchema.plugin(require('mongoose-autopopulate'));
  UserSchema.plugin(mongoosePaginate);
  UserSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});

  UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null , null , function(err,hash){
      if(err) return next(err);
        user.password = hash;
        next();
    });
  });


 

  module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
    
  }

  module.exports.getUserByEmail = function(email, callback){
    const query = {email : email} ;
    User.findOne(query ,callback);
    
  }


  module.exports.comparePassword = function(candidatePass, hash, callback){
    bcrypt.compare(candidatePass,hash, (err, isMatch) => {
      if(err) throw err; 
      callback(null, isMatch) ;
    })
  }


  const User = module.exports = mongoose.model('User', UserSchema);

