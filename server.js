const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const AccountModel = require('./model/accountModel')
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res, next) => {
    res.redirect('/login')
})

app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/login.html'))
})

app.post('/login', (req, res, next) => {
    // res.redirect('/private')
    const username = req.body.username;
    const password = req.body.password;
    AccountModel.findOne({username, password})
    .then(data =>{
        if(data) {
            const token = jwt.sign({_id: data._id}, 'mk', {expiresIn: "30m"})
            res
            .status(201)
            .cookie('token', token)
            .redirect(301, '/student')
        }
        else {
            res.status(400).send("username or password incorrect")
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
})


app.post('/logout', (req, res, next) => {
    res.clearCookie('token').redirect(301, '/login')
})

// app.get('/private', checklogin, (req, res, next) => {
//     res.send('welcome')
// })

function checklogin(req, res, next) {
    try {
        const token = req.cookies.token;
        const _id = jwt.verify(token, 'mk');

        AccountModel.findOne({ _id })
            .then(data => {
                if (data) {
                    req.data = data;
                    next();
                }
                else {
                    res.status(500).send('login data invalid');
                }
            })
            .catch(err => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(400).redirect('/login');
    }
}

function checkStudent(req, res, next) {
    const role = req.data.role;
    if(role === 'student' || role === 'teacher' || role === 'manager') {
        next()
    }
    else{
        res.send('NO PERMITTION')
    }
}
function checkTeacher(req, res, next) {
    const role = req.data.role;
    if(role === 'teacher' || role === 'manager') {
        next()
    }
    else{
        res.send('NO PERMITTION')
    }
}
function checkManager(req, res, next) {
    const role = req.data.role;
    if(role === 'manager') {
        next()
    }
    else{
        res.send('NO PERMITTION')
    }
}

app.get('/student', checklogin, checkStudent, (req, res, next) => {
    res.sendFile(path.join(__dirname, 'logout.html'))
})
app.get('/teacher', checklogin, checkTeacher, (req, res, next) => {
    res.send('teacher')
})
app.get('/manager', checklogin, checkManager, (req, res, next) => {
    res.send('manager')
})


app.listen(port, function() {
    console.log('Listening on port http://localhost:' + port);
})
