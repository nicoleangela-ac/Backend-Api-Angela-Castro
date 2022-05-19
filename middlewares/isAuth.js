const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    //check if the Authorization header has a value
    if(!authHeader){
        const error = new Error('Access Denied! No Token Provided.');
        error.statusCode = 401;
        throw error;
    }

    //get the token from the frontend
    const token = req.get('Authorization').split(' ')[1];

    let decodedToken;

    try{
      //decode and verify the JWT
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(err){
        err.statusCode = 400;
        throw err;
    }

    //check if there is no token or if the token is null
    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    //set the userId from the token
    req.userId = decodedToken.userId;

    next();
};
