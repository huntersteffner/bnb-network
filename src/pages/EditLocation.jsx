import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../components/Loading'

const EditLocation = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [formData, setFormData] = useState({
    type: 'house',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    hostPresent: false,
    food: false,
    address: '',
    price: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    hostPresent,
    food,
    address,
    price,
    images,
    latitude,
    longitude,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const params = useParams()

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      navigate('/')
    }
  })

  useEffect(() => {
    setLoading(true)
    const fetchLocation = async () => {
      const docRef = doc(db, 'listings', params.locationId)
      const docData = await getDoc(docRef)
      if(docData.exists()) {
        setListing(docData.data())
        setFormData({...docData.data(), address: docData.data().location})
        setLoading(false)
      } else {
        navigate('/')

      }


    }
    fetchLocation()
  }, [params.locationId, navigate])

  useEffect(() => {
    if (isMounted) {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setFormData({
                    ...formData,
                    userRef: user.uid
                })
            } else {
                navigate('/login')
            }
        })
    }

    return () => {
        isMounted.current = false
    }
  }, [isMounted])

  return <h1>EditLocation</h1>
}

export default EditLocation
