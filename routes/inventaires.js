const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Inventaire = mongoose.model('Inventaire');

router.post('/',async (req,res,next)=>{
    const newInventaire = new Inventaire(req.body);
    
    try {
        
    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

module.exports = router; 