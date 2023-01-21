import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../components/Loading'

const CreateLocation = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
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
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          })
        } else {
          navigate('/login')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint=disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onChange = (e) => {
    let boolean = null
    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }
    // Text/boolean/numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let geolocation = {}
    let location

    if (images.length > 6) {
      setLoading(false)
      alert('Max 6 images')
      return
    }

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      )

      const data = await response.json()

      console.log(data)

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address

      if (location === undefined || location.includes('undefined')) {
        setLoading(false)
        alert('Please enter valid address')
        console.log(location)
        return
      }
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
    }

    const storeImg = async (image) => {
      return new Promise((res, rej) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadImages = uploadBytesResumable(storageRef, image)

        uploadImages.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            rej(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadImages.snapshot.ref).then((downloadURL) => {
              res(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImg(image))
    ).catch(() => {
      setLoading(false)
      alert('Images not uploaded')
      return
    })
    const formDataDuplicate = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    formDataDuplicate.location = address
    delete formDataDuplicate.images
    delete formDataDuplicate.address

    const docRef = await addDoc(collection(db, 'listings'), formDataDuplicate)

    setLoading(false)
    alert('Location Created')
    navigate('/')
  }
  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
        <div>
          <button
            type="button"
            className={
              type === 'house' ? 'btn btn-primary' : 'btn btn-secondary'
            }
            id="type"
            value="house"
            onClick={onChange}
          >
            House
          </button>
          <button
            type="button"
            className={
              type === 'condo' ? 'btn btn-primary' : 'btn btn-secondary'
            }
            id="type"
            value="condo"
            onClick={onChange}
          >
            Condo
          </button>
          <button
            type="button"
            className={
              type === 'room' ? 'btn btn-primary' : 'btn btn-secondary'
            }
            id="type"
            value="room"
            onClick={onChange}
          >
            Room
          </button>
        </div>
        <div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="bedrooms"
            value={bedrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="bathrooms"
            value={bathrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
          />
        </div>
        <div>
          <label>Host Present</label>
          <button
            class={hostPresent ? 'btn btn-primary' : 'btn btn-outline'}
            type="button"
            id="hostPresent"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            class={!hostPresent ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="hostPresent"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <div>
          <label>Food Provided</label>
          <button
            class={food ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="food"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            class={!food ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="food"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <div>
          <label>Address</label>
          <textarea
            id="address"
            type="text"
            value={address}
            onChange={onChange}
            required
          ></textarea>
        </div>
        {!geolocationEnabled && (
          <div>
            <label>Latitude</label>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={onChange}
              required
            />
            <div>
              <label>Longitude</label>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
              />
            </div>
          </div>
        )}
        <div>
          <label>Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Images</label>
          <input
            type="file"
            id={images}
            onChange={onChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </div>
        <button className="btn" type="submit">
          Submit Location
        </button>
      </form>
    </div>
  )
}

export default CreateLocation
