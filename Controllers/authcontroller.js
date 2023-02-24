// const express=require("express")
const UserCollection = require("../models/database").Users;
const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { request } = require("https");
const jsonwebtoken=require("jsonwebtoken");

function get_token(id){
    return jsonwebtoken.sign({id},"SecretKeyisthere",{expiresIn:3*60*60*1000*60})
       
}

module.exports = {

    Get_Register: (request, response) => {

        response.render("register", { error: 0, message: null });
    },


    Post_Register: async (request, response) => {
        // response.render("login");
        User_data = request.body;
        if (request.body.password != request.body.cpassword) {

            response.render("register", { error: 1, message: "Confirm Password is not same as Password" });

        }
        else {
            Check_User_Already = await UserCollection.find({ Email_id: User_data.email });
            if (Check_User_Already.length != 0) {
                response.render("register", { error: 1, message: "User with Email id Already Exist" });
            }
            else {
                const Hash_password = bcryptjs.hashSync(User_data.password, 10);
                const new_user = new UserCollection({
                    Name: (User_data.name).trim(),
                    Email_id: ((User_data.email).toLowerCase()).trim(),
                    Password: (Hash_password).trim()
                });
                Result = await new_user.save();
                if (Result) {
                    
                    let Token_id=get_token(Result._id);
                    // request.setcookie()
                    response.cookie("ID",Token_id,{secure:true,httpOnly:true});
                    const Today=new Date().toLocaleDateString()
                    await UserCollection.updateOne({ _id: Result._id}, { $set: { LastActive: Today } });
                    response.redirect(`/otp_verification/${Result._id}`,);
                }
                else {
                    response.redirect("/register");
                }

            }





        }
    },
    Get_login: (request, response) => {

        response.render("login", { error: 0, message: null });
    },
    Post_login: async(request, response) => {
        // response.render("login");
        console.log(request.body);
        Check_User_Already = await UserCollection.find({ Email_id: (request.body.email).toLowerCase()});
        // response.send(Check_User_Already);
        if(Check_User_Already.length==1){
            const RealPassword=Check_User_Already[0].Password;
            const CheckPassword=bcryptjs.compareSync(request.body.password,RealPassword);
            console.log(CheckPassword);
            if(CheckPassword){
                // response.send("User Exist");
                const Today=new Date().toLocaleDateString()
                
                let Token_id=get_token(Check_User_Already[0]._id);
                // request.setcookie()
                response.cookie("ID",Token_id,{secure:true,httpOnly:true});
                await UserCollection.updateOne({ _id: Check_User_Already[0]._id}, { $set: { LastActive: Today } });
                 
                 response.redirect(`/UserProfile/${Check_User_Already[0]._id}`);

            }
            else{
                response.render("login", { error: 1, message: "Entered Incorrect Password" });
                
            }
        }
        else{
            // response.send("User not Exist")
            response.render("login", { error: 1, message: "User Doesnot Exist . Please Register" });

        }


    },
    OTP_Verification_get: async (request, response) => {


        // response.send(request.params);
        
        let random_number = ""
        for (i = 0; i < 4; i++) {
            random_number += Math.floor(Math.random() * 10);
        }
        OTP = {
            user_id: request.params.user_id,
            number: random_number
        }

        user_data = await UserCollection.find({ _id: request.params.user_id });
        if (user_data[0].OTP == null && user_data[0].Verified==false) {
            await UserCollection.updateOne({ _id: request.params.user_id }, { $set: { "OTP": random_number } });
        }
        user_data = await UserCollection.find({ _id: request.params.user_id });
        // response.send(user_data);
        response.render("otp_verification", { id: request.params.user_id });
        // response.send(OTP);

    },
    OTP_Verification_post: async (request, response) => {
        // response.send(request.params);

        user_data = await UserCollection.find({ _id: request.params.user_id });
        // response.send(user_data);
        console.log(user_data[0].OTP, request.body.otp);
        if (parseInt(user_data[0].OTP) == request.body.otp) {
            // response.send("Verified");
            await UserCollection.updateOne({ _id: request.params.user_id }, { $set: { "Verified": true } });
            UserCollection.updateOne({ _id: request.params.user_id },{$unset:{"OTP":1}})

            response.redirect(`/UserProfile/${request.params.user_id}`);

          }
        else {
            response.send("NOOOOOOO")

        }
        // response.render("otp_verification",{id:request.params.user_id});
        // response.send(OTP);

    },
    OTP_Verification_fail:async(request,response)=>{
        // response.send(request.params.user_id);
        await UserCollection.updateOne({ _id: request.params.user_id }, { $set: { "OTP": null } });
        response.clearCookie("ID");
        // response.render("login", { error: 1, message: "Verification Failed . Verify by Login " });
        response.redirect("/logout")


    },
    User_profile:async(request,response)=>{
        // response.send(request.params.user_id);
        user_data = await UserCollection.find({ _id: request.params.user_id });
        // cons
        response.render("UserProfile",{list:user_data})


    },
    Logout_User:async(request,response)=>{
        response.clearCookie("ID");
        response.redirect("/login");
    }
}