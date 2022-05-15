const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config')

const dotenv = require('dotenv');
dotenv.config();

let refreshTokens = []

exports.login = async (req, res, next) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
    
        //see if a user exists
        const user = await User.findOne({email: email});

        //if the user doesn't exist, throw an error
        if(!user){
            const error = new Error('User could not be found.');
            error.statusCode = 404;
            throw error;
        }

        //compare the hashed password
        const isEqual = await bcrypt.compare(password, user.password);

        //if the password does not match, throw an error
        if(!isEqual){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

        //create a jwt token
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {expiresIn:  process.env.JWT_TOKEN_LIFE});
        const refreshToken = jwt.sign({ userId: user._id.toString() },  process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE})
        refreshTokens.push(refreshToken)
        console.log(refreshTokens)
        //return a response with the token, userId, expiration and Role
        const response = {
            "token": token,
            "refreshToken" :refreshToken,
            "permissionLevel": user.permissionLevel,
            "userId": user._id.toString(),
            "name": user.firstname
        }
        res.status(200).json(response);

      } catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
};

exports.logout = async (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.status(204);
};

exports.registerUser = async (req, res, next) => {
    try {
        const postData = req.body;

        userEmail = await User.findOne({email: postData.email});
        if(userEmail){
            const error = new Error("Email already exists");
            error.statusCode = 400;
            throw error;
        }
         
        //hash the password with a salt of 12
        const hashedPassword = await bcrypt.hash(postData.password, 12);
    
        const user = {
            "firstname": postData.firstname,
            "lastname": postData.lastname,
            "email" : postData.email,
            "password" : hashedPassword,
            "permissionLevel" : postData.permissionLevel
        }
    
        const newUser = new User(user);
        await newUser.save()
        const response = {
            message:'User Created!',
            user : user 
        }
        res.status(200).json(response);

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const postData = req.body;
        const password = postData.password;
        const userID = req.userId;

        //hash the password with a salt of 12
      if(password){
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findOneAndUpdate({_id: userID}, {password: hashedPassword}, {new: true});
      }
      const userInfo = {
        "firstname": postData.firstname,
        "lastname": postData.lastname,        
        "permissionLevel" : postData.permissionLevel
      }
     const userUpdated =  await User.findOneAndUpdate( {_id : userID},userInfo, {new: true});

      //return a response with a code of 200
      res.status(200).json({
        message:'User Updated!',
        userUpdated : userUpdated 
      });
        
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {

        const userId = req.userId;
        const deleteUserID = req.body.userId;
        const user = await User.findById({ _id: userId});

        if(user.permissionLevel == 1){
            const error = new Error("NOT AUTHORIZED!");
            error.statusCode = 401;
            throw error;
        }

        if(userId == deleteUserID){
            const error = new Error("ACTION INVALID! CANNOT DELETE SELF ACCOUNT");
            error.statusCode = 400;
            throw error;
        }

        await User.deleteOne({ _id: deleteUserID }); 
        //return a response with a code of 200
        res.status(200).json({
            message:'User Deleted!'
        });


    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.token = async (req, res, next) => {
    try {
        console.log(refreshTokens)
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        try{
            //decode and verify the JWT
              decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
          }
          catch(err){
              err.statusCode = 500;
              throw err;
          }
          const accessToken = jwt.sign({ userId: decodedToken.userId.toString() }, process.env.JWT_SECRET, {expiresIn:  process.env.JWT_TOKEN_LIFE});
          res.json({ accessToken: accessToken })

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }

}