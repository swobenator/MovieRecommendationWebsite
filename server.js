const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.listen(3000, ()=>{
    console.log("Server Running on port 3000: https://localhost:3000");
});



app.get("/data", (req, res) =>{
    const filePath = path.join(__dirname, "recs.json");
    fs.readFile(filePath, (err, data) =>{
        if(err){
            res.status(500).send("Error reading the file");
        }
        else{
            res.send(JSON.parse(data));
        }
    });
});

app.get("/", (req, res) =>{
    res.sendFile("./views/home.html", { root:  __dirname })
});

app.get("/submitRec", (req,res) =>{
    

});