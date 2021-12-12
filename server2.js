const express = require('express');
const app = express();
const port = 4000;

function middleware1(req, res, next) {
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('foo');
        }, 300);
      });
      
    myPromise
        .then(handleResolvedA, handleRejectedA)
    
}

function middleware2(req, res, next) {
    console.log('middleware2')
    next();
}

app.get('/', middleware1, middleware2, (req, res, next) => {
    res.send("home")
})

app.listen(port, function() {
    console.log('Listening on port http://localhost:' + port);
})