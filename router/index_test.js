// module.exports=function(data){


const express = require('express');
let router = express.Router();
const fs = require('fs');
const hasher = require('pbkdf2-password')();




router.get('/', (req, res) => {
    console.log('/를 요청받았습니다.');
    res.render('./test/index.html');

});
router.get('/signin_form', (req, res) => {
    console.log('/signin_form를 요청받았습니다.');
    res.render('test/signin_form.html');
});
router.post('/signin', (req, res) => {
    console.log('/signin_form를 요청받았습니다.');
    let user = {};
    user.id = req.body.id;
    user.origin = req.body.password;
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
        member[user.id] = user;
        console.log(member);
        fs.writeFileSync('data/userlist.json', JSON.stringify(member, null, 8));
        res.redirect('/login_form');
    });
});
router.get('/login_form', (req, res) => {
    console.log('/login_form를 요청받았습니다.');
    let msg = req.flash('msg');
    console.log(msg);
    if (msg.length > 0) {
        console.log("flash 메세지가 들어있음");
        res.render('test/login_form.html', { 'msg': msg });
    } else {
        res.render('test/login_form.html');
    }
});
router.post('/login', (req, res) => {
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
                    res.redirect('/');
                });
                return;
            } else {
                console.log('비밀번호가 틀렸습니다');
                req.flash('msg', "비밀번호가 틀렸습니다.");
                res.redirect('/login_form');
                return;
            }
        });
    } else {
        req.flash('msg', "존재하지 않는 아이디입니다.");
        res.redirect('/login_form');
    }
});
router.get('/logout', (req, res) => {
    console.log('/logout요청을 받았습니다');
    req.session.destroy();
    res.redirect('/');
});

router.get('/regcar_form', (req, res) => {
    console.log('/regcar_form를 요청받았습니다.');
    if (req.session.userid) {
        res.render('test/regcar_form.html');
    } else {
        res.render(`test/login_form.html`);
    }
});
router.get('/regcar', (req, res) => {
    console.log('/regcar를 요청받았습니다.');
    let car = {};
    car.carname = req.query.carname;
    car.brand = req.query.brand;
    car.year = req.query.year;
    car.distance = req.query.distance;
    car.price = req.query.price;
    carlist.push(car);
    fs.writeFileSync('./data/carlist.json', JSON.stringify(carlist, null, 8));
    console.log(carlist);
    res.json({ msg: "등록되었습니다!" });
});
router.get('/carinfo', (req, res) => {
    console.log('/carinfo를 요청받았습니다.');
    res.render('test/carinfo.html');
});
router.get('/carhistory', (req, res) => {
    console.log('/carhistory를 요청받았습니다.');
    res.render('test/carhistory.html');
});
router.get('/carlist', (req, res) => {
    console.log('/carlist를 요청받았습니다.');
    res.render(`test/carlist.html`);
});
router.get('/api/carlist', (req, res) => {
    console.log('/api/carlist를 요청받았습니다');
    res.json({ cars: carlist });
});

router.get('/search/carlist', (req, res) => {
    console.log('/search/carlist를 요청 받았습니다.');
    console.log(req.query.search);
    let cars = [];
    cars = carlist.filter(function (element) {
        if (element[req.query.kind] == req.query.search) {
            return element;
        }
    });
    console.log(cars);
    res.json({ 'cars': cars });
});
module.exports = router;
// return router;
// }