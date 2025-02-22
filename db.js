const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
// async function main() {
//     await mongoose.connect('mongodb+srv://hiteshchangrani:admin@cluster0.c0vwrvt.mongodb.net/'); 
// }

const connectDb = async () => {
    try {
      await mongoose.connect(dotenv?.parsed?.db, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000 // 45 seconds
      });
      console.log("Server is connected to the database");
    } catch (err) {
      console.log("Server is not connected to the database", err.message);
      console.log(dotenv);
    }
  };
  connectDb();

const userSchema = new mongoose.Schema({
    username: String,
    password: String,   
    firstName: String,
    lastName: String,
})

const accountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}