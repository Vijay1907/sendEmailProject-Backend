const mongoose = require('mongoose');

const client = new mongoose.Schema(
    {
        email: { type: String, trim: true, default: null },
        serviceType: { type: String, trim: true, default: '' },
        companyName: { type: String, trim: true, default: '' },
        clientName: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        profileImage: { type: String, default: '' }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        collection: 'clients',

    }
);

const Client = mongoose.model('Client', client);
module.exports = Client;
