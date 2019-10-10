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
}, {
    collection: 'livres', 
    toJSON: {
        transform: function(doc, ret) {
            ret.href = `${config.api.baseUrl}/livres/${doc._id}`;
            if (!ret.inventaires) {
                ret.inventaires = {};
                ret.inventaires.href = `${ret.href}/inventaires`;
            } else {
                doc.inventaires.forEach((inv, i) => {
                    ret.inventaires[i] = inv.linking(doc._id, false);
                });
            }

            delete ret._id;
            ret.version = doc.__v;
            delete ret.__v;

            return ret;
        }
    }, 
    virtuals: true
});

livreSchema.virtual('inventaires',{
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'livres',
    justOne: false
});

mongoose.model('Livre', livreSchema);