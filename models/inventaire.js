const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const inventaireSchema= new Schema({
    quantite: Number,
    dateDerniereReception: Date,
    dateDerniereVente: Date,
    livres:{
        type : Schema.Types.ObjectId,
        ref:'Livre'
    },
    succursales:{
        type : Schema.Types.ObjectId,
        ref: 'Succursale'
    }
}, {
    collection: 'inventaires',
    toJSON: {
        transform: function(doc, ret) {
            ret.href = `${config.api.baseUrl}/inventaires/${doc._id}`;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

inventaireSchema.methods.linking = function(uuidLivre, isLivreObjectPresent = true) {
    const _id = this._id;
    const livreHref = `${config.api.baseUrl}/livres/${uuidLivre}`;
    const linkedInventaire = this.toJSON();
    linkedInventaire.href = `${livreHref}/inventaires/${_id}`;
    if (isLivreObjectPresent) {
        linkedInventaire.livres = {}
        linkedInventaire.livres.href = livreHref;
    } else {
        delete linkedInventaire.livres;
    }
    return linkedInventaire;
}

mongoose.model('Inventaire', inventaireSchema);