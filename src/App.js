import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import Explore from './pages/Explore'
import History from './pages/History'
import Location from './pages/Location'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import RestrictedRoute from './components/RestrictedRoute'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<RestrictedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/location" element={<Location />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
        <Footer />
        <Loading />
      </Router>
    </>
  )
}

export default App
