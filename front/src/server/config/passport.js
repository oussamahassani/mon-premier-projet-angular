const JwtStrategy = require('passport-jwt').Strategy ;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database');
const User = require('../models/users');

module.exports = function(passport, req){
    let opts = {} ;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("XPRS");
    opts.secretOrKey = config.secret ;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        User.findById(jwt_payload._id, (err, user) => {
                if(err){
                    return done(err, false);
                }
                if(user){
                    return done(null,user);
                }else{
                    return done(null,false);
                }
        }) ;
    }));
}