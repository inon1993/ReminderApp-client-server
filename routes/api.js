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

router.post('/save', (req, res) => {
    console.log('Body: ', req.body);

    const data = req.body;

    const newReminder = new Reminder(data);

    newReminder.save((err) => {
        if(err) {
            res.status(500).json({ msg: 'Sorry, internal server errors.'});
        } else {
            res.json({
                msg:'We received your data!'
            });
        }
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