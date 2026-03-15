// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Static React build (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Routes

//bracket
require("./routes/bracket/picks-api-routes.js")(app);
require("./routes/bracket/games-api-routes.js")(app);
require("./routes/bracket/users-api-routes.js")(app);
require("./routes/bracket/standings-api-routes.js")(app);
require("./routes/bracket/scoreboard-api-routes.js")(app);
require("./routes/bracket/adminRefreshGames.js")(app);
require("./routes/bracket/picksdisplay-api-routes.js")(app);

//pickem
require("./routes/pickem/picks-api-routes.js")(app);
require("./routes/pickem/games-api-routes.js")(app);
require("./routes/pickem/users-api-routes.js")(app);
require("./routes/pickem/standings-api-routes.js")(app);
require("./routes/pickem/scoreboard-api-routes.js")(app);
require("./routes/pickem/adminRefreshGames.js")(app);
require("./routes/pickem/picksdisplay-api-routes.js")(app);

//squares
require("./routes/squares/users-api-routes.js")(app);
require("./routes/squares/grid-api-routes.js")(app);

const syncPickem = require("./services/pickem/sync.js");
const syncBracket = require("./services/bracket/sync.js");
const lockLines = require("./jobs/lockLines");

// Run sync + lock every 15 minutes
async function runSync() {
  try {
    await syncPickem();
    await syncBracket();
    await lockLines();
  } catch (err) {
    console.error("Background job failed:", err);
  }
}

// Run once at startup
runSync();

// Every 2 min
setInterval(runSync, 15 * 60 * 1000);

// React Router fallback
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start server after syncing
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });