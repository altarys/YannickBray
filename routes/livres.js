const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Livre = mongoose.model('Livre');

// Méthode permettant de sélectionner un livre en particulier par son __id
router.get('/:uuidLivre', async (req,res,next) => {
    try {
        let livreQuery = Livre.find({_id: req.params.uuidLivre});
        try {
            let livres = await livreQuery;
            if(livres.length == 0){
                // Aucun livre à été trouvé... On retourne une erreur 404.¸
                next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
            }

            res.status(200).json(livres[0]);
        } catch(err)
        {
            next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
        }
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }

});

router.get('/', async (req,res,next) =>{
    try{
        let livres = await Livre.find({categorie: req.params.categorie})

        if(livres.length == 0){
            next(new createError.NotFound(`Aucun livre dans la categorie ${req.params.categorie}`));

        }
        res.status(200).json(livres);
    }
    catch(err){
        next(new createError.InternalServerError(err.message));
    }
});

// Sélection de l'inventaire d'un livre
router.get('/:uuidLivre/inventaires', async (req, res, next) => {
    try {
        let livreQuery = Livre.findOne({_id: req.params.uuidLivre});
        livreQuery.populate('inventaires');
        let livres = await livreQuery;
        console.log(livres);
        if (livres.length !== 0){
            res.status(200).json(livres[0]);
        } else
            next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

// Méthode permettant l'ajout d'un commentaire sur un livre en particulier
router.post('/:uuidLivre/commentaires', async (req,res,next) => {
    try {
        let livre = await Livre.findOne({_id: req.params.uuidLivre});

        // On regarde si le livre existe
        if(livre.length == 0){
            // Aucun livre à été trouvé... On retourne une erreur 404.
            next(new createError.NotFound(`Le livre avec l'identifiant ${req.params.uuidLivre} n'existe pas.`));
        } 
        
        // On crée les commentaires du livre
        let commentaire = req.body;
        commentaire.dateCommentaire = moment();

        // On ajoute ces commentaires au livre choisi
        livre.commentaires.push(commentaire);

        // On enregistre les commentaires sur le livre sélectionné.
        let livreSauvegarder = await livre.save();

        res.status(201);
        const responseBody = shipment.toJSON();
        res.header('Location', responseBody.href);
        res.json(responseBody);
        
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.patch('/:uuidLivre', async(req,res,next) => {
    try{

    } catch (err)
    {
        
    }
});

// Méthode permettant l'ajout d'un livre
router.post('/',async (req,res,next)=>{
    const newLivre = new Livre(req.body);
    newLivre.commentaire.dateCommentaire= new moment();
    try {
        let saveLivre = await newLivre.save();
        res.status(201);
        
        
        if (req.query._body === "false") {
            res.end();
        } else {
            saveLivre = saveLivre.toJSON();
            res.header('Location',saveLivre.href);
            res.json(saveLivre);
        }
    } 
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

// Permet de supprimer un livre
router.delete('/:uuidLivre', async (req,res,next) => {
    try {
        let livre = await Livre.findOne({_id: req.params.uuidLivre});

        if (livre === null)
            throw new createError.NotFound(`Le livre ayant l'identifiant ${req.params.uuidLivre} n'existe pas.`);
        else {
            Livre.deleteOne({_id: req.params.uuidLivre}, (err) => {});
            res.status(204);
            res.end();
        }

    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
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
