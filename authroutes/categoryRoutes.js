const { Router } = require("express")
const Category_Collection = require("./models/database").categories;
const Item_Collection = require("./models/database").Items;
// const authmiddleware=require("../middleware/authmiddleware");

// const express=require("express")
const router=Router();

const authcontroller=require("../Controllers/categoryControllers");
router.get("/Category_add",authcontroller.Add_Category_GET);
router.post("/Category_add",authcontroller.Add_Category_POST);
router.get("/category/:category_id",authcontroller.Get_login);

module.exports=router;
// Router