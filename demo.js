let spawn = require('child_process').spawn

let process = spawn('python', ["./main.py", "./public/file.jpg"]);

process.stdout.on('data', (data) => {
    console.log('From Js ' + JSON.parse(data.toString()));
});
process.stdout.on('error', (err) => {
    console.log(err);
});