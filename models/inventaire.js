const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const inventaireSchema= new Schema({
    quantite: Number,
    dateDerniereReception: Date,
    dateDerniereVente: Date,
    livres:{
        type:Schema.Types.ObjectId,
        ref:'Livre'
    },
    succursales:{
        type : Schema.Types.ObjectId,
        ref: 'Succursale'
    }
});

mongoose.model('Inventaire',inventaireSchema);