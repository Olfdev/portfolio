import Header from './components/header'
import Footer from './components/footer'
import Home from './pages/home'
import Login from './pages/login'
import Error from './pages/error'
import Name from './pages/name'
import {useEffect, useState} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Initialize Firebase Authentication
    const auth = getAuth()

    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        setUserName(user.displayName || '')
        console.log("You are logged in")
      } else {
        setIsAuthenticated(false)
        console.log("You are not logged in")
      }
      setIsLoading(false) // Set loading state to false when the check is complete
    })

    return () => unsubscribe()
  }, [])

  return (
    isLoading ? (<h1 className='loading'>Loading...</h1>) : (
      <Router>
        <Header isAuthenticated={isAuthenticated} userName={userName} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={isAuthenticated ? <Home /> : <Login />}
          />
          <Route path="*" element={<Error />} />
          <Route
            path="/name"
            element={isAuthenticated ? <Name /> : <Login />}
          />
        </Routes>
        <Footer />
      </Router>
    ))
}