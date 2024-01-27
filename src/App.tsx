import './App.css'
import Dashboard from './Dashboard.tsx'
import Login from './environment/Login.tsx'

const code: string = new URLSearchParams(window.location.search).get('code')!
function App() {
  console.log('code-app:', code)
  return (
    <>
      {code ? <Dashboard code={code} /> : <Login />}
    </>
  )
}

export default App
