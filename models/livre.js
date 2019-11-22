const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const livreSchema = new Schema({
    categories: [{
        nom: String
    }],
    titre: String,
    prix: Number,
    auteur: String,
    sujet: String,
    ISBN: Number,
    commentaires:[{
        utilisateur: String,
        dateCommentaire: Date,
        message: String,
        etoile: Number
    }]
}, {
    collection: 'livres', 
    toJSON: {
        transform: function(doc, ret) {
            ret.inventaires = doc.inventaires;
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

            if (ret.categories) {
                ret.categories.forEach(cat => {
                    delete cat._id;
                    delete cat.__v;
                });
            }

            if(ret.commentaires) {
                ret.commentaires.forEach(c => {
                    delete c._id;
                    delete c.__v;
				});
            }

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