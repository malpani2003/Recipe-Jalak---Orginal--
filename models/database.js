const mongoose = require("mongoose");
mongoose.set("strictQuery", false);


const url = "mongodb://localhost:27017/RecipeApp";
mongoose.connect(url, {UseNewUrlParser: true}, function (err) {
    if (err) {
        console.log(err)
        console.log("Cannot Connent to DataBase");
    }
    else {
        console.log("Connected to Database");
    }
});

const categoryschema= new mongoose.Schema({
    Category_Id:String,
    Category_Name:String,
    Category_Img:String,
    Category_Desc:String
});

const FoodSchema=mongoose.Schema({
    Food_id:String,
    Food_Name:String,
    Food_Img:String,
    Preview_Img:{
        type:String,
        default:"https://media.istockphoto.com/id/168731372/photo/fresh-homemade-chocolate-brownie.jpg?s=612x612&w=0&k=20&c=DOWddwc5EBO7gedFIL7SC5absmtACBOefRRc8YLyh-w="
    },
    Food_Category_ID:String,
    Food_Area:String,
    Food_Desc:Array,
    IsDrink:String,
    Food_Instruction:Array,
    Food_Ingrediants:Array,
    ptime:Number,
    ctime:Number,
    Difficult:String,
    Comments:Array,
    Like:{
        type:Array,
    }
});


const UserSchema=new mongoose.Schema({
    Name:String,
    Email_id:String,
    Password:String,
    OTP:{
        type:String,
        default:null
    },
    Verified:{
        type:Boolean,
        default:false
    },
    LastActive:String,
    LikedRecipe:{
        type:Array
    },
    TotalComments:{
        type:Number,
        default:0
    }
});


// const questionSchema=mongoose.Schema({
//     question_id:String,
//     questionTitle:String,
//     questionLink:String
// });


const categories=mongoose.model("categories",categoryschema);
const Items=mongoose.model("items",FoodSchema);
const Users=mongoose.model("users",UserSchema);

// const Question=new mongoose.model("questions",questionSchema);


module.exports={
    categories:categories,
    Items:Items,
    Users:Users
};