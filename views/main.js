

function loadRecs() {
    // Fetches recommendations from the server
    $.ajax({
        url: '/data', //endpoint to fetch the data 
         method: 'GET',
        success: function (data) {
            let text = "";
            data.forEach(function (rec) {
                //iterating through each recommendation and put them inside a ul element 
                text += `<div class="recDiv">
                        <ul>
                    <h2>Reviewer</h2>
                    <h3>  ${rec.reviewer} </h3>
                    <h2>Movie Title</h2>
                    <h3> ${rec.MovieName} </h4>
                    <h2>Year of Release</h2>
                    <h3> ${rec.relaseYear} </h4>
                    <h2>Publisher</h2>
                    <h3> ${rec.publisher} </h4>
                    <h2>Rating</h2>
                    <h3> ${rec.rating} </h4>
                    <h2>Review</h2>
                    <h4 id="review"> ${rec.review} </h4><br><br>
                    <button class="delete" onclick="deleteRec(${rec.id})">Delete</button>
                    <button onclick="editRec(${rec.id})">Edit</button><br><br>
                    </ul><div>`;
            });
            // put the generated recommendations into the recommendations div
            document.getElementById("recommendations").innerHTML = text;
        },
        error: function (err) {
            // if there is an eerror while fetching data, the error is logged 
            console.error('Error fetching data', err);
        }
    });
}


function addRec() {
    //getting values from input fields in the add recommendations form
    var reviewerInput = document.getElementById("reviewerIn").value;
    var movieInput = document.getElementById("movieIn").value;
    var rsInput = document.getElementById("rsIn").value;
    var publisherInput = document.getElementById("publisherIn").value;
    var ratingInput = document.getElementById("ratingIn").value;
    var reviewInput = document.getElementById("reviewIn").value;


    //checking if the input fields are empty
    if (reviewerInput == "" || movieInput == "" || rsInput == "" || publisherInput == "" || ratingInput == "" || reviewInput == "") {
        alert("Please Fill In All Fields");
    }
    else if(rsInput > 2026){
        alert("Release Year Can't Be More Than 2026!")
    }
    else {
        //create a new recommendation object
        const newRec = {
            id: 0,//id is zero for now as it will be set in the server side
            reviewer: reviewerInput,
            MovieName: movieInput,
            relaseYear: rsInput,
            publisher: publisherInput,
            rating: ratingInput,
            review: reviewInput
        }
        console.log(JSON.stringify(newRec));//this is for debugging

        $.ajax({

            url: '/addRec', // endpoint for adding new recommendation
            method: 'POST', 
            contentType: 'application/json', //specifying the type off data being sent to server
            data: JSON.stringify(newRec), //the data is sent as a json string

            success: function () {
                //when the request is succesfull all input fields are reset
                var reviewerInput = document.getElementById("reviewerIn");
                var movieInput = document.getElementById("movieIn");
                var rsInput = document.getElementById("rsIn");
                var publisherInput = document.getElementById("publisherIn");
                var ratingInput = document.getElementById("ratingIn");
                var reviewInput = document.getElementById("reviewIn");

                
                reviewerInput.value = " ";
                movieInput.value = " ";
                rsInput.value = " ";
                publisherInput.value = "";
                ratingInput.value = " ";
                reviewInput.value = " ";

                console.log("Successfully sent data to server");
                loadRecs();//calling the loadRecs() function to include the new on the website

                //this scrolls the page to the bottoom
                document.documentElement.scrollTo(0, document.documentElement.scrollHeight);
            },

            error: function (err) {
                //this logs the error of there was an issue while adding a recommendation
                console.log(err);
            }

        });
    }
}
function deleteRec(id) {
    // sends a delete request to the server
    $.ajax({
        url: "/deleteRec", // endpoint to delete a recommendation
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        success: function (response) {
            //location.reload();
            loadRecs(); // Refresh recommendations after deletion
            redoID(); //this adjusts the id's  on the server side

        },
        error: function (err) {
            //logs the error
            console.error("Error deleting recommendation", err);
        }
    });
}

function redoID() {
    // resets IDs for each recommendation 
    $.ajax({
        url: "/redoId", //endpoint for redoing the IDs
        method: 'GET',

        success: function () {
            console.log("ID's redone");

        },
        error: function (err) {
            //logs the error if it fails to redo the IDs
            console.error("Error redoing ids", err);
        }
    });

}



