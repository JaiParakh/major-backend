const express = require('express');
const cors = require('cors');
var multer = require('multer')
let spawn = require('child_process').spawn

let app = express();
app.use(express.json());
app.use(cors());

var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        console.log(file);
        let ext = file.originalname.substr(file.originalname.indexOf('.'));
        cb(null, file.fieldname + ext )
    }
});

var upload = multer({ storage: storage }).single('file')

app.post('/getresult', (req, res) => {
    console.log(req.body);
    upload(req, res, function (err) {
        if(err){
            console.log(err);
            return res.json({success: false});
        }
        let process = spawn('python', ["./main.py", "./public/file.jpg"]);
        process.stdout.on('data', (data) => {
            console.log('From Js ' + JSON.parse(data.toString()))
            return res.json({success: true, data: data})
        });
        process.stdout.on('error', (err) => {
            console.log(err);
            return res.json({success: false});
        })
    });
});

app.listen(5000, () => {
    console.log("Server Started");
});