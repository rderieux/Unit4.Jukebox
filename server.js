const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Route specific middleware
app.use("/users", require("./api/users"));
app.use("/playlists", require("./api/playlists"));
app.use("/tracks", require("./api/tracks"));

//Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

//404 catchall middleware
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint doesn't exist." });
});

//Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry: something went wrong.  Too bad, so sad.");
});

app.listen(PORT, () => {
  console.log(`Listening on port#: ${PORT}...`);
});