//edit function for editing already existing submissions

function editRec(id) {
    //scrolls to the topof the page to display the edit from
    document.documentElement.scrollTo(0, 0);

    //make the form for adding a recommendation disappear
    document.getElementById("addRecDiv").style.display = 'none';
    
    //make the form for editing a recommendation appear
    document.getElementById("editRecDiv").style.display = 'block';


    // creating the edit form so that it replaces the add from whenever this function is called
    let text = `<form onsubmit='return false;'>
    <h2>Edit Recommendation</h2>
    <label for="">Reviewer</label>
    <input type="text" name="" id="editReviewerIn"><br><br>
    <label for="">Movie Name</label>
    <input type="text" name="" id="editMovieIn"><br><br>
    <label for="">Release Year</label>
    <input type="text" name="" id="editRsIn"><br><br>
    <label for="">Publisher</label>
    <input type="text" name="" id="editPublisherIn"><br><br>
    <label for="">Rating</label>
    <input  type="number" min="0" max="10" id="editRatingIn"><br><br><br>
    <label for="">Review</label>
    <input type="text" name="" id="editReviewIn"><br><br><br>
    <button onclick="edit(${id})">Edit Recommendation</button>
</form>`

    //insert the edit form into html of editRecDiv
    document.getElementById("editRecDiv").innerHTML = text;

    //targeting all input fields in edit form
    var editReviewerInput = document.getElementById("editReviewerIn");
    var editMovieInput = document.getElementById("editMovieIn");
    var editRsInput = document.getElementById("editRsIn");
    var editPublisherInput = document.getElementById("editPublisherIn");
    var editRatingInput = document.getElementById("editRatingIn");
    var editReviewInput = document.getElementById("editReviewIn");




    //editReviewerInput.disabled = true;

    $.ajax({
        method: "GET",
        url: "/data", //ednpoint for fetching reommendation data from server
        contentType: "application/json",

        success: function (res) {

            JSON.stringify(res);
            res.forEach(function (rec) {
                console.log(id);
                //this looks for the id of a recommendations that matches with the one being edited and puts its values in the inputs
                if (rec.id == id) {
                    editReviewerInput.value = rec.reviewer;
                    editMovieInput.value = rec.MovieName;
                    editRsInput.value = rec.relaseYear;
                    editPublisherInput.value = rec.publisher;
                    editRatingInput.value = rec.rating;
                    editReviewInput.value = rec.review;


                }
                else {
                    console.log("id not found");
                }

            });
        }

    });
}


function edit(id) {
    //get updated values from the edit recs form
    var editReviewerInput = document.getElementById("editReviewerIn");
    var editMovieInput = document.getElementById("editMovieIn");
    var editRsInput = document.getElementById("editRsIn");
    var editPublisherInput = document.getElementById("editPublisherIn");
    var editRatingInput = document.getElementById("editRatingIn");
    var editReviewInput = document.getElementById("editReviewIn");

    //validating input fields
    if (editReviewerInput.value == "" || editMovieInput.value == "" || editRsInput.value == "" || editPublisherInput.value == "" || editRatingInput.value == "" || editReviewInput.value == "") {
        alert("Please Fill In All Fields");
    }
    else if(editRsInput.value > 2026){
        alert("Release Year Can't Be More Than 2026!")
    }

    else{
        //create the updated recommendation object
    updatedReview = {
        id: id, 
        reviewer: editReviewerInput.value,
        MovieName: editMovieInput.value,
        relaseYear: editRsInput.value,
        publisher: editPublisherInput.value,
        rating: editRatingInput.value,
        review: editReviewInput.value
    };





    $.ajax({
        url: "/editRecs", //endpoint to edit a recommendation
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(updatedReview), // converts the object to a JSON string

        success: function () {
            console.log("Recommendation successfully edited");
            console.log("updated review" + JSON.stringify(updatedReview));
            loadRecs();// loads the updated recommendations into the html
            document.getElementById("editRecDiv").style.display = 'none';
            document.getElementById("addRecDiv").style.display = 'block';

        },

        error: function (err) {
            //logs any errors encountered
            console.log("Error Editing Recommendation:" + err);
        }

    });

}}
