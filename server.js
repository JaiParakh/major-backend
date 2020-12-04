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
        console.log(file.originalname);
        let ext = file.originalname.substr(file.originalname.indexOf('.'));
        cb(null, file.fieldname+ext)
    }
});

// 0: Covid +
// 1: Covid -

var upload = multer({ storage: storage }).single('file')

app.post('/getresult', (req, res) => {
    //console.log(req.body);
    upload(req, res, function (err) {
        if(err){
            console.log(err);
            return res.json({success: false});
        }
        //return res.json({success: true, covid: "Negative"});
        //console.log(file)
        let process = spawn('python', ["./main.py", "./public/file.jpeg"]);

        process.stdout.on('data', function(data){
            let covid = "Negative";
            if(data == 0){
                covid = "Positive";
            }
            return res.json({ success: true, covid});
            //console.log("In Js " + data.toString())
            //console.log('From Js ' + JSON.parse(data.toString()).data);
        });
    });
});

app.listen(5000, () => {
    console.log("Server Started");
});