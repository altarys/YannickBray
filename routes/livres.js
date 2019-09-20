const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Shipment = mongoose.model('Livre');

// Méthode permettant de sélectionner un livre en particulier par son __id
router.get('/:uuidLivre', async (req,res,next) => {
    try {
        let livreQuery = await Livre.findOne({_id: req.params.uuidLivre});


        let livre = await livreQuery;

        if(livre.length == 0){
            // Aucun livre à été trouvé... On retourne une erreur 404.
            next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
        } else {
            res.status(200).json(livre[0]);
        }
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }
    
});

// Méthode permettant l'ajout d'un commentaire sur un livre en particulier
router.post('/:uuidLivre/commentaires', async (req,res,next) => {

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
