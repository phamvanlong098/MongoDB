const express = require('express');
const app = express();
const port = 4000;
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const AccountModel = require('./model/accountModel')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'mk',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 30*60*1000,
        expire: 30*60*1000 + Date.now(),
    }
}))

app.get('/abc', function(req, res, next) {
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
})

app.get('/', (req, res, next) => {
    res.redirect('/login')
})

app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/login.html'))
})

app.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    AccountModel.findOne({username, password})
    .then(data =>{
        if(data) {
            req.session.data = data;
            console.log(req.session.data)
            res.status(300).redirect('/student')
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
    req.session.destroy()
    res.status(300).redirect('/')
})


function checklogin(req, res, next) {
    if(req.session.data) {
        next()
    }
    else {
        res.status(300).redirect('/login')
    }
}

function checkStudent(req, res, next) {
    const role = req.session.data.role;
    if(role === 'student' || role === 'teacher' || role === 'manager') {
        next()
    }
    else{
        res.send('NO PERMITTION')
    }
}
function checkTeacher(req, res, next) {
    const role = req.session.data.role;
    if(role === 'teacher' || role === 'manager') {
        next()
    }
    else{
        res.send('NO PERMITTION')
    }
}
function checkManager(req, res, next) {
    const role = req.session.data.role;
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