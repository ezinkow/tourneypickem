// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

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
require("./routes/picks-api-routes.js")(app);
require("./routes/games-api-routes.js")(app);
require("./routes/users-api-routes.js")(app);
require("./routes/standings-api-routes.js")(app);
require("./routes/scoreboard-api-routes.js")(app);
require("./routes/adminRefreshGames.js")(app);
require("./routes/picksdisplay-api-routes.js")(app);

const syncGames = require("./services/sync");
const lockLines = require("./jobs/lockLines");

// Run sync + lock every 5 minutes
setInterval(async () => {
  try {
    await syncGames();
    await lockLines();
  } catch (err) {
    console.error("Background job failed:", err);
  }
}, 5 * 60 * 1000);

// Run once at startup
(async () => {
  await syncGames();
  await lockLines();
})();

// React Router fallback
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start server after syncing
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});