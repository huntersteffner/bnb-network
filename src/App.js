import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Login/>
      <SignUp/>
      <Footer/>
    </div>
  )
}

export default App
