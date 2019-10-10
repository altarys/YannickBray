const cors = require("cors");
const config = require("config");
const express = require("express");
const lib = require("./lib");

const app = express();

lib.logger(app);

app.use(cors()); // Activation des cross-origin requests
app.use(express.json()); // Communication en JSON avec le client

// Configuration de la base de donnees
require('./lib/database');
// Configuration des modeles de la base de donnees
require('./models');

const routes = require('./routes');

//app.use('/demo',routes.demo);
app.use('/succursales', routes.succursales);
app.use('/livres',routes.livres);
app.use('/inventaires',routes.inventaires);
app.use('/categories', routes.categories);
lib.errors(app);

const PORT = config.api.PORT||4500;

app.listen(PORT,() => console.log("Server up and running"));