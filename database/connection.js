const mongoose=require("mongoose");

// process.env.MONGO_URI

module.exports = mongoose.connect("mongodb+srv://sumit:sumit123@cluster0.hgwri.mongodb.net/bankDB2?retryWrites=true&w=majority").then(()=>{
    console.log("db connected");
}).catch(err=>{
    console.log("error in db");
});

