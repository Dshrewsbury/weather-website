const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const request = require("request");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//Root
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Dan"
  });
});

/* About me page outlining my experiences/passions 
    TODO: Create front end via React
*/
app.get("/about", (req, res) => {
  res.render("about"),
    {
      title: "About Me",
      name: "Dan"
    };
});

//Basic help information on written applications
app.get("/help", (req, res) => {
  res.render("help"),
    {
      helpmessage: "Heeeeelp",
      title: "Help",
      name: "Dan"
    };
});

// Return
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address."
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error
        });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error
          });
        }

        return res.send({
          location,
          forecast: forecastData,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("help"),
    {
      title: "404",
      name: "Dan",
      errorMessage: "Help article not found"
    };
});

app.get("*", (req, res) => {
  res.render("404"),
    {
      title: "404",
      name: "Dan",
      errorMessage: "Page not found."
    };
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
