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
    <div className="container mx-auto">
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center m-3 space-y-2"
      >
        <div className="flex flex-col flex-wrap justify-center items-center w-full">
          <label className="label text-3xl">Type of Location</label>
          <div className="flex flex-col   w-full space-y-2 lg:flex-row lg:space-y-0 lg:flex-wrap lg:justify-center lg:items-center">
            <button
              type="button"
              className={
                `lg:w-1/4 m-1 ${type === 'house' ? 'btn btn-secondary' : 'btn btn-warning'}`
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
                `lg:w-1/4 m-1 ${type === 'condo' ? 'btn btn-secondary' : 'btn btn-warning'}`
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
                `lg:w-1/4 m-1 ${type === 'cabin' ? 'btn btn-secondary' : 'btn btn-warning'}`
              }
              id="type"
              value="cabin"
              onClick={onChange}
            >
              Cabin
            </button>
            <button
              type="button"
              className={
                `lg:w-1/4 m-1 ${type === 'apartment' ? 'btn btn-secondary' : 'btn btn-warning'}`
              }
              id="type"
              value="apartment"
              onClick={onChange}
            >
              Apartment
            </button>
            <button
              type="button"
              className={
                `lg:w-1/4 m-1 ${type === 'room' ? 'btn btn-secondary' : 'btn btn-warning'}`
              }
              id="type"
              value="room"
              onClick={onChange}
            >
              Room
            </button>
          </div>
        </div>

        <div className="input-div">
          <label className="label text-3xl">Name:</label>
          <input
            className="input-el"
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-div">
          <label className="label text-3xl">Bedrooms:</label>
          <input
            className="input-el w-full"
            type="number"
            id="bedrooms"
            value={bedrooms}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-div">
          <label className="label text-3xl">Bathrooms:</label>
          <input
            className="input-el"
            type="number"
            id="bathrooms"
            value={bathrooms}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-div">
          <label className="label text-3xl">Host Present: </label>
          <div className="flex flex-col justify-center w-full space-y-1">
            <button
              class={
                hostPresent
                  ? 'btn btn-secondary w-full'
                  : 'btn btn-warning w-full'
              }
              type="button"
              id="hostPresent"
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              class={
                !hostPresent
                  ? 'btn btn-secondary w-full'
                  : 'btn btn-warning w-full'
              }
              type="button"
              id="hostPresent"
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div className="input-div">
          <label className="label text-3xl">Food Provided: </label>
          <div className="flex flex-col justify-center w-full space-y-1">
            <button
              class={food ? 'btn btn-secondary' : 'btn btn-warning'}
              type="button"
              id="food"
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              class={!food ? 'btn btn-secondary' : 'btn btn-warning'}
              type="button"
              id="food"
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div className="input-div">
          <label className="label text-3xl">Address: </label>
          <textarea
            className="textarea textarea-bordered textarea-secondary"
            id="address"
            type="text"
            value={address}
            onChange={onChange}
            required
          ></textarea>
        </div>
        {!geolocationEnabled && (
          <div className="input-div">
            <label className="label text-3xl">Latitude</label>
            <input
              className="input-el"
              type="number"
              id="latitude"
              value={latitude}
              onChange={onChange}
              required
            />
            <div className="input-div">
              <label className="label text-3xl">Longitude</label>
              <input
                className="input-el"
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
              />
            </div>
          </div>
        )}
        <div className="input-div">
          <label className="label text-3xl">Price:</label>
          <input
            className="input-el"
            type="number"
            id="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2">
          <label className="label mx-auto text-center text-3xl md:mx-0">Images:</label>
          <input
            className="file-input file-input-bordered file-input-warning w-full mx-auto max-w-xs"
            type="file"
            id={images}
            onChange={onChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </div>
        <button className="btn btn-primary w-full my-3" type="submit">
          Submit Location
        </button>
      </form>
    </div>
  )
}

export default CreateLocation
