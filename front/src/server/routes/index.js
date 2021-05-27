var fs = require('fs');

module.exports = function(app) {
    console.log('Loading routes from: here :p ');
    fs.readdirSync('./routes').forEach(function(file) {
        var filename = file.substr(0, file.indexOf('.'));
        var route = './' + filename;
        if(filename != "test" && filename != "index"){
            console.log('Adding route: /api/'+filename);
            var myroute = require(route);
            app.use('/api/'+filename,myroute);
         }
    });
}