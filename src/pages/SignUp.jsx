import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { name, email, password } = formData

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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const user = userCredential.user
        updateProfile(auth.currentUser, {
          displayName: name,
        })
        const formDataCopy = { ...formData }
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()
        await setDoc(doc(db, 'users', user.uid), formDataCopy)
      navigate('/')
    } catch (error) {
      console.log(error)
      alert('Something went wrong with registration.')
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="form-control container mx-auto flex flex-col"
      >
        <h1>Login</h1>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl">Name</p>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            className="input input-bordered input-ghost"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl">Email Address</p>
          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            className="input input-bordered input-ghost"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl">Password</p>
          <input
            type="password"
            id="password"
            value={password}
            onChange={onChange}
            className="input input-bordered input-ghost"
          />
        </div>
        <button
          type="submit"
          className="btn btn-secondary mt-3 mx-auto md:w-1/2"
        >
          Sign Up
        </button>
      </form>
      <div className="flex justify-center items-center space-x-3 mt-3">
        <h2 className="text-2xl">Already a Member?</h2>
        <Link href="/Login">
          <button className="btn btn-accent">Click Here</button>
        </Link>
      </div>
    </>
  )
}

export default SignUp
