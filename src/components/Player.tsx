import SpotifyPlayer from 'react-spotify-web-playback';
import { useEffect, useState } from 'react';
interface IPlayerProps {
    accessToken: string;
    trackUri: string;
}
export default function Player({ accessToken, trackUri }: IPlayerProps) {
    const [play, setPlay] = useState<boolean>(false);
    useEffect(() => setPlay(true), [trackUri])

    return <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
            if (!state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={trackUri}
    />

}
