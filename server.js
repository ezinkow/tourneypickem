// Dependencies
const express = require("express");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, './server/.env') })

// Requiring our models for syncing
const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory to be served
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, './client/build/index.html'), function (err) {
//       if (err) {
//           res.status(500).send(err)
//       }
//   })
// });

// // Routes
// require("./client/routes/api-routes.js")(app);
require("./routes/question-api-routes.js")(app);
require("./routes/testimonial-api-routes.js")(app);
require("./routes/answered-api-routes.js")(app);
// require("./routes/html-routes.js")(app);

// // Here we introduce HTML routing to serve different HTML files
// require("./client/routes/html-routes.js")(app);

// Starts the server to begin listening
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
  });
});