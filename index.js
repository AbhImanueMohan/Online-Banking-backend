//Backend for Bank App
//code to create server using express



//1 : import express
const express = require('express');

//4 : import cors
const cors = require('cors');

//import logic
const logic = require('./services/logic')

//import jwt token
const jwt = require('jsonwebtoken')

//3 :create server using express
const server =express();

//5 : use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6 :  Parse json data to js in server app 
server.use(express.json());

//3 : setup port for server
server.listen(5000,()=>{
    console.log("server istening on port: 5000");
});

//7 : Resolving client requests
//api call 
server.get('/',(req,res)=>{
    res.send('client get request')
})

//Bank app Requests

//Application Specific Middleware
// const appMiddleware = (req, res, next) =>{
//     console.log(' Application Specific Middleware');
//     next();
// }
// server.use(appMiddleware)

//Router Specific Middleware
const routerMiddleware =(req, res, next) =>{
    console.log('Router specific Middleware');
   
    try{
        const token = req.headers['verify-token']; //token
        const data = jwt.verify(token,'superkey23')
         console.log(data);// to get login acno - { loginAcno: '0', iat: 1687337960 }
         req.currentAcno=data.loginAcno
        next()
    }
    catch{
        res.status(404).json({message:"Please Login First"})

    }
    
  
}

//register api call
server.post('/register',(req,res)=>{
    console.log('Inside the register');
    console.log(req.body);
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
 // res.send('register request recieved');
 res.status(result.statusCode).json(result)
    })
   
})

//login
server.post('/login',(req,res)=>{
    console.log("inside login api");
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//balance enquiry
server.get('/balance/:acno',routerMiddleware,(req,res)=>{
    console.log("Balance api");
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client
    })
})
//fund transfer
server.post('/fundtransfer',routerMiddleware,(req,res)=>{
    console.log('Inside fund transfer Api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client
    })
})

//get Transaction 
server.get('/transaction',routerMiddleware,(req, res)=>{
    console.log("Inside the transaction");
    logic.getTransaction(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client

    })
})

//delete user account
server.delete('/deleteAccount',routerMiddleware,(req, res)=>{
    console.log('inside the delete api call');
    logic.deleteUserAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client

    })
})