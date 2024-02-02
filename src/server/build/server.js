var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import lyricsFinder from 'lyrics-finder'
import bodyParser from 'body-parser';
import spotifyWebApi from 'spotify-web-api-node';
import main from 'lyrics-finder';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log('RefreshToken:', refreshToken);
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.VITE_CLIENT_ID,
        clientSecret: process.env.VITE_CLIENT_SECRET,
        refreshToken,
    });
    spotifyApi
        .refreshAccessToken()
        .then(data => {
        console.log('data: ', data);
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in,
        });
    }).catch((err) => {
        console.log('err/server.ts:', err);
        res.sendStatus(400);
    });
});
app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.VITE_CLIENT_ID,
        clientSecret: process.env.VITE_CLIENT_SECRET,
        accessToken: code,
    });
    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch((err) => {
        console.log('err:', err);
        res.sendStatus(400);
    });
});
app.get('/lyrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lyrics = (yield main(req.query.artist, req.query.track)) || 'No Lyrics Found';
        res.json({ lyrics });
        console.log('We are here');
        console.log(`Artist: ${req.query.artist}, Track: ${req.query.track}`);
    }
    catch (error) {
        console.log('error: ', error);
        res.sendStatus(400);
    }
}));
app.listen(3001);
