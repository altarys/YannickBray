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
        let livreQuery = Livre.find();
        let livres = await livreQuery;

        let categories = [];
        
        livres.forEach(function(livre){
            let categorieAAjouter = {};
            categorieAAjouter.nom = livre.categorie

            if(categories.map(function(categorie) { return categorie.nom; }).indexOf(categorieAAjouter.nom) == -1)
                categories.push(categorieAAjouter);
        });

        res.status(200).json(categories);
    } catch (err)
    {
        next(new createError.InternalServerError(err.message));
    }
    
});


module.exports = router; 