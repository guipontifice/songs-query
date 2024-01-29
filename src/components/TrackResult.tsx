function TrackResult({ track, chooseTrack }: any) {
    function handlePlay() {
        chooseTrack(track)
    }
    return (
        <div className=""
        style={{ cursor: "pointer" }}
        onClick={handlePlay}
>
            <img src={track?.albumUrl} style={{ height: "64px", width: "64px" }} />
            <div>
                <div>{track?.title}</div>
                <div>{track?.artist}</div>
            </div>
        </div>
    )
}

export default TrackResult