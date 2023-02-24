const { Router } = require("express")
const UserCollection=require("../models/database").Users;
const authmiddleware=require("../middleware/authmiddleware");

// const express=require("express")
const router=Router();

const authcontroller=require("../Controllers/authcontroller");
router.get("/register",authcontroller.Get_Register);
router.post("/register",authcontroller.Post_Register);
router.get("/login",authcontroller.Get_login);
router.post("/login",authcontroller.Post_login);
router.get("/otp_verification/:user_id",authmiddleware.get_token,authcontroller.OTP_Verification_get);
router.post("/otp_verification/:user_id",authmiddleware.get_token,authcontroller.OTP_Verification_post);
router.get("/OTP_FAIL/:user_id",authmiddleware.get_token,authcontroller.OTP_Verification_fail);
router.get("/UserProfile/:user_id",authmiddleware.get_token,authcontroller.User_profile);
router.get("/logout",authmiddleware.get_token,authcontroller.Logout_User);


module.exports=router;
// Router