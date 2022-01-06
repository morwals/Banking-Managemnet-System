require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://"+ process.env.USER + ":" + process.env.PASS + "@cluster0.sacpx.mongodb.net/ShubhamSangawat?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Database Connected");
});

const bankSchema = {
    name:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        required:true
    }
};

const transaction = {
    sender:{
        required:true,
        type:String
    },
    receiver:{
        required:true,
        type:String
    },
    tAmount:Number
}

const Customer = mongoose.model('Customer',bankSchema);
const Transaction = mongoose.model('Transaction',transaction);

// Customer.insertMany([
//     {name:'Amit', email:'amithun@gmail.com', balance:12000},
//     {name:'Vishal Rajput', email:'rajputvishal@gmail.com', balance:2000},
//     {name:'Shubham', email:'sangawatshaab@gmail.com', balance:92000},
//     {name:'Krupa', email:'khurpa@gmail.com', balance:7000},
//     {name:'Gaurav', email:'gaurav2121@gmail.com', balance:50000},
//     {name:'Ria', email:'riya123@gmail.com', balance:9000},
//     {name:'Hemanshu', email:'hmaansu@gmail.com', balance:70000},
//     {name:'Sumit Kumar', email:'sumitplwl@gmail.com', balance:12000},
//     {name:'Sachin', email:'sachinplwl@gmail.com', balance:1200},
//     {name:'Sunny Chauhan', email:'schauhan@gmail.com', balance:15000},

// ]).then(()=>{
//     console.log("Data Inserted");
// }).catch((error)=>{
//     console.log(error);
// })



app.get('/',(req,res)=>{
    res.render('index');
})


app.get('/customers',(req,res)=>{
    Customer.find((err,customers)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('customers',{name:'View All Customers', customers:customers});
        }
    })
})

app.get('/transactions',(req,res)=>{
    Transaction.find((err,transactions)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('transactions',{ transactions:transactions});
        }
    })
})

app.post('/transactions',async (req,res)=>{
    
    let ele = await Customer.findOne({email:req.body.receiver});

    let senderName = req.body.sender;
    let receiverName = ele.name;
    let transferAmount = req.body.amount;

    let receiverBlnce = parseInt(ele.balance) + parseInt(transferAmount);
    let blnce = req.body.balance;

    const transact = new Transaction({
        sender:senderName,
        receiver:receiverName,
        tAmount:transferAmount
    })
    await transact.save();

    try{
        await Customer.findOneAndUpdate({name:senderName},{$set:{balance:blnce-transferAmount}},async function(err,ele){
            if(err){
                console.log(err);
            }
            else{try{
                    await Customer.findOneAndUpdate({name:receiverName},{$set:{balance:receiverBlnce}},function(err,ele){
                        if(err){
                            console.log(err);
                        }
                    }).clone()
                }catch(err){
                    console.log(err);
                }
            }
        }).clone()
    }catch(err){
        console.log(err);
    }
    try{
        await Transaction.find((err,transactions)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render('transactions',{ transactions:transactions});
            }
        }).clone()
    }catch(err){
        console.log(err);
    }
})

app.post('/pay',(req,res)=>{
    let emailOfSender= req.body.sender;
    Customer.find((err,customers)=>{
        if(err){
            console.log(err);
        }
        else{
            Customer.findOne({email:emailOfSender},function(err,ele){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('pay',{name:ele, customers:customers});
                }
            })
        }
    })
    
    
    
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is Running.");
})