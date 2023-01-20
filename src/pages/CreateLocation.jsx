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
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../components/Loading'

const CreateLocation = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  const [geolocationEnabled, setGeolocationEnabled] = useState(false)
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

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint=disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onChange = (e) => {
    let bool = null
    if (e.target.value === 'true') {
      bool = true
    }
    if (e.target.value === 'false') {
      bool = false
    }

    // Files

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }
    // Text/bool/numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value,
      }))
    }
  }
  if(loading) {
    return <Loading/>
  }

  return (
    <div>
      <form className="flex flex-col justify-center items-center">
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
            onClick={onChange}
            placeholder="Name"
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="bedrooms"
            value={bedrooms}
            onClick={onChange}
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
            onClick={onChange}
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
            onClick={onChange}
            required
          ></textarea>
        </div>
        {!geolocationEnabled && (
          <div>
            <label className="formLabel">Latitude</label>
            <input
              className="formInputSmall"
              type="number"
              id="latitude"
              value={latitude}
              onClick={onChange}
              required
            />
            <div>
              <label className="formLabel">Longitude</label>
              <input
                className="formInputSmall"
                type="number"
                id="longitude"
                value={longitude}
                onClick={onChange}
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
            onClick={onChange}
            required
          />
        </div>
        <div>
          <label>Images</label>
          <input
            type="file"
            id={images}
            onClick={onChange}
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
