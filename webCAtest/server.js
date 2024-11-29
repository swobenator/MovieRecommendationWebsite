const express = require("express");
const app = express();

app.listen(4000, () =>{
    console.log("server running at: http://localhost:4000")
});

app.get("/index", (req, res) =>{
    res.sendFile("./views/index.html", {root: __dirname});
})


