const express = require('express');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 3000;
global.member = {};
let rawdata = fs.readFileSync('./data/userlist.json');
member = JSON.parse(rawdata);
global.carlist = [];
let cardata = fs.readFileSync('./data/carlist.json');
carlist = JSON.parse(cardata);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());
app.use(session({
    secret: '1A@W#E$E',
    resave: false,
    saveUninitialized: true,
    // store: new FileStore(),
}));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.user = {};
    res.locals.user.userid = req.session.userid;
    res.locals.user.name = req.session.name;
    next();
});

let test = require('./router/test.js');
app.use('/test', test);
let index = require('./router/index_test.js');
app.use('/', index);

app.listen(port, () => {
    console.log(port + "번 포트로 대기중");
});
