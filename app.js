require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.json());

app.set("view engine","ejs");
app.use(express.static("public"));

const connection=require("./database/connection");

const model=require("./database/model");
const { use } = require("express/lib/application");


app.get("/",function(req,res){

    res.render("index");
    
});

app.get("/customers",function(req,res){
    
    model.CUSTOMER_MODEL.find().then(data=>{
        // console.log(data);
        res.render("customers",{customers:data});
    });
});

app.get("/add-customers",function(req,res){
    res.render("addCustomer");
});

app.get("/transactions",function(req,res){

    model.TRANSACTION.find().then(data=>{
        // console.log(data);
        res.render("transactions",{trasactions:data});
    });
});

app.get("/pay",function(req,res){

    model.CUSTOMER_MODEL.find().then(data=>{
        // console.log(data);
        res.render("pay",{customers:data});
    });
});

app.get("/paymentdone",function(req,res){
    res.send("transaction done");
})

app.post("/pay",async function(req,res){

    var data=JSON.parse(req.body.o);
    console.log(req.body.o);
        
    var sender_acc=data.account_se;
    var recievr_acc=data.account_re;
    var amountsend=data.amounttosend;
    
    var amountinsend = await model.CUSTOMER_MODEL.findOne({account:sender_acc});

    var amountinrec= await model.CUSTOMER_MODEL.findOne({account:recievr_acc});
    console.log("amount send: "+amountsend);
    console.log("sender amount: "+amountinsend.amount);

    var final_amount_of_sender=parseInt(amountinsend.amount)-parseInt(amountsend);
    var final_amount_of_reciever=parseInt(amountinrec.amount)+parseInt(amountsend);

    console.log("final amnt of sender" + final_amount_of_sender);

    //update customers amount
    
    await model.CUSTOMER_MODEL.findOneAndUpdate({account:sender_acc},{$set:{amount:final_amount_of_sender}},function(err,data){
        if(err){
            console.log(err);
        }else{
            // console.log(data);
        }
    }).clone();

    await model.CUSTOMER_MODEL.findOneAndUpdate({account:recievr_acc},{$set:{amount:final_amount_of_reciever}},function(err,data){
        if(err){
            console.log(err);
        }else{
            // console.log(data);
        }
    }).clone();

    //transaction history saved
    var transc=new model.TRANSACTION({
        sender:amountinsend.name,
        reciever:amountinrec.name,
        transAmnt:amountsend
    });

    transc.save(transc).then(data=>{
        console.log("transaction done");
    }).catch(err=>{
        console.log("error in transaction in mongodb");
        console.log(err);
    });
})

app.post("/",function(req,res){

    if(!req.body){
        res.status(400).send({message:"body can't be empty"});
    }

    const user=new model.CUSTOMER_MODEL({
        name:req.body.name,
        account:req.body.account,
        amount:req.body.amount
    });
    console.log(user);
    
    user.save(user).then(data=>{
        console.log("data added");
        res.redirect("/");
    }).catch(err=>{
        console.log("error in saving data in mongodb");
        console.log(err);
    });
});

let port=process.env.PORT;

if(port==null || port==""){
    port=3000;
}

app.listen(port);