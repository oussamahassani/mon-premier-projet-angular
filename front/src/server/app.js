const compression = require('compression')
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
global.App = {
  clients : [],
  activdb: '',
  clientdbconn: [],
  clientModel: []
}
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');

app.use(compression())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded())
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/uploads/', express.static(path.join(__dirname, './uploads')));
require('./routes')(app);
if (process.env.NODE_ENV === "production") { 
mongoose.connect(config.databaseprod, { useNewUrlParser: true,  useUnifiedTopology: false });
}else { // use on debugging 
mongoose.connect(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });

}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected')
});


app.use(express.static(path.join(__dirname, 'public'),{ maxage: '864000' }));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

// Loading socket.io
var io = require('socket.io').listen(server);
app.io = io;

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    
});





// server listen
server.listen(port, () => console.log(`Running on localhost:${port}`));

/**
 * //update lot
router.put('ajouterlot/:matpId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var matpId = req.params.matpId;
    var lot = req.body;
    Matp.findById(req.params.id, function (err, matiere) {
        if (err) return next(err);
        let lots = matiere.lots;
        var now = new Date();
        let year = now.getFullYear();
        if (lots === undefined || lots.length == 0) {
            var code = 0;
        } else {
            var code = lots[lots.length - 1].code;
        }

        if (!code || code === 0) {
            code = ref + '0' + year;
        } else {
            let x = String(code);
            let code_date = x.substr(ref.length, x.length);
            let year_no = code_date.substr(x.length - 6, 6)
            let code_no = code_date.substr(0, x.length - 6);
            if (String(year) === year_no) {
                tmp = Number(code_no) + 1;
                code = ref + (tmp) + year_no;
            } else {
                code = ref + '0' + year;
            }
        }
    });
    let newlot
    newlot.code = code;
    newlot.qte = req.body.qte;
    newlot.date_creation = req.body.date_creation;
    newlot.date_expiration = req.body.date_expiration;
    newlot.prix_achat = req.body.prix_achat
    Matp.update(
        { _id: matpId },
        { $addToSet: { lots: lot } }, function (err, matp) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Probleme" });
            } else {
                res.json({ success: true, msg: "Matp créé avec succès", obj: matp });
            }

        })
});

 */
