const express = require('express');
const connectDB = require("./configure/database");
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');

const User = require("./models/user");

const app = express();

connectDB()
    .then(
        () => {
            console.log("Database is connected successfully!!")
            app.listen(3000, () => {
                console.log("Server is listening in port 3000...");
        })
    })
    .catch(
        (err) => console.error("Database is not connected...")
    )

app.use(express.json());


app.post("/signup", async (req, res) => {
    try{

        //validation
        validateSignUpData(req);

        //password encryption
        const { firstName, lastName, email, password, age } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age
        });

        await user.save();
        res.send("User Saved Successfully");

    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    };
});

app.post("/login", async (req, res) => {
    try{ 
        const { email, password } = req.body;
        const user = await User.findOne({ email : email });
        if(!user){
            throw new Error("Invalid Credential");
        }
        const isPassAllowed = await bcrypt.compare(password, user.password);
        if(!isPassAllowed){
            throw new Error("Invalid Credential");
        }
        else{
            res.send("Login SuccessFully");
        }
    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    }
});

app.get("/user",async (req,res) => {
    try{
        const userId = req.body.id
        const user = await User.findById(userId);
        res.send(user);
    }
    catch(err){
        res.status(404).send("Something went wrong!!!");
    }
    
});

app.get("/feed",async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("Something went wrong!!!");
    }
    
});

app.patch("/user/:userId", async (req,res) => {
    try{
        const userId = req.params?.userId;
        const data = req.body;
        const ALLOWED_UPDATE = ["age", "photoUrl", "skills", "about"];
        const isAllowed = Object.keys(data).every(k => ALLOWED_UPDATE.includes(k));

        if(!isAllowed){
            throw new Error("update is not allowed");
        };
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });
        res.send("user updated successfully!!");
        console.log(user);


    }
    catch(err){
        res.status(404).send("Something Went wrong!!!");
    }
})





