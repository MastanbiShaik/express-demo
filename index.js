const express = require('express');
const cors = require("cors")

const app = express();

app.use(express.json());

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors(corsOptions));

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    var sql = require("mssql");

var config = {
    host: '3306',
    user: 'root',
    password: 'test123',
    database: 'Users',
    server: 'localhost',
}
    sql.connect(config, function(err) {
        if(err) console.log(err);

        var request = new sql.Request();

        request.query('select * from UserTypes', function(err, recordset) {
            if(err) console.log(err);

            res.send(recordset)
        })
        
    })
    res.send(courses);
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
    // res.status(200).json({
    //     your: courses
    // })
})

app.get('/api/courses/:id', (req, res) => {
   let course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course){
    res.status(404).send('The couse with the given ID was not found')
   }
   else {
    res.send(course)
   } 
})

app.post('/api/courses', (req, res) => {
    if(!req.body.name || req.body.name < 3){
        res.send(400).send('Name is required and should be minimum 3 charcters');
        return;
    }
    const course = {
        id: courses.length + 1, 
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})


app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course){
    res.status(404).send('The couse with the given ID was not found')
   }
   else {
    if(!req.body.name || req.body.name < 3){
        res.send(400).send('Name is required and should be minimum 3 charcters');
        return;
    }
    course.name = req.body.name;
    res.send(course);

   } 
})


//get UserTypes
app.get('/userTypes', async function (req, res) {
    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'users'
    });
    connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    connection.query("SELECT * FROM usertypes", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        //const jsonResult = result.json();
        res.send(result);
        //return res;
      });
        
    });
});

//create new usertype
app.post('/userTypes', async function (req, res) {
    const body = req.body;
    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'users'
    });
    connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    connection.query(`INSERT INTO usertypes (userTypeId, userTypeName, userTypeDescription, status) VALUES (${body.userTypeId}, '${body.userTypeName}', '${body.userTypeDescription}', '${body.status}') `, function (err, result, fields) {
        if (err) throw err;
        res.status(200).send('Record Inserted Successfully')
      });
        
    });
});



app.listen(3001, () => console.log('listening on port 3001'))