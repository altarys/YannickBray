const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Shipment = mongoose.model('Livre');


router.get('/:uuidLivre', async (req,res,next) => {

    

});

// Méthode permettant l'ajout d'un livre
router.post('/',async (req,res,next)=>{
    
});

/*
router.post('/:tracking/activities', async (req,res,next) => {
    
});*/

/*
router.post('/:tracking/packages', async (req, res, next) =>{
    try{
    //1. Trouver le shipment avec :tracking
    let shipment = await Shipment.findOne({tracking: req.params.tracking});
    if(shipment === null){
        //1.a -> pas de shipment avec tracking 404
        next(new createError.NotFound(`Le shipment avec le tracking ${req.params.tracking} n'existe pas.`));
    }
    //2. Creer un package
    let newPacakge = new Package(req.body);
    //3. Associer le _id du shipment au package
    newPacakge.shipment = shipment._id; // Creation de la relation
    //4. Sauvegarder
    let SavedPackage = await newPacakge.save();
    SavedPackage = SavedPackage.linking(req.params.tracking);
    res.header('Location', SavedPackage.href);
    res.status(201).json(SavedPackage);
    }catch(err){
        next(new createError.InternalServerError(err.message));
    }
})
*/

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
