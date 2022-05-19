const express = require('express');

//existing routes
const authRoutes = require('./routes/auth-route');
const groceryRoutes = require('./routes/grocery-route');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// basic CORS setup
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*'); //allows all links to access the server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); //allows the methods GET POST PUT PATCH and DELETE
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, Verification, X-Requested-With'); // allows Content-Type & Authorization headers
    next();
});

//route used for authorizations
app.use(authRoutes);

//route used for groceries
app.use('/grocery', groceryRoutes);

app.get('*', (req, res) => {
    res.send("Page not found");
})
//default error handler
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
      });
    });
    
module.exports = app;