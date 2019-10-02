const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');
// const Shipment = mongoose.model('Shipment');
// const Package = mongoose.model('Package');
const ObjectId = mongoose.Types.ObjectId;

const Succursale = mongoose.model('Succursale');

router.post ('/', async (req, res, next) => {
    const newSuccursale = new Succursale(req.body);
    
    try {
        let saveSuccursale = await newSuccursale.save();
        res.status(201);
        
        
        if (req.query._body === "false") {
            res.end();
        } else {
            saveSuccursale = saveSuccursale.toJSON();
            res.header('Location',saveSuccursale.href);
            res.json(saveSuccursale);
        }
    } 
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});
// Route pour obtenir une succursale par son id, inclusion des fields
router.get('/:_id', async (req,res,next) => {
    try{   
        // Array pour stocker les champs
        let fields = {};
        if(req.query.fields){
            fields = req.query.fields.replace(/,/g, ' '); // Regex pour éliminer les séparations par virgules
            fields = `${fields} `;
        }
        // Obtien une succursale par son id, filtre les champs à retourner
        let succursaleQuery = Succursale.find({_id: req.params._id},fields);
        // Affiche la liste d'inventaire
        if(req.query.expand === "inventaires"){
            succursaleQuery.populate('inventaires');
        }
        // Requête Async
        let succursale = await succursaleQuery;
        // Retourne 404 notfound si la succursale n'existe pas
        if(succursale.length === 0){
            next(new createError.NotFound());
        }
        res.status(200).json(succursale);
    }catch(err){
        next(new createError.InternalServerError(err.message));
    }
});


module.exports = router;