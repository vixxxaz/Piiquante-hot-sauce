// import de express
const express = require('express');

//import the limiter
const rateLimit = require('express-rate-limit');

//import de body parser
const bodyParser = require('body-parser');

//import de mongoose
const mongoose = require('mongoose');

//importer le fichier routes
const stuffRoutes = require('../backend/routes/stuff');

//import du router user
const userRoutes = require('./routes/user');

//importer la route pour gerer l'ajout d image
const path = require('path');

//importe variable environement
const dotenv = require('dotenv');

//charger la config dotenv
dotenv.config()

//accés à mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@mycluster.02ixjjw.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//crée une app express
const app = express();




//middle ware generale contre error cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



//limite le nombre de connexion par une meme adresse ip 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Trop de connexion depuis cette IP'
});

app.use(limiter);

//acceder au corp de la requete
app.use(bodyParser.json());

// //indiquer la toute
app.use('/api/sauces', stuffRoutes);

//enregistrer les routes utilisateur
app.use('/api/auth', userRoutes);

// //route pour l ajout d image
app.use('/images', express.static(path.join(__dirname, 'images')));

//exporte application pour y acceder depuis d'autre fichier comme le server node
module.exports = app;