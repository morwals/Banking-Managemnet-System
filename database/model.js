const mongoose=require("mongoose");

const cstmr= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    account:{
        type:String,
        required:true,
        unique:true
    },
    amount:String
});

const transaction=mongoose.Schema({
    sender:String,
    reciever:String,
    transAmnt:String
});


const CUSTOMER_MODEL=mongoose.model("COSTURER",cstmr);
const TRANSACTION =mongoose.model("TRANSACTION",transaction);

module.exports={
    CUSTOMER_MODEL,
    TRANSACTION
}
