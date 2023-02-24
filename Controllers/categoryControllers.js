const express=require("express");
const Category_Collection = require("./models/database").categories;
const Item_Collection = require("./models/database").Items;


module.exports={

    Add_Category_GET: (request, response) => {
        response.render("Add_category");
    },
    Add_Category_POST:async (request, response) => {
    
        const new_category = new Category_Collection({
            Category_Id: v4(),
            Category_Name: (request.body.Category_nm).trim(),
            Category_Img: (request.body.Category_img).trim(),
            Category_Desc: (request.body.Categorgy_desc).trim()
        });
        result = await new_category.save();
        if (result) {
            response.redirect("/#category");
        }
        else {
            response.json({ "Error": "Cannot Added" });
        }
    },

}