import {getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState, useRef } from 'react'


// from https://stackoverflow.com/questions/65505665/protected-route-with-firebase

export const useAuthChecker = () => {
  // assume user to be logged out
  const [loggedIn, setLoggedIn] = useState(false)

  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState(true)

  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)
        }
        setCheckingStatus(false)
      })
    }

    return () => {
        isMounted.current = false
    }
  }, [isMounted])

  return { loggedIn, checkingStatus }
}
