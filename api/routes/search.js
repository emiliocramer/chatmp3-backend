const multer = require('multer');
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/search', async (req, res) => {
    try {
        console.log(req.body)
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Please provide a query' });
        }

        const accessToken = await getSpotifyAccessToken();
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                q: query,
                type: 'track',
                market: 'US',
                limit: 10
            }
        });

        res.json(searchResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getSpotifyAccessToken() {
    const authUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(authUrl, 'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username:  process.env.SPOTIFY_CLIENT_ID,
                password: process.env.SPOTIFY_CLIENT_SECRET
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error;
    }
}

module.exports = router;
