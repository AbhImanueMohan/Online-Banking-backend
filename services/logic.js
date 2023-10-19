//Create logic for api call

//import db
const db = require('./db')

//import jwt token
const jwt = require('jsonwebtoken')

//Register logic
const register =(acno,username,password)=>{
    console.log("Inside the register Function");

    return db.User.findOne({acno}).then((response)=>{
        console.log(response);

        if(response){
            //if acno already registered
               return{
                statusCode:401,
                message:"User already exist"
               }
        }
        else{
            //if acno is not present in mongodb then create a new one
            const newUser = new db.User({
                acno,
                username,
                password,
                balance:2000,
                transaction:[]
            })
            //to store new user in mongodb
            newUser.save()

            //send response to the client
            return{
                statusCode:200,
                message:"User registered successfully"
            }
        }
    })
}

//login logic
const login=(acno,password)=>{
    console.log("inside login function");
    return db.User.findOne({acno,password}).then((result)=>{
if(result){ //acno is presnt in  mongodb
    //generation of token
    const token = jwt.sign({
        loginAcno:acno
    },'superkey23')
return{//response sends to the client
    statusCode:200,
    message:"Login Successful",
    currentUser:result.username,
    token,
    currentAcno:acno
}
}  
else{
//acno is not present  in mongodb
return{
    statusCode:401,
    message:"Invalid data"
}
}
  })
}
//get balance
const getBalance= (acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){  //acno is present in mongodb
            return{
          
            statusCode:200,
            balance:result.balance
            }

        }

       
        else{  //acno is not present in mongodb
            return{
                statusCode:401,
                message:"Invalid Account"
            }
        }
    })
}
 //fund transfer
 const fundTransfer=(fromAcno,fromAcnoPswd, toAcno, amt)=>{
          //convert amt to number
          let amount = parseInt(amt)
          //check fromAcno in mongodb
          return db.User.findOne({acno:fromAcno,password: fromAcnoPswd}).then((debit)=>{
            if(debit){
                //to check toAcno in mongodb
                return db.User.findOne({acno:toAcno}).then((credit)=>{
                    if(credit){
                        if(debit.balance>=amount){
                            debit.balance-=amount
                            //to update transaction details in transaction[]
                            debit.transaction.push({
                                type:'Debit',
                                amount,
                                fromAcno,
                                toAcno
                            })
                            //save changes in mongodb
                            debit.save()
                            //update in toAcno in transaction
                            credit.balance+=amount
                            credit.transaction.push({
                                type:'Credit',
                                amount,
                                fromAcno,
                                toAcno
                            })
                            //save changes in mongodb
                             credit.save()
                             //send response back to client
                             return{
                                statusCode: 200,
                                message:"Your Transacion is Successfull..."
                             }
                        }
                        else{
                            return{
                                statusCode:401,
                                message:"Insufficient Balance"
                            }
                        }

                    }
                    else{
                        return {
                            statusCode:401,
                            message:"Invalid credit Account Number"
                        }
                    }
                });
            }
            else{
                return {
                    statusCode:401,
                    message:"Invalid debit Account Number"
                }
            }
          })
 }
//get transaction details
const getTransaction=(acno)=>{
//check acno in mongodb
return db.User.findOne({acno}).then((result)=>{
    if(result){//complete details of particular acno
        return{//send transaction details to client side
            statusCode:200,
            transaction:result.transaction
        }
    }
    else{//acno is not found in mongodb
        return{
            statusCode:401,
            message:"Invalid Transaction Number"
        }
    }
})
}

//delete user account
const deleteUserAccount =(acno)=>{
//delete user account from mongodb
return db.User.deleteOne({acno}).then((result)=>{
    return{
        statusCode:200,
        message:"Your Account has been deleted"
    }
})
}

module.exports ={

    login,
    register,
    getBalance,
    fundTransfer,
    getTransaction,
    deleteUserAccount
}