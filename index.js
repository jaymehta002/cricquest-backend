const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

// Counter schema
const Counter = mongoose.model('Counter', {
    date: String,
    value: Number
});

const Players = mongoose.model('players', {
    playerName: String,
    role: String,
    price: String,
    nation: String,
    age: Number,
    team: String,
});


const EasyPlayer = mongoose.model('easyPlayer', {
    playerName: String,
    role: String,
    price: String,
    nation: String,
    age: Number,
    team: String,
});

const HardPlayer = mongoose.model('hardPlayer', {
    playerName: String,
    role: String,
    price: String,
    nation: String,
    age: Number,
    team: String,
});

// Daily counter update
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        let counter = await Counter.findOne({ date: today });

        if (!counter) {
            counter = await Counter.create({ date: today, value: 1 });
        } else {
            counter.value++;
            await counter.save();
        }

        console.log(`Counter updated for ${today}: ${counter.value}`);
    } catch (error) {
        console.error('Error updating counter:', error);
    }
});

// Route to get the current counter value
app.get('/', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const counter = await Counter.findOne({ date: today });
        res.json({ date: today, value: counter ? counter.value : 0 });
    } catch (error) {
        console.error('Error fetching counter:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/players', async (req, res) => {
    try {
        const player = req.body;
        const result = await Players.insertMany(player);
        res.json(result);
    } catch (error) {
        console.error('Error creating player:', error);
    }
});

app.get('/players', async (req, res) => {
    try {
        const players = await Players.find();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/easyPlayers', async (req, res) => {
    try {
        const players = await EasyPlayer.find();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/hardPlayers', async (req, res) => {
    try {
        const players = await HardPlayer.find();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
