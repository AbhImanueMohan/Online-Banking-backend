//database connection with node

//1 : import mongoose
const mongoose =require('mongoose');

//Define connection string
mongoose.connect('mongodb://localhost:27017/BankServer')

//3 : Create mode and schema 

//model in express is same as mongodb collection
const User = mongoose.model('User',
{
   username:String,
   acno:Number,
   password:String,
   balance:Number,
   transaction:[]
   
});

//export model 
module.exports ={
    User
}
