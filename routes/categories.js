const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Livre = mongoose.model('Livre');

// Méthode qui sélectionne toutes les catégories
/*
router.get('/', async (req,res,next) => {

});*/


module.exports = router; 