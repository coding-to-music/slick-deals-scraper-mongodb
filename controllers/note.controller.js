const express = require('express');
const router = express.Router();
const db = require('../models');

// update deals' notes
router.post('/addNote/:id', (req, res) => {

    console.log(req.body)
    console.log(req.params.id)
    // create new note in mongodb
    db.Note.create(req.body)
        .then(dbNote => db.Deals.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true }))
        .then(dbDeals => {
            console.log('NOTE ADDED')
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbDeals);
        })
        .catch(err => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

module.exports = router;