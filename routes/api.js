const express = require('express');
const { send } = require('express/lib/response');
const router = express.Router();
const Reminder = require('../models/reminderDB');



router.get('/', (req, res) => {
    Reminder.find({})
    .then((data) => {
        // console.log('Data: ', data);
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

router.delete('/delete', (req, res) => {
    const data = req.body;
    // console.log(req.body);
    // Reminder.findOne(data)
    // .then(() => {
    //     console.log();
    //     Reminder.deleteOne(data)
    //     .then(() => {
    //         res.send('Deleted successfully');
    //     })
    //     .catch(() => {
    //         res.send('An error occured.');
    //     });
    // })
    // .catch(() => {
    //     res.send('Error deleting.');
    // });

    Reminder.findOne(data, (err, reminderFound) => {
        console.log(reminderFound);
        Reminder.deleteOne(reminderFound, (err) => {
            if(err) {
                console.log(reminderFound);
                res.send('errroooorrr')
            } else {
                console.log('worksss');
            }
        });
    });
});

module.exports = router;