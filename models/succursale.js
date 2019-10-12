const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const succursaleSchema = new Schema({
    appelatif: String,
    adresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur:String,
    information: String
}, {
    collection: 'succursales',
    toJSON: {
        transform: function (doc, ret) {
            ret.href = `${config.api.baseUrl}/succursales/${doc._id}`;
            if (!ret.inventaires) {
                ret.inventaires = {};
                ret.inventaires.href = `${ret.href}/inventaires`;
            } else {
                doc.inventaires.forEach((inv, i) => {
                    ret.inventaires[i] = inv.linking(doc._id, false);
                });
            }

            delete ret._id;
            delete ret.id;
            ret.version = doc.__v;
            delete ret.__v;
            return ret;
        },
        virtuals: true
    }
});

succursaleSchema.virtual ('inventaires', {
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'succursales',
    justOne: false
});

succursaleSchema.methods.isFullyInitialised = function () {
    return (this.appelatif !== undefined &&
        this.adresse !== undefined &&
        this.ville !== undefined &&
        this.codePostal !== undefined &&
        this.province !== undefined &&
        this.telephone !== undefined &&
        this.telecopieur !== undefined &&
        this.information !== undefined);
};

mongoose.model('Succursale', succursaleSchema);
