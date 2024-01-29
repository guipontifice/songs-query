import { useEffect, useState } from 'react'
// import SpotifyPlayer from 'react-spotify-web-playback';
import useAuth from './environment/useAuth.ts';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackResult from './components/TrackResult.tsx';
import Player from './components/Player.tsx';

interface IDashboardProps {
    code: string;
}
interface ITrackProps {
    uri: string,
}

const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.VITE_CLIENT_ID,
})

const Dashboard = ({ code }: IDashboardProps) => {
    const accessToken = useAuth({ code })
    const [search, setSearch] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[] | undefined>([]);
    const [playingTrack, setPlayingTrack] = useState<ITrackProps>({ uri: '' });
    function chooseTrack(track: any) {
        setPlayingTrack(track)
        setSearch('')
    }
    console.log(searchResults)
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            setSearchResults(res.body.tracks?.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                    (smallest?, image?) => {
                        if (image?.height ?? 0 < (smallest?.height ?? 0)) return image;
                        return smallest
                    }, track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage?.url ?? ''
                }
            }));
        })
        return () => { cancel = true };
    }, [search, accessToken])

    return (
        <div className='min-h-screen'>
            <div>
                <input type="text" placeholder={'Search Songs/Artists'} onChange={e => setSearch(e.target.value)} />
            </div>
            <div>
                {searchResults?.map(track => (
                    <TrackResult
                        track={track}
                        key={track?.uri || ''}
                        chooseTrack={chooseTrack} />
                ))}
            </div>
            <div className=''>
                {/* <SpotifyPlayer
                    token={accessToken}
                    uris={playingTrack?.uri}
                />; */}
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </div>
    )
}

export default Dashboard