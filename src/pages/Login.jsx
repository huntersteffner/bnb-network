import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const Login =() => {
    const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      alert('Bad user credentials')
      console.log(error)
    }
  }
    return (
        <>
      <form onSubmit={onSubmit} className="form-control container mx-auto flex flex-col">
        <h1>Login</h1>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl">Email Address</p>
          <input type="email" id='email' value={email} onChange={onChange} className="input input-bordered input-ghost" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl">Password</p>
          <input type="password" id='password' value={password} onChange={onChange} className="input input-bordered input-ghost" />
        </div>

        <button
          type="submit"
          className="btn btn-secondary mt-3 mx-auto md:w-1/2"
        >
          Login
        </button>
      </form>
      
      <div className="flex justify-center items-center space-x-3 mt-3">
        <h2 className="text-2xl">Not a member?</h2>
        <Link href="/SignUp">
          <button className="btn btn-accent">Click Here</button>
        </Link>
      </div>
    </>
    )
}

export default Login