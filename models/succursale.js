const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const succursaleSchema= new Schema({
    appelatif: String,
    adresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur:String,
    information: String
});

livreSchema.virtual('inventaires',{
    ref: 'Inventaire',
    localfield: '_id',
    foreignField: 'succursales',
    justOne: false
});

mongoose.model('Succursale',livreSchema);
