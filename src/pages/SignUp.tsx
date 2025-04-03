import { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  Auth,
} from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import React from 'react'
import { CurrentUser, ProfileAuth } from '../types'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { name, email, password } = formData

  // Runs on every keystroke
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  // When user hits sign up
  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    // Generates user
    try {
      const auth: ProfileAuth | Auth = getAuth()
      // @ts-ignore
      const authCurrentUser: CurrentUser = auth.currentUser
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user
      updateProfile(authCurrentUser, {
        displayName: name,
      })
      const formDataCopy: any = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      navigate('/login')
    } catch (error) {
      alert('Something went wrong with registration.')
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="form-control container mx-auto flex flex-col m-h-[80vh]"
      >
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
        {/* Redirect to login page */}
        <h2 className="text-2xl">Already a Member?</h2>
        <Link to="/Login">
          <button className="btn btn-accent">Click Here</button>
        </Link>
      </div>
    </div>
  )
}

export default SignUp
