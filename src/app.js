const express = require('express');

const app = express();

app.use("/test", (req,res) => {
    res.send("Server is listening");
})

app.listen(3000, () => {
    console.log("Server is listening in port 3000...");
});

