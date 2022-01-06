const mongoose=require("mongoose");

module.exports = mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected");
}).catch(err=>{
    console.log("error in db");
});

