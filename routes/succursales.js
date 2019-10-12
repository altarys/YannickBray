const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');
// const Shipment = mongoose.model('Shipment');
// const Package = mongoose.model('Package');
const ObjectId = mongoose.Types.ObjectId;

const Succursale = mongoose.model('Succursale');





// Ajout d'une succursale
router.post ('/', async (req, res, next) => {
    const newSuccursale = new Succursale(req.body);
    try {
        let saveSuccursale = await newSuccursale.save();
        res.status(201);
        
        // Paramètre du retour
        if (req.query._body === "false") {
            res.end();
        } else {
            saveSuccursale = saveSuccursale.toJSON();
            res.header('Location',saveSuccursale.href);
            res.json(saveSuccursale);
        }
    } 
    catch (err) {
        if (err.name === 'ValidationError')
            for (field in err.errors)
                next(new createError.UnprocessableEntity(`Le champ ${err.errors[field].path} est invalide`));
        else
            next(new createError.InternalServerError(err.message));
    }
});
// Route pour obtenir une succursale par son id, inclusion des fields et expand
router.get('/:uuidSuccursale', async (req,res,next) => {
    try{   
        // Array pour stocker les champs
        let fields = {};
        if(req.query.fields){
            fields = req.query.fields.replace(/,/g, ' '); // Regex pour éliminer les séparations par virgules
            fields = `${fields} `;
        }
        // Obtien une succursale par son id, filtre les champs à retourner
        let succursaleQuery = Succursale.find({_id: req.params.uuidSuccursale},fields);
        try {
            // Affiche la liste d'inventaires
            if(req.query.expand === "inventaires"){
                succursaleQuery.populate('inventaires');
            }
            // Requête Async
            let succursale = await succursaleQuery;
            // Retourne 404 notfound si la succursale n'existe pas
            if(succursale.length === 0){
                next(new createError.NotFound(`La succursale avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
            }
            res.status(200).json(succursale[0]);
        } catch(err)
        {
            next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
        }
    }catch(err){
        next(new createError.InternalServerError(err.message));
    }
});


router.put ('/:uuidSuccursale', async (req, res, next) => {
    try {
        try {
            let succursale = await Succursale.findOne({'_id': req.params.uuidSuccursale});
            if (succursale === null)
                next(new createError.NotFound(`La succursale ayant l'identifiant ${req.params.uuidSuccursale} est inexistante.`));
            else {
                newSuccursale = new Succursale(req.body);
                if (newSuccursale.isFullyInitialised()) {
                    await Succursale.updateOne(
                        { "_id": req.params.uuidSuccursale },
                        { 
                            "appelatif": req.body.appelatif,
                            "adresse": req.body.adresse,
                            "ville": req.body.ville,
                            "codePostal": req.body.codePostal,
                            "province": req.body.province,
                            "telephone": req.body.telephone,
                            "telecopieur":req.body.telecopieur,
                            "information": req.body.information 
                        }
                    )
                    res.status(200);
                    if (req.query._body === "false") {
                        res.end();
                    } else {
                        succursale = await Succursale.findOne({'_id': req.params.uuidSuccursale});
                        succursale = succursale.toJSON();
                        res.header('Location',succursale.href);
                        res.json(succursale);
                    }
                } else {
                    next(new createError.UnprocessableEntity('Les informations entrées ne sont pas complètes.'));
                }
            }
        } catch (err) {
            next(new createError.NotFound(`La succursale ayant l'identifiant ${req.params.uuidSuccursale} est inexistante.`));
        }
    } 
    catch (err) {
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