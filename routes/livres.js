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
        let fields = {};
        if(req.query.fields){
            fields = req.query.fields.replace(/,/g, ' '); // Regex pour éliminer les séparations par virgules
            fields = `${fields} `;
        }
        let livreQuery = Livre.find({_id: req.params.uuidLivre},fields);
        try {
            
            if(req.query.expand === "inventaires"){
                livreQuery.populate('inventaires');
            }

            let livres = await livreQuery;
            
            if(livres.length == 0){
                // Aucun livre à été trouvé... On retourne une erreur 404.¸
                next(new createError.NotFound("Aucun livre ne possède cet identifiant"));
            }

            console.log(livreQuery);
            res.status(200).json(livres[0]);
        } catch(err)
        {
            next(new createError.NotFound("Aucun livre ne possède cet identifiant"));
        }
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }

});

router.get('/', async (req,res,next) =>{
    try{

        let limit = 5;
        let offset = 0;

        let results;
        console.log(req.query.categorie);
        if(req.query.categorie)
        {
            results = await Promise.all([
                Livre.find({categorie: req.query.categorie}).limit(limit).skip(offset),
                Livre.countDocuments()
            ])
        }
        else{
            results = await Promise.all([
                Livre.find().limit(limit).skip(offset),
                Livre.countDocuments()
            ])
        }
        console.log(results);
        let responseBody = {};
        responseBody.metadata = {};
        responseBody.metadata.resultset = {
            count : results[0].length,
            limit: limit,
            offset : offset,
            total : results[1]
        }
        responseBody.results = results[0];
        
        res.status(200).json(responseBody);
    }
    catch(err){
        next(new createError.InternalServerError(err.message));
    }
});

// Sélection de l'inventaire d'un livre
router.get('/:uuidLivre/inventaires', async (req, res, next) => {
    try {
        let livreQuery = Livre.findOne({_id: req.params.uuidLivre}).populate('inventaires');
        try {
            let livre = await livreQuery;
            if (livre){
                res.status(200).json(livre.inventaires);
            } else {
                next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
            }
        } catch (err) {
            next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
        }
    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

// Méthode permettant l'ajout d'un commentaire sur un livre en particulier
router.post('/:uuidLivre/commentaires', async (req,res,next) => {
    try {
        let livreQuery = Livre.findOne({_id: req.params.uuidLivre});
        try{
            let livre = await livreQuery;

            // On regarde si le livre existe
            if(livre.length == 0){
                // Aucun livre à été trouvé... On retourne une erreur 404.
                next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
            } 
            
            // On crée les commentaires du livre
            let commentaire = req.body;
            
            commentaire.dateCommentaire = moment();

            // On ajoute ces commentaires au livre choisi
            livre.commentaires.push(commentaire);

            // On enregistre les commentaires sur le livre sélectionné.
            let livreSauvegarder = await livre.save();

            res.status(201);
            const responseBody = livre.toJSON();
            res.header('Location', responseBody.href);
            res.json(responseBody);
        } catch(err) {
            next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
        }
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.patch('/:uuidLivre', async(req,res,next) => {
    try{
        let livreQuery = Livre.findOne({_id: req.params.uuidLivre});
         
        // Enlève l'erreur du CastID (Erreur d'ID impossible selon les standards Mongo)
        try{
            let livreAModifier = await livreQuery;
           
            // Si le livre n'a pas été trouvé en BD
            if(livreAModifier.length == 0){
                // Aucun livre à été trouvé... On retourne une erreur 404.
                next(new createError.NotFound(`Échec de la modification: Aucun livre possède cet identifiant`));
            } 

            // Regarde si le livre possède une clé similaire à celui de la requête.
            for(var key in req.body)
            {
                if(livreAModifier[key] == undefined)
                    next(new createError.NotFound(`Échec de la modification: Un livre ne possède pas un champ ${key}."`));
                else if(key == "_id")
                    next(new createError.NotFound("Échec de la modification: Cet élément ne peut être modifier."));
            }

            // Les modifications
            let patchLivre = req.body;
           
            // On sauvegarde la modification
            let livreSauvegarder = await Livre.updateMany({_id:req.params.uuidLivre}, {$set: patchLivre});
            
            if (req.query._body === "false") {
                res.status(200).end();
            } else {
                // On rappel notre objet modifié
                let livreModifier = await livreQuery;
                res.status(200).json(livreModifier);
            }

        } catch (err){
            next(new createError.NotFound(`Échec de la modification: Aucun livre possède cet identifiant`));
        }
    } catch (err)
    {
        next(new createError.InternalServerError(err.message));
    }
});

// Méthode permettant l'ajout d'un livre
router.post('/',async (req,res,next)=>{
    const newLivre = new Livre(req.body);
    newLivre.commentaires.forEach(commentaire => {
        commentaire.dateCommentaire = new moment();
    });
    try {
        let saveLivre = await newLivre.save();
        res.status(201);
        
        
        if (req.query._body === "false") {
            res.end();
        } else {
            saveLivre = saveLivre.toJSON();
            res.header('location',saveLivre.href);
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
        try {
            let livre = await Livre.findOne({_id: req.params.uuidLivre});
    
            if (livre === null)
                next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
            else {
                Livre.deleteOne({_id: req.params.uuidLivre}, (err) => {});
                res.status(204);
                res.end();
            }
        } catch (err) {
            next(new createError.NotFound(`Aucun livre ne possède cet identifiant`));
        }
    } catch (err) {
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