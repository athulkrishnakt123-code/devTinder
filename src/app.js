const express = require('express');

const { authAdmin } = require('./middleware/auth');

const app = express();

app.use("/admin", authAdmin);

app.get("/admin/getAllData", (req,res) => {
    res.send("all admin data sent");
});

app.get("/admin/deleteAdminData", (req,res) => {
    res.send("admin data is deleted!!");
})

app.listen(3000, () => {
    console.log("Server is listening in port 3000...");
});

