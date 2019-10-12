const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const createError = require('http-errors');

const ObjectId = mongoose.Types.ObjectId;

const Livre = mongoose.model('Livre');

// Méthode qui sélectionne toutes les catégories
router.get('/', async (req,res,next) => {
    try{
        // On va chercher tout les livres
        let livreQuery = Livre.find();

        // On exécute la requête
        let livres = await livreQuery;

        // Tableau permettant de contenir les différentes catégories
        let categories = [];
        
        // Pour chaque livre dans la collection de livres
        livres.forEach(function(livre){

            // Catégorie que l'on va ajouter, elle prend la catégorie du livre itérant
            let categorieAAjouter = {};
            categorieAAjouter.nom = livre.categorie

            /*  On exécute une lambda dans le tableau des catégories, et y sort les noms des catégories. 
                Ensuite on vérifie si la catégorie à ajouter est existante dû à un index déjà utilisé. 
                Si l'entrée est inexistante, elle va être égale à -1 car la position est introuvable dans le tableau. */
            if(categories.map(function(categorie) { return categorie.nom; }).indexOf(categorieAAjouter.nom) == -1)
                categories.push(categorieAAjouter);
        });

        // On crée une collection
        let responseBody = {};

        // On enregistre les catégories dans le résultats de la collection
        responseBody.results = categories;

        // On retourne la collection
        res.status(200).json(responseBody);
    } catch (err)
    {
        next(new createError.InternalServerError(err.message));
    }
    
});

router.delete('/', (req,res,next) => {
    next(new createError.MethodNotAllowed());
});
router.patch('/', (req,res,next) => {
    next(new createError.MethodNotAllowed());
});
router.put('/', (req,res,next) => {
    next(new createError.MethodNotAllowed());
});

module.exports = router; 