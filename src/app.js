const express = require('express');
const connectDB = require("./configure/database");
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require("./models/user");
const { userAuth } = require("./middleware/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try{

        //validation
        validateSignUpData(req);

        //password encryption
        const { firstName, lastName, email, password, age } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

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
        const isPassAllowed = user.validatePassword(password);
        if(isPassAllowed){
            //create jwt token
            const token = user.getJWT();

            //add token with cookie and send to the user
            res.cookie("token", token, {expire: 360000 + Date.now()});
            res.send("Login SuccessFully");

        }
        else{
            throw new Error("Invalid Credential");
        }
    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);

    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async(req, res) => {
    try{
        const user = req.user
        res.send(user.firstName + " has sent connection request");
    }catch(error){
        res.status(400).send("ERROR: "+error.message);
    }

})

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



