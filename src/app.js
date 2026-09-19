const express = require('express');

const app = express();

app.get("/test", (req,res) => {
    console.log(req.query);
    res.send("Server is listening");
})

app.get(/^\/ab.*cd$/, (req, res) => {
    res.send("hi hello");
});

app.listen(3000, () => {
    console.log("Server is listening in port 3000...");
});

