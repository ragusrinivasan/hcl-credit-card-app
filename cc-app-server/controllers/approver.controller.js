const approverModel = require("../models/approver.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.loginApprover = async (req,res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return  res.status(400).json({message: "Email and Password are required"});
        }
        const approver = await approverModel.findOne({email})
        if(!approver){
            return res.status(401).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, approver.password);
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Password"});
        }
        const token = jwt.sign(
            {approverId: approver._id, role: approver.role},
            process.env.JWT_SECRET,
            {expiresIn: "2h"}
        );
        res.status(200).json({token, approver, message: "Login Successful"});
    }catch(err){
        res.status(500).json({message: err.message || "Internal Server Error"});
    }
}