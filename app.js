/*
 Authors:
 Your name and student #: Brian Ke A01218821
 Your Partner's Name and student #: None
 (Make sure you also specify on the Google Doc)
*/
const express = require("express");
const fs = require("fs").promises

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/", (req, res) => res.render("pages/index"));

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.post("/myForm", (req, res) => {
    let formData = req.body;
    let movies = formData['movies'];
    let payload = movies.split(", ");
    res.render("pages/index", {
        movieList: payload
    });
});

app.get("/myListQueryString", (req, res) => {
    let movie1 = req.query.movie1;
    let movie2 = req.query.movie2;
    let payload = [movie1, movie2]
    res.render("pages/index", {
        movieList: payload
    });
});

app.get("/search/:movieName", (req, res) => {
    let movieName = req.params.movieName;
    return new Promise((resolve, reject) => {
        fs.readFile("movieDescriptions.txt", "utf8")
            .then(content => {
                if (content.indexOf(movieName.charAt(0).toUpperCase() + movieName.slice(1)) >= 0) {
                    let descriptions = content.split(/\r?\n/);
                    // I tried to use EOL but it did not work. The string would not split.
                    for (i = 0; i < descriptions.length; i++) {
                        if (descriptions[i].indexOf(movieName.charAt(0).toUpperCase() + movieName.slice(1)) >= 0) {
                            res.render("pages/searchResult", {
                                movieName: movieName,
                                movieDescription: descriptions[i]
                            });
                        }
                    }
                    resolve()
                }
            })
            .catch(err => reject)
    })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});