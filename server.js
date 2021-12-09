const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const AccountModel = require('./model/accountModel')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PAGE_SIZE = 2;

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/user', (req, res, next) => {
    let page = req.query.page
    if(page) {
        page = parseInt(page)
        let soTrangBoQua = (page - 1) * PAGE_SIZE
        AccountModel.find()
        .skip(soTrangBoQua)
        .limit(PAGE_SIZE)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json("Loi server")
        })
    }
    else{
        AccountModel.find()
        .then(data=> {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json("Loi database")
        })
        
    }
})

app.post('/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    AccountModel.findOne({username})
    .then(data =>{
        if(data) {
            res.json('User nay da ton tai')
        }
        else {
            return AccountModel.create({username, password})
        }
    })
    .then (data => res.json('Tao tai khoan thanh cong'))
    .catch(err => res.send('have error'))
})

app.post('/signin', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    AccountModel.findOne({username, password})
    .then(data => {
        if(data) {
            res.json('Dang nhap thanh cong')
        }
        else {
            res.status(400).json('Tai khoan hoac mat khau khong chinh xac')
        }
    })
    .catch(err => res.status(500).json('have error on server'))
})

app.listen(port, function() {
    console.log('Listening on port http://localhost:' + port);
})