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
  // const [history, setHistory] = useState(null)
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

      console.log(query)

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
  // useEffect(() => {
  //   const fetchListings = async () => {
  //     const historyData = collection(db, 'bookedTrips')

  //     const q = query(
  //       historyData,
  //       where('customerId', '==', auth.currentUser.uid),
  //       orderBy('timestamp', 'desc')
  //     )

  //     const queryData = await getDocs(q)

  //     const history = []

  //     queryData.forEach((doc) => {
  //       return history.push({
  //         id: doc.id,
  //         data: doc.data(),
  //       })
  //     })

  //     setHistory(history)
  //     setLoading(false)

      
  //   }

  //   fetchListings()
  // }, [auth.currentUser.uid])

  return (
    <>
      <div className="bg-neutral py-3">
        <div className="flex justify-around items-center w-full">
          <h1 className="text-3xl text-neutral-content font-bold">{`${name}'s profile`}</h1>
          <button
            onClick={onLogout}
            className="btn btn-secondary justify-items-end"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto min-h-[80vh]">
        <div className="flex flex-col w-full justify-center items-center">
          <div className="card justify-center items-center py-4 w-96 bg-base-100 shadow-xl px-4 my-3">
            <div className="card-body">
              <p className="title">Most Recent Trip</p>
              <p className="text-2xl">Beautiful Beach Condo</p>
              <p className="text-xl">Sept 13, 2023 - Sept 19, 2023</p>
              <p>img</p>
              <div className="flex justify-center items-center">
                <p className="text-xl font-bold text-center w-[40%]">
                  See complete trip history
                </p>
                <Link to="/history">
                  <button className="btn btn-primary">Click Here</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="card justify-center items-center py-4 w-96 bg-base-100 shadow-xl my-3">
            <h2 className="title">Your Properties</h2>
            <Link to="/create-location">
              <button className="btn btn-primary mt-5">Add New Property</button>
            </Link>
            <div className="card-body">
              {!loading && listings?.length > 0 ? (
                <>
                  {listings.map((listing, index) => (
                    <div className='bg-base-100'>
                      <img className='explore-link' src={listing.data.imgUrls[0]} alt={`Location ${index +1}`} />
                      <p className='card-title'>{listing.data.name}</p>
                      <p>{listing.data.location}</p>
                      <Link to={`/edit-location/${listing.id}`}><button className='btn btn-warning w-full'>Edit</button></Link>
                    </div>
                  ))}
                  
                  
                </>
              ) : (
                <p className="font-bold text-xl text-center">
                  You have not posted any properties!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
