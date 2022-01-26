const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminderDB');



router.get('/', (req, res) => {
    Reminder.find({})
    .then((data) => {
        console.log('Data: ', data);
        res.json(data);
    })
    .catch((err) => {
        console.log('Error: ', err);
    });
});

router.get('/name', (req, res) => {
    const data = {
        username: 'bobo',
        age: 4
    };
    res.json(data);
});

module.exports = router;