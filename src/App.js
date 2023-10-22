import Header from './components/header'
import Footer from './components/footer'
import Home from './pages/home'
import Admin from './pages/admin'
import Error from './pages/error'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

export default function App() {
  const isAuthenticated = true

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={(isAuthenticated) ? <Admin /> : <Navigate to="/" />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  )
}