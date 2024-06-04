const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email:{
            type: String,
            unique: true
        },
        password:{
            type:String
        },
        city:{
            type:String
        }
    },
    { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
