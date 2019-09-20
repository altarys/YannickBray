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

router.get('/:_id', async (req,res,next) => {
    try{   
        let fields = {};
        if(req.query.fields){
            fields = req.query.fields.replace(/,/g, ' '); // el regex'o
            fields = `${fields} `;
        }
        let succursaleQuery = Succursale.find({_id: req.params._id},fields);
        if(req.query.expand === "inventaires"){
            succursaleQuery.populate('inventaires');
        }

        let succursale = await succursaleQuery;
        if(succursale.length === 0){
            next(new createError.NotFound());
        }
        res.status(200).json(succursale);
    }catch(err){
        next(new createError.InternalServerError(err.message));
    }
});


module.exports = router;