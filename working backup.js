const express = require('express');
const fs = require('fs');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
var hasher = require('pbkdf2-password')();
const app = express();
const path = require('path');
const port = 3000;

let member = {};
// let member = [];
// member['wptnzpq'] = {
//     id: "wptnzpq",
//     password: '1234',
//     name: "연민호",
//     email: "wptnzpq@gmail.com",
//     address: "충북"
// };
// hasher({
//     password: member["wptnzpq"].password,
// }, function (err, pass, salt, hash) {
//     if (err) {
//         console.log('ERR');
//     } else {
//         member["wptnzpq"].salt = salt;
//         member["wptnzpq"].password = hash;

//         fs.writeFileSync('data/userlist.json', JSON.stringify(member, null, 8));
//     }
// });
let carlist = [];
// carlist[0]={
//     carname:'아반떼',
//     brand:'호우',
//     year:'2015/5',
//     distance:'140',
//     price:'1500',
// };
// fs.writeFileSync('data/carlist.json', JSON.stringify(carlist, null, 8));
let carnum = 0;
let data = {
    submit: false
};
let rawdata = fs.readFileSync('./data/userlist.json');
member = JSON.parse(rawdata);
let cardata = fs.readFileSync('./data/carlist.json');
carlist = JSON.parse(cardata);

console.log(member);
console.log(carlist);

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

// app.use(function(req,res,next){
//     res.locals.id=req.session.userid;
//     next();
// });

app.get('/', (req, res) => {
    console.log('/를 요청받았습니다.');
        res.render('index.html');

});
app.get('/signin_form', (req, res) => {
    console.log('/signin_form를 요청받았습니다.');
    res.render('signin_form.html');
});
app.post('/signin', (req, res) => {
    console.log('/signin_form를 요청받았습니다.');
    let user = {};
    user.id = req.body.id;
    user.origin=req.body.password;
    user.password = req.body.password;
    user.name = req.body.name;
    user.email = req.body.email;
    user.address = req.body.address;
    console.log(user);

    hasher({
        password: user.password
    }, (err, pass, salt, hash) => {
        if (err) {
            console.log('ERR: ', err);
            res.redirect('/signup_form');
        }
        user.password = hash;
        user.salt = salt;
        // member.push(user);
        member[user.id] = user;
        console.log(member);
        fs.writeFileSync('data/userlist.json', JSON.stringify(member, null, 8));
        res.redirect('/login_form');
    });
});
app.get('/login_form', (req, res) => {
    console.log('/login_form를 요청받았습니다.');
    let msg = req.flash('msg');
    console.log(msg);
    if (msg.length >0) {
        console.log("flash 메세지가 들어있음");
        res.render('login_form.html', { 'msg': msg });
    } else {
        res.render('login_form.html');
    }
});
app.post('/login', (req, res) => {
    console.log('/login를 요청받았습니다.');
    console.log(req.body);
    if (member[req.body.id]) {
        return hasher({
            password: req.body.password,
            salt: member[req.body.id].salt,
        }, function (err, pass, salt, hash) {
            console.log(hash);
            if (err) {
                console.log('ERR : ', err);
            } if (hash == member[req.body.id].password) {
                req.session.userid = member[req.body.id].id;
                req.session.name = member[req.body.id].name;
                req.session.save(function () {
                    app.locals.user={};
                    app.locals.user.userid=req.session.userid;
                    app.locals.user.name=req.session.name;
                    res.redirect('/');
                });
                return;
            } else {
                console.log('비밀번호가 틀렸습니다');
                req.flash('msg',"비밀번호가 틀렸습니다.");
                res.redirect('/login_form');
                return;
            }
        });
    } else {
        req.flash('msg',"존재하지 않는 아이디입니다.");
        res.redirect('/login_form');
    }
});
app.get('/logout',(req,res)=>{
    console.log('/logout요청을 받았습니다');
    req.session.destroy();
    delete app.locals['user'];
    res.redirect('/');
});

app.get('/regcar_form', (req, res) => {
    console.log('/regcar_form를 요청받았습니다.');
    if (req.session.userid) {
        res.render('regcar_form.html');
    } else {
        res.render(`login_form.html`);
    }
});
app.get('/regcar', (req, res) => {
    console.log('/regcar를 요청받았습니다.');
    let car = {};
    car.carname = req.query.carname;
    car.brand = req.query.brand;
    car.year = req.query.year;
    car.distance = req.query.distance;
    car.price = req.query.price;
    carlist.push(car);
    fs.writeFileSync('data/carlist.json', JSON.stringify(carlist, null, 8));
    console.log(carlist);
    data.submit = true;
    res.json(data);
    data.submit = false;
});
app.get('/carinfo', (req, res) => {
    console.log('/carinfo를 요청받았습니다.');
        res.render('carinfo.html');
});
app.get('/carhistory', (req, res) => {
    console.log('/carhistory를 요청받았습니다.');
        res.render('carhistory.html');
});
app.get('/carlist', (req, res) => {
    console.log('/carlist를 요청받았습니다.');
        res.render(`carlist.html`);
});
app.get('/api/carlist', (req, res) => {
    console.log('/api/carlist를 요청받았습니다');
    res.json({ cars: carlist });
});

app.get('/search/carlist',(req,res)=>{
    console.log('/search/carlist를 요청 받았습니다.');
    console.log(req.query.search);
    let cars=[];
    cars=carlist.filter(function(element){
        if(element[req.query.kind]==req.query.search){
        return element;
        }
    });
    console.log(cars); 
    res.json({'cars':cars});
});

app.listen(port, () => {
    console.log(port + "번 포트로 대기중");
});
