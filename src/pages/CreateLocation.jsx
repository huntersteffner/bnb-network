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

  return (
    <div>
      <form>
        <div>
          <button
            type="button"
            className={
              type === 'house' ? 'btn btn-primary' : 'btn btn-secondary'
            }
            id="type"
            value="house"
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
          >
            Room
          </button>
        </div>
        <div>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Name"
            required
          />
        </div>
        <div>
          <input
            type="number"
            id="bedrooms"
            value={bedrooms}
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
            min="1"
            max="50"
            required
          />
        </div>
        <div>
          <label>Host Present</label>
          <button
            class={hostPresent ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="hostPresent"
            value={true}
          >
            Yes
          </button>
          <button
            class={!hostPresent ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="hostPresent"
            value={false}
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
          >
            Yes
          </button>
          <button
            class={!food ? 'btn btn-primary' : 'btn btn-secondary'}
            type="button"
            id="food"
            value={false}
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
              required
            />
            <div>
              <label className="formLabel">Longitude</label>
              <input
                className="formInputSmall"
                type="number"
                id="longitude"
                value={longitude}
                required
              />
            </div>
          </div>
        )}
        <div>
            <label>Price</label>
            <input type="number" id='price' value={price} required />
        </div>
        <div>
            <label>Images</label>
            <input type="file" id='images' max='6' accept='.jpg,.png,.jpeg' multiple required />
        </div>
        <button type='submit'>Submit Location</button>
      </form>
    </div>
  )
}

export default CreateLocation
