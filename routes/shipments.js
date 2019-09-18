
/*
const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const randomString = require('randomstring');

const router = express.Router();
const Package = mongoose.model('Package');
const ObjectId = mongoose.Types.ObjectId;
const Shipment = mongoose.model('Shipment');


router.get('/:tracking' , async (req,res,next) => {
    try{

        let shipmentQuery = Shipment.find({tracking: req.params.tracking});
        if(req.query.expand === 'packages'){
            shipmentQuery.populate('packages');
        }

        let shipment = await shipmentQuery;
        if(shipment.length === 0)
        {
            next(new createError.NotFound());
        }
        res.status(200).json(shipment[0]);
    }catch(err){
        next(new createError.InternalServerError(err.message));
    }
});

router.get('/', async (req,res,next) => {

    let limit = 5;
    let offset = 0;
    //Gestion du batching/paging
    if(req.query.limit && req.query.offset) {
        limit = parseInt(req.query.limit,10); // Par defaut, parametre de base (10) n'est pas toujours base 10
        offset = parseInt(req.query.offset,10); 

        if(isNaN(limit) || isNaN(offset)){
            next(new createError.BadRequest('Invalid format for limit or offset'));
        }
    }

    try{
        let fields = {};
        let filter = {};
        if(req.query.fields) {
            fields = req.query.fields.replace(/,/g, ' '); //Regex, replaces commas by empty space
            fields = `${fields} tracking`;
        }

        if(req.query.service){
            filter.service = req.query.service;
        }

        // Assures all the requests will be made, and put into the array Results
        let results = await Promise.all([
            Shipment.find(filter, fields).sort({'shipDate':-1}).limit(limit).skip(offset),
            Shipment.estimatedDocumentCount()
            //Shipment.countDocuments()
        ])

        let responseBody = {};

        responseBody.metadata = {};
        responseBody.metadata.resultset = {
            count: results[0].length,
            limit: limit,
            offset: offset,
            total: results[1]
        }

        responseBody.results = results[0];

        res.status(200).json(responseBody);
    } catch(err) {
        next(new createError.InternalServerError(err.message));
    }

});

router.post('/',async (req,res,next)=>{
    const newShipment = new Shipment(req.body);
    //newShipment._id = new ObjectId(); created automatically
    newShipment.shipDate = new moment();
    newShipment.tracking = randomString.generate(16);
    let shipDate = moment(newShipment.shipDate);
    if(newShipment.service === "Express"){
        newShipment.ETA = shipDate.add('3','days');
    } else if (newShipment.service === "Normal"){
        newShipment.ETA = shipDate.add('4000','days');
    }

    let activity = {
        description: 'Shipment created',
        location: 'Robert Inc. HQ',
        activityDate: moment(),
        details: 'Apple is better'
    }

    newShipment.activities.push(activity);
    // Validate your shit
    try
    {
        let saveShipment = await newShipment.save();
        res.status(201);
        
        
        if(req.query._body === "false"){
            res.end();
        } else {
            saveShipment = saveShipment.toJSON();
            res.header('Location',saveShipment.href);
            res.json(saveShipment);
        }
    } 
    catch(err)
    {

    }
    //res.sendFile("C:\Users\BOHDANBYRNE-LANGLOIS\OneDrive\Games\eXceed 3rd Jade Penetrate ~ Black Package/instlog.txt");
});

router.post('/:tracking/activities', async (req,res,next) => {
    try{
        //1. Trouver le shipment avec :tracking
        let shipment = await Shipment.findOne({tracking: req.params.tracking});
        if(shipment === null){
            //1.a -> pas de shipment avec tracking 404
            next(new createError.NotFound(`Le shipment avec le tracking ${req.params.tracking} n'existe pas.`));
        }
        //2. Creer les activity
        let activity = req.body;
        activity.activityDate = moment();
        //3. Ajouter
        shipment.activities.push(activity);

        const savedShipment = await shipment.save();
        res.status(201);
        const responseBody = savedShipment.toJSON();
        res.header('Location', responseBody.href);
        res.json(responseBody);
    }catch (err){
        next(new createError.InternalServerError(err.message));
    }
});

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
*/