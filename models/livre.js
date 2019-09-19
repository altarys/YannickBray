const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const livreSchema = new Schema({
    categorie: String,
    titre: String,
    prix: Number,
    auteur: String,
    sujet: String,
    ISBN: Number,
    commentaire:{
        dateCommentaire:Date,
        message: String,
        etoile: Number
    }
});

livreSchema.virtual('inventaires',{
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'livres',
    justOne: false
});

mongoose.model('Livre',livreSchema);