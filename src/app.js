const express = require('express');

const { authUser } = require('./middleware/auth');

const app = express();

// app.use("/admin", authAdmin);

// app.get("/admin/getAllData", (req,res) => {
//     res.send("all admin data sent");
// });

// app.get("/admin/deleteAdminData", (req,res) => {
//     res.send("admin data is deleted!!");
// })

app.use("/user", authUser);

app.get("/user/getUserData", (req,res) => {

    // try{
     throw new Error("Error!!!");
    // }
    // catch(err){
    //     res.status(500).send("Something Went Wrong!!")
    // }
    // res.send("user data sent");

});
app.get("/user/deleteUserData", (req,res) => {
    res.send("user data is deleted!!");
})
app.use("/", (err,req,res,next) => {
    res.status(500).send("Eroorr!!");
})
app.listen(3000, () => {
    console.log("Server is listening in port 3000...");
});

