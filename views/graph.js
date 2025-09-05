//Author: Bogdan Postolachi

// Fetch data from the server to use in the chart
//retrieving data from the server endpoint (/data) and using it to generate the two charts
fetch("/data") //sends HTTP GET request to the /data endpoint
    .then(response => response.json()) //converts server response to a JSON object
    .then(data => {
        // Calculating average rating for each movie
        const movieRatings = {};

        //method in JavaScript used to iterate over the array
        data.forEach(rec => { //looping through each movie in the data
            const movieName = rec.MovieName; //extracts value of MovieName property from the rec object and assigns it to the variable movieName
            const rating = parseFloat(rec.rating); //extracts rating from rec and converts it from string to a floating-point number using the parseFloat function and assigns it to variable rating

            //checking if movieRatings object already has an entry for a movieName
            if (!movieRatings[movieName]) {
                movieRatings[movieName] = {
                    totalRating: 0,
                    count: 0
                };
            }

            movieRatings[movieName].totalRating += rating; //adds the current rating to the total rating for the given movie name in the movieRatings object
            movieRatings[movieName].count++; //increments the count property for the given movie name by 1
        });

        //labels and average ratings for the chart
        const labels = Object.keys(movieRatings);
        const averageRatings = labels.map(movie =>
            (movieRatings[movie].totalRating / movieRatings[movie].count).toFixed(2)
        );

        // Create the bar chart
        new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Average Rating",
                    data: averageRatings, //data for the chart
                    backgroundColor:[ "rgba(75, 192, 192, 0.5)", "rgba(43, 199, 79, 0.5)", "rgba(32, 92, 97, 0.5)"], //color of the bars
                    borderColor: "rgb(0, 0, 0)", //colors for border
                    borderWidth: 1 //width of border
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Movie Ratings'
                    }
                },
                //specifying how the x and y axes should appear
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Rating'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Movie Title'
                        }
                    }
                }
            }
        });
    //})

   // .catch(err => console.error("Error fetching data for the chart:", err));



    //count the number of recommendations for each movie
    const recommendationCounts = {};
    data.forEach(rec => {
        const movieName = rec.MovieName;
        recommendationCounts[movieName] = (recommendationCounts[movieName] || 0) + 1;
    });


      //prepare labels and counts for the chart
      const countLabels = Object.keys(recommendationCounts);
      const recommendationData = Object.values(recommendationCounts);

      //create the pie chart for recommendation counts
      new Chart(document.getElementById("pieChart"), {
          type: "pie",
          data: {
              labels: countLabels,
              datasets: [{
                  label: "Number of Recommendations",
                  data: recommendationData,
                  backgroundColor: ["rgba(6, 219, 41, 0.5)",  "rgba(255, 0, 0, 0.5)", "rgba(45, 76, 188, 0.85)", "rgba(47, 102, 161, 0.5)", "rgba(211, 206, 55, 0.5)"],
                  borderColor: "rgb(0, 0, 0)",
                  borderWidth: 1
              }]
          },
          options: {
              plugins: {
                  title: {
                      display: true,
                      text: 'Movies Ranked by Number of Recommendations'
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Number of Recommendations'
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Movie Titles'
                      }
                  }
              }
          }
      });
  })
  
  .catch(err => console.error("Error fetching data for the chart:", err)); //logs an error if the fetch request fails