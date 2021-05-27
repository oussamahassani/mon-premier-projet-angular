var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// create a schema
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var NotificationSchema   = new Schema({
    sender: {type:mongoose.Schema.Types.ObjectId, ref:'User',required:true}, // Notification creator
    receiver: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}], // Ids of the receivers of the notification
    title: String,
    message: String, // any description of the notification message 
    link: {
      url: String,
      params: String,
      paramsValue: String
  },
    image:    { type: String, unique: false},
    read_by:[{
      _id: false,
     readerId:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
     read_at: {type: Date, default: Date.now}
    }],
  createdAt: { type: Date, required: true, default: Date.now, expires: 7776000 }
    
  }, {timestamps: true});
  NotificationSchema.index({
    'title': 'text',
    'message': 'text'
  });

  NotificationSchema.plugin(mongoosePaginate);
  NotificationSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});


// on every save, add the date and edit updated date
NotificationSchema.pre('save', function(next) {
  // The current date
  var currentDate = new Date();
  
  // edit the updated_at field to the current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// Exports it to be abailable in all the application
  const Notification = module.exports = mongoose.model('Notification', NotificationSchema);
