const client_id:string = import.meta.env.VITE_CLIENT_ID
const redirect_uri:string = import.meta.env.VITE_CLIENT_REDIRECT_URI
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
function Login() {

  return (
    <div>
      <a className='' href={AUTH_URL}>Login</a>
    </div>
  )
}

export default Login