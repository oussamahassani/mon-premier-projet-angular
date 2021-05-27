

module.exports.getEntity = function(entity) {
    const obj=require('../models/'+entity);
    return obj;
}