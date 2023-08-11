/**
 */

// Load required modules
const path = require("path");
const { json, text } = require("body-parser");
const express = require("express"); // web framework external module
const nocache = require("nocache");
const cors = require("cors");

const routes = require("./routes.js");

// Setup and configure Express http server. Expect a subfolder called "static"
// to be the web root.
const app = express();

if (!process.env.NODE_ENV === "production") {
  app.use(nocache()); //Do not cache if not production
}

//Express API Routes
app.use(cors( { origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true, }));
app.use(json());
app.use(text());
app.use(express.urlencoded({ extended: true })); // support encoded bodies

//Make all these base off /api not just twilio
app.use("/", routes);

app.use(
  "/",
  express.static(path.join(__dirname, "../webpack/dist"), {
    index: "index.html",
  })
);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, "../webpack/dist/index.html"));
});

// Error handler
app.use((error, _req, res, next) => {
  if (error) {
    console.warn("Express app error,", error.message);
    error.status = error.status || (error.name === "TypeError" ? 400 : 500);
    res.statusMessage = error.message;
    res.status(error.status).send(String(error));
  } else {
    next();
  }
});

module.exports = app;
