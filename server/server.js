const express = require('express');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var moment = require('moment-timezone');
// Hashing and salting password

// Remove cors restriction --important 
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride());


const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    }
}

app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
    res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
});



// Update the details if DB's details changed --important
const db = mysql.createPool({
    connectionLimit: 100,
    host: '182.50.133.78',
    user: 'nypUser',
    password: 'P@ssw0rd!',
    database: 'qrAttend'
});

// Basic things to include
app.set('port', process.env.PORT || 3306);
app.listen(app.get('port'), function () {
    console.log("listening to Port", app.get("port"));
});



// Test for connections
db.getConnection((err) => {
    console.log('Connecting mySQL....')
    if (err) {
        throw err;
    }
    console.log('mysql connected....')
    db.query('select * from Student;', function (err2, result, field) {
        if (!err2) {
            console.log(result);
        }
        else {
            console.log(err2)
        }
    });
});


// Variables
var correctAdmin = "";
app.get('/student', cors(corsOptions), function (request, response) {
    console.log('Connected to /students');
    db.query('select * from Student;', function (err, result, fields) {
        if (err) {
            console.log('Error message: ', err);
            throw err;
        };
        var string = JSON.stringify(result);
        var json = JSON.parse(string)
        console.log(json);
        response.send(json)
    })
});


app.post('/register', cors(corsOptions), function (request, response) {
    // Values from JSON in register.page.ts
    var AdminNumber = request.body.AdminNumber;
    var Password = request.body.Password;
    var UUIDNo = request.body.UUIDNo;
    var UUIDTime = (moment().tz('Asia/Singapore').format('MMMM Do YYYY')) + '|' + (moment().tz('Asia/Singapore').format('L'));
    var Overwrite = request.body.Overwrite;

    db.query('SELECT * FROM Student WHERE AdminNumber = ?', [StudentID], function (error, result, fields) {
        if (!error) {
            if (result.length > 0) {  //if adminNum does not exist
                response.send({
                    id: 1,
                    status: false,
                    message: "Admin number does not exist!"
                });
            } else { //if adminNum exist
                if (result.UUIDNo.length > 0 && !Overwrite) { //if user wants to overwrite, will just proceed to update.
                    if (UUIDNo == result[0].UUIDNo) {
                        bcrypt.compare(Password, result[0].Password, function(err, res) {
                            if (res) {
                                response.send({  
                                    id: 5,
                                    status: true,
                                    message: "Proceed to login!"
                                });
                            } else {
                                response.send({  
                                    id: 2,
                                    status: false,
                                    message: "This account has already registered on this device!"
                                });
                            }
                        });  
                    }
                    else {
                        response.send({
                            id: 3,
                            status: false,
                            message: "This account has already registered on another device! Register again on this device will de-register on your previous device!"
                        })
                    }
                }
                else if (result[0].UUIDNo.length <= 0 || Overwrite) {
                    // Hashing and salting password
                    bcrypt.hash(Password, saltRounds, function (err, hashPassword) {
                        db.query('Update Student Set Password = ? , UUIDNo = ?, UUIDTime = ? Where AdminNumber = ?',
                            [hashPassword, UUIDNo, UUIDTime, AdminNumber], function (error, result, fields) {
                                if (!error) {
                                    console.log('Row Updated:', result);
                                    response.send({
                                        id: 6,
                                        status: true,
                                        message: "Registered Successfully!"
                                    })
                                } else {
                                    console.log(error);
                                    response.send({
                                        id: 4,
                                        status: false,
                                        message: "Registered Failed! Please check with admin!"
                                    })
                                }
                                
                            });
                    });
                }
            }
        } else {
            console.log(error);
        }
    });
})