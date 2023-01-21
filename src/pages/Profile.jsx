import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'

const Profile = () => {
  const navigate = useNavigate()

  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    const fetchListings = async () => {
      const listingsData = collection(db, 'listings')

      const q = query(
        listingsData,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const queryData = await getDocs(q)

      const listings = []

      queryData.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)

      console.log(listings)
    }

    fetchListings()
  }, [auth.currentUser.uid])

  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-center items-center">
        <div className="flex">
          <h1 className="text-3xl font-bold">{`${name}'s profile`}</h1>
          <button onClick={onLogout} className="btn btn-secondary btn-outline">
            Logout
          </button>
        </div>
        <div>
          <div>
            <p>Next Trip</p>
            <p>Beautiful Beach Condo</p>
            <p>Sept 13, 2023 - Sept 19, 2023</p>
            <p>img</p>
          </div>
          <div>
            <p>Last Trip</p>
            <p>Beautiful Beach Condo</p>
            <p>Sept 13, 2023 - Sept 19, 2023</p>
            <p>img</p>
          </div>
          <div className="flex justify-center items-center">
            <p>See complete trip history</p>
            <Link to="/history">
              <button className="btn btn-primary">Click Here</button>
            </Link>
          </div>
        </div>
        <div>
          <h2>Your Properties</h2>
          <Link to='/create-location'>
            <button className='btn'>Add New Property</button>
          </Link>
          <div>
            {!loading && listings?.length > 0 ? (
              <>
                <p>{listings[0].data.name}</p>
                <img src={listings[0].data.imgUrls[0]} alt="" />
                <Link to={`/edit-location/${listings[0].id}`}>Edit</Link>
              </>
            ) : (<p>You have not posted any properties</p>)}
            <p>Title</p>
            <p>img</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
