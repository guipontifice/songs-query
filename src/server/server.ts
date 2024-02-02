import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
// import lyricsFinder from 'lyrics-finder'
import bodyParser from 'body-parser';
import spotifyWebApi from 'spotify-web-api-node';
import main from 'lyrics-finder';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/refresh', (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    console.log('RefreshToken:', refreshToken)

    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.VITE_CLIENT_ID,
        clientSecret: process.env.VITE_CLIENT_SECRET,
        refreshToken,
    });
    spotifyApi
        .refreshAccessToken()
        .then(data => {
            console.log('data: ', data)
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        }).catch((err: any) => {
            console.log('err/server.ts:', err)
            res.sendStatus(400)
        })
});

app.post('/login', (req: Request, res: Response) => {
    const code = req.body.code;

    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.VITE_CLIENT_ID,
        clientSecret: process.env.VITE_CLIENT_SECRET,
        accessToken: code,
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        }).catch((err: any) => {
            console.log('err:', err)
            res.sendStatus(400)
        })
})

app.get('/lyrics', async (req: Request, res: Response) => {
    try {
        const lyrics = 
        await main(req.query.artist as string, req.query.track as string) || 'No Lyrics Found';
        res.json({ lyrics })
        console.log('We are here')
        console.log(`Artist: ${req.query.artist}, Track: ${req.query.track}`);
    } catch (error) {
        console.log('error: ', error)
        res.sendStatus(400)
    }
})
app.listen(3001)
