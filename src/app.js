const express = require('express');
const connectDB = require("./configure/database");
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
   
    app.post("/signup", async (req, res) => {
        
        const userObj = {
            firstName: "Arun",
            lastName: "Krishna",
            email: "arun@gmail.com",
            age: 23,
            gender: "Male"
        };
        try{
            const user = new User(userObj)
            await user.save();
            res.send("Saved Successfully!!!");
        }
        catch(err){
            res.status(400).send("Error happened!!"+err.message);
        }
        

    });





