import { useEffect, useState } from 'react'
import useAuth from './environment/useAuth.ts';
import SpotifyWebApi from 'spotify-web-api-node';

interface IDashboardProps {
    code: string;
}

const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.VITE_CLIENT_ID,
})

const Dashboard = ({ code }: IDashboardProps) => {
    const accessToken = useAuth({ code })
    const [search, setSearch] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[] | undefined>([]);
    console.log(searchResults)
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

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
    }, [search, accessToken])

    return (
        <div className='min-h-screen'>
            <div>
                <input type="text" placeholder={'Search Songs/Artists'} onChange={e => setSearch(e.target.value)} />
            </div>
            <div>
                <h2>Songs</h2>
            </div>
            {code}
            <div className='flex justify-end'>
                <h2>Bottom</h2>
            </div>
        </div>
    )
}

export default Dashboard