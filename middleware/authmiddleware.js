const UserCollection = require("../models/database").Users;
const { response } = require("express");
const jwt=require("jsonwebtoken");


// Check is user login or not if not login then cannot see protected pages

const get_token=(req,res,next)=>{

    const Token_id=req.cookies.ID;
    
    if(Token_id){
        jwt.verify(Token_id,"SecretKeyisthere",(err,verifiedtoken)=>{
            if(err){

                console.log(err.message);
                res.redirect("/login");
            }
            else{
                console.log(verifiedtoken);
                next();

            }
        })

    }else{
        res.redirect("/login");
    }
}


const Get_user_details=(request,response,next)=>{
    const Token_id=request.cookies.ID;
    
    if(Token_id){
        jwt.verify(Token_id,"SecretKeyisthere",async(err,verifiedtoken)=>{
            if(err){

                console.log(err.message);
                response.locals.user=null;
                next();
            }
            else{
                // console.log(verifiedtoken);
                let user=await UserCollection.findById(verifiedtoken.id);
                // console.log(user)
                response.locals.user=user;
                next();

            }
  
        })

    }else{
        response.locals.user=null;
        next();
        // res.redirect("/login");
    }
}


module.exports={
    get_token,Get_user_details
}