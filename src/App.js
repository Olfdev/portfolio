import Header from './components/header'
import Footer from './components/footer'
import Home from './pages/home'
import Login from './pages/login'
import Admin from './pages/admin'
import Error from './pages/error'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Initialize Firebase Authentication
    const auth = getAuth()

    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        console.log("You are Auth")
      } else {
        setIsAuthenticated(false)
        console.log("You are NOT Auth")
      }
      setIsLoading(false); // Set loading state to false when the check is complete
    });

    return () => unsubscribe()
  }, []);

  if (isLoading) {
    // Return loading UI until authentication check is complete
    return <h1>Loading...</h1>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Login />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
}