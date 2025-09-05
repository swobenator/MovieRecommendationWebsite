const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

// middleware to serve the static files in the "views" directory
app.use(express.static(path.join(__dirname, "views"))); 


// starts the server and listens on port 3000
app.listen(3000, ()=>{
    console.log("Server Running on port 3000: http://localhost:3000");
});

//route to serve the home page
app.get("/", (req, res) =>{
    res.sendFile("./views/home.html", { root:  __dirname })
});

//route to serve the graph page
app.get("/graph", (req, res) =>{
    res.sendFile("./views/graph.html", { root:  __dirname })
});

//route for fetching the recommendation data from recs.json
app.get("/data", (req, res) =>{
    //path to the JSON file
    const filePath = path.join(__dirname, "recs.json");
    //reads the contents of recs.json
    fs.readFile(filePath, (err, data) =>{
        
        //sends an error if the file can't be read
        if(err){    
            res.status(500).send("Error reading the file");
        }
        else{
            //parses the data from the file and sends it as a json response
            res.send(JSON.parse(data));
            
        }

    });
});


//route for reseting the id's for the recommendations in recs.json
app.get("/redoId", (req, res) =>{

    const filePath = path.join(__dirname, "recs.json");// path to recs.json
    

    fs.readFile(filePath, (err, data) => {
        //sends an error if the json file can't be read
        if (err) {
            res.status(500).send("Error reading file");
        } else {
            const jsonData = JSON.parse(data);
            
            //reassigns the id values for each recommendation starting from 0
            let idCount = 0;
            jsonData.forEach(rec => {
                rec.id = idCount;
                idCount ++;
            });

            //write the updated data into recs.json
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    res.status(500).send("Error saving data");
                } else {
                    res.send({ status: "Rec added successfully" });
                    
                }
            });
        }
    });

})

//middleware for parsing json data in incoming requests
app.use(express.json());

app.post("/addRec", (req, res) => {
    const filePath = path.join(__dirname, "recs.json");
    const newRec = req.body; // gets the new recommendation from the body of the request

    //reads the content of the recs.json file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send("Error reading file");
        } else {
            const jsonData = JSON.parse(data); // parses the file data into JSON
            
            
            //assigns an id to the new recommendation using the length of the file
            newRec.id = jsonData.length + 2;
            console.log(newRec);

            //adds the new recommendation to the recs.json data
            jsonData.push(newRec);

            //Writes the updated data into recs.json
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    res.status(500).send("Error saving data");
                } else {
                    res.send({ status: "Rec added successfully" });
                    
                }
            });
        }
    });
});



// DELETE endpoint to delete a recommendation by its id
app.delete("/deleteRec", (req, res) => {
    // Extract the id from the request parameters
    const id = parseInt(req.body.id);
    // Path to the JSON file containing the recommendations
    const filePath = path.join(__dirname, "recs.json");
 
    // Read the contents of the JSON file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Send an error response if there is an issue reading the file
            res.status(500).send("Error reading the file");
            
        } else {
            // Parse the JSON data from the file
            const recommendations = JSON.parse(data);
           
            //filter out the recommendation(s) with the specified id and assign the array value to an array
            const updatedRecs = recommendations.filter((rec) => rec.id !== id);
 
            // check if any recommendation was deleted (by comparing lengths of arrays)
            if (recommendations.length === updatedRecs.length) {
                // if no deletion occurred send a 404 response 
                res.status(404).send({ status: "Movie not found", id });
            } else {
                // write the updated recommendations back to the file
                fs.writeFile(filePath, JSON.stringify(updatedRecs, null, 4), (err) => {
                    if
                        (err) { //Send a 500 error response if there is an issue saving the file
                        res.status(500).send("Error saving updated data");
                    } else {
                        // Send a success response indicating the movie was deleted
                        res.send({ status: "Movie deleted successfully", id });
                    }
                });
            }
        }
    });
});

//route for editing an existing recommendation
app.put("/editRecs", (req, res) => {
    const filePath = path.join(__dirname, "recs.json"); 
    const updatedRec = req.body; //gets the updated recommendation from the body of the request

    //console.log("updated review", updatedRec);

    //reads the recs.json file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send("Error reading file");
        } else {
            const jsonData = JSON.parse(data);

            let recomFound = false; //boolean for checking if the recommendation is found

            //loops through the recommendations to find the one with the matching id
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id === updatedRec.id) {
                    //update the recommendation with the updated one
                    jsonData[i] = updatedRec;
                    recomFound = true; 
                    break; //exits the loop
                }
            }

            //if recomFound is equal to true, write the updated recommendations into recs.json 
            if (recomFound) {
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), (err) => {
                    if (err) {
                        res.status(500).send("Error saving data");
                    } else {
                        res.send({ status: "Recommendation edited successfully" });
                    }
                });
            } else {
                res.status(404).send("Recommendation not found");
            }
        }
    });
});


