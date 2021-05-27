var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var groupeSchema = new mongoose.Schema({
    groupename: { type: String, required: true, unique: 'Nom du groupe \"{VALUE}\", est déja utiliser'},
    active : {type : Boolean , default : true},
    permissions: Array
  }, {timestamps: true});

  groupeSchema.index({ groupename: 'text'});


  groupeSchema.plugin(mongoosePaginate);
  groupeSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});

  groupeSchema.pre('save', function(next) {
    next();
  });


 

    const groupe = module.exports = mongoose.model('groupe', groupeSchema);


  module.exports.getgroupeById = function(id, callback){
    groupe.findById(id,callback);
    
  }

  module.exports.getgroupeBygroupename = function(groupename, callback){
    const query = {groupename : groupename} ;
    groupe.findOne(query ,callback);
    
  }

