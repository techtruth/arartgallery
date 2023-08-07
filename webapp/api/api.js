/**
 * REST api entrypoint
 */
const http = require("http");
const fs = require("fs");
const webapp = require("./webapp"); 

// Serve API application with HTTP server
const serverHTTP = http.createServer(webapp);
serverHTTP.on("error", onError);
serverHTTP.on("listening", onListen);
serverHTTP.listen(8080, "0.0.0.0");

// Event error listener
function onError(error, code) {
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error("This action requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error("Port already in use! Close other program and restart.");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListen() {
  console.log(
    "Client Webapp listening on port",
    this.address().port,
    "pid:",
    process.pid
  );
}
