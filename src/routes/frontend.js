const express = require('express');
const users = require('../models/Users');
const { default: Users } = require('../models/Users');
const router = express.Router();

// Register a new user
router.post('/users', async (req, res) => {
    const { username, email, income } = req.body;
    try {
        const user = new Users({ username, email, income });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch user details
router.get('/users/:email', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.email });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
