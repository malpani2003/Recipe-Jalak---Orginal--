const { rejects, fail } = require('assert');
const mongoose = require("mongoose");
const express = require('express')
const app = express();
const https = require("https");
const { resolve } = require('path');
const Category_Collection = require("./models/database").categories;
const Item_Collection = require("./models/database").Items;
const UserCollection=require("./models/database").Users;
const authmiddleware=require("./middleware/authmiddleware");
const authroutes=require("./authroutes/authroutes");
const { v4 } = require('uuid');
const { request } = require('http');
const { response } = require('express');
const uuid = require("uuid").v4;
const cookie_parser=require("cookie-parser");
const { totalmem } = require('os');

// console.log(categories)
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.get("*",authmiddleware.Get_user_details);
app.get('/', async (request, response) => {


    //   res.send('Hello World!')
    // res.render("index");
    Category_data = await Category_Collection.find()
    // response.send(Category_data);
    random_food = {
        "_id": "63a69ebdc066299036ef69b5",
        "Category_Id": "9c8257d1-3756-45e6-9b19-59ffc3cead78",
        "Category_Name": "Indian",
        "Category_Img": "https://www.themealdb.com/images/category/beef.png",
        "Category_Desc": "Best food in india",
        "__v": 0
    };
    
    response.render("index", { list: Category_data, random: random_food });
    
    
    
})


app.get("/Category_add", (request, response) => {
    response.render("Add_category");
});

app.post("/Category_add", async (request, response) => {
    
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
});


app.get("/add_food", async (request, response) => {
    Category_data = await Category_Collection.find();
    // console.log(Category_data);
    response.render("Add_food", { category: Category_data });
    
    
});
// app.get("/sd",async(request,response)=>{
    async function get_category_name(id){
        let Category_data=await Category_Collection.find({Category_Id:id});
        // response.send(Category_data);
        return Category_data[0]["Category_Name"];
        
    }
    
    app.post("/add_food", async (request, response) => {
        
        Food_data = request.body;
        console.log(Food_data);
        // Category_data = await Item_Collection.find({ Food_Category_ID: ((Food_data["food_category_id"]).trim()) });
        // console.log(Category_data);
        let Instruction=(Food_data["food_Instruction"]).trim();
        let Ingredient=(Food_data["Food_Ingrediants"]).trim();
        
        // console.log(Instruction.split("#$#"));
        const new_recipe = new Item_Collection({
            Food_id: v4(),
            Food_Name: (Food_data["food_nm"]).trim(),
            Food_Img: (Food_data["link"]).trim(),
            Preview_Img:(Food_data["preview_image"]).trim(),
            Food_Category_ID: (Food_data["food_category_id"]).trim(),
            ptime: (Food_data["ptime"]).trim(),
            ctime: (Food_data["ctime"]).trim(),
            Food_Area: (Food_data["foodArea"]).trim(),
        IsDrink:(Food_data["Drink"]).trim(),
        Food_Instruction:(Instruction.split("\n")),
        Food_Ingrediants:(Ingredient.split("\n")),
        Difficult:(Food_data["Difficuilt"]).trim(),
        Food_Desc: ((Food_data["food_desc"]).trim()).split("\n")

    });
    result = await new_recipe.save();
    if (result) {
        //  response.redirect("/#category");
        // response.send(result);
        response.redirect(`meal/${result["Food_id"]}`);
    }
    else {
        response.json({ "Error": "Cannot Added" });
    }
    //   new_recipe.save();
    //   response.send(request.body);
});

app.get("/category/:category_id", async (request, response) => {
    let categoryid = (request.params.category_id).trim();
    console.log(categoryid);
    // let Category_data=await Category_Collection.find({Category_Id:categoryid});
    // console.log(Category_data);
    Category_data = await Item_Collection.find({ Food_Category_ID: categoryid });
    // response.send(Category_data);
    let value = await get_category_name(categoryid);
    response.render("category_show", { list: Category_data, category: value });
});
app.get("/meal/:food_id",authmiddleware.get_token, async (request, response) => {
    let food_id = (request.params.food_id).trim();
    Food_data = await Item_Collection.find({ Food_id: food_id });
    Category_data = await Item_Collection.find({ Food_Category_ID: Food_data[0]["Food_Category_ID"] });
    let Category_name_item = await get_category_name(Food_data[0]["Food_Category_ID"]);
    // console.log(Food_data[0], Category_data);
    len = Category_data.length;
    let similar_array=[]
    let Total=len<4?len:4;
    for (let index = 0; index <Total; index++) {
        let random_num=Math.floor(Math.random() * len);
        let item = Category_data[random_num];
        // console.log(item);
        // console.log(similar_array.includes(item))
        if (similar_array.includes(item)) {
            index = index - 1;
        }
        else {
            similar_array.push(item);
        }
        // console.log(similar_array);
    }
    
    // console.log(similar_array);
    
    response.render("new_meal_detail", { meal_details: Food_data[0], similar_item: similar_array,category:Category_name_item })
    
    // response.json(Food_data);
    
})
app.get("/area",async(request,response)=>{
    // response.send("Area");
    Food_data = await Item_Collection.find({});
    Food_Area=[]
    Food_data.forEach(ele=> {
        console.log("Elemenet is",ele);
        let Area=ele.Food_Area;
        if(!(Food_Area.includes(Area))){
            Food_Area.push(Area);
        }
        
    });
    response.render("sort_area",{list:Food_Area})
    // response.send(Food_Area);
    
    
    
});

app.get("/area/:country",async(request,response)=>{
    // response.send("Area");
    Food_data = await Item_Collection.find({Food_Area:request.params.country});
    response.render("category_show", { list: Food_data, category: request.params.country });
    
    
});
app.get("/meal/:meal_id/like",async(request,response)=>{
    Food_id=request.params.meal_id;
    Food_data = await Item_Collection.find({ Food_id: Food_id });
    User_data = await UserCollection.find({_id:(response.locals.user._id)});

    Liked=Food_data[0].Like;
    User_likes=User_data[0].LikedRecipe;
    Found=0;
    Liked.forEach(key => {
        // console.log((response.locals.user._id).toString())
        if(key===((response.locals.user._id).toString()))
        {
            Found=1
        }
        
    });
    // console.log(Found)
    if(Found==0){
        Liked.push(((response.locals.user._id).toString()));
        User_likes.push(Food_id);
        await Item_Collection.updateOne({Food_id:Food_id},{$set:{"Like":Liked}});
        await UserCollection.updateOne({_id:(response.locals.user._id)},{$set:{"LikedRecipe":User_likes}});
    }
    // response.send(Liked)
    // response.send(response.locals.user);
    response.redirect(`/meal/${Food_id}`);

    



})
// app.get("/register",

app.use("/",authroutes);

app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("*", (req, res) => {
    res.render("404");
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})