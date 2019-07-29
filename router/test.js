const express=require('express');
let router = express.Router();
const fs = require('fs');
var multer = require('multer');
// var upload = multer({
//     dest: 'uploads/'
// });

var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, 'uploads/');
    },
    // 서버에 저장할 파일명
    filename: function (req, file, cb) {
        // console.log(file);
        file.uploadfilename = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
        cb(null, file.originalname);
    }
});

var imgFileFilter = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    console.log('확장자 : ', ext);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true);
};

var imgUpload = multer({
    storage: storage,
    fileFilter: imgFileFilter,
    limits: {
        fileSize: 10*1024*1024
    }
});


// router.get('/router',(req,res)=>{
//     console.log('/test/router를 요청 받았습니다');
//     res.end();
// });
// router.get('/fileupload_form',function(req,res){
//     res.render('./test/fileupload_form.html');
// });

router.post('/fileupload',imgUpload.single('photo'),(req,res)=>{
    // console.log(req.file);
    // res.send('uploaded....'+req.file.filename);
    res.end();
});
router.post('/fileupload_multi',imgUpload.array('photos',5),(req,res)=>{
    // console.log(req.files);
    console.log(req.files);
    // console.log(req.files);
    // res.send('uploaded....'+req.files[0].filename);
    res.end();
});

module.exports=router;