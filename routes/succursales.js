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

router.put ('/:_id', async (req, res, next) => {
    try {
        let succursale = await Succursale.findOne({'_id': req.params._id});
        if (succursale === null)
            next(new createError.NotFound(`La succursale ayant l'identifiant ${req.params._id} est inexistante.`));
        else {
            newSuccursale = new Succursale(req.body);
            let jsonBody = req.body;
            console.log(req.body.appelatif);
            
            
            
            // TODO
            
            
            
            
            
            
            
            if (newSuccursale.isFullyInitialised()) {
                await Succursale.updateOne(
                    { "_id": req.params._id },
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
                    succursale = succursale.toJSON();
                    res.header('Location',succursale.href);
                    res.json(succursale);
                }
            } else {
                next(new createError.UnprocessableEntity('Les informations entrées ne sont pas complètes.'));
            }
        }
    } 
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

module.exports = router;