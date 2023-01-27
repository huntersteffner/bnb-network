import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase.config'

const Profile = () => {
  const navigate = useNavigate()

  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [history, setHistory] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  // Logout button
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  // It calls every location that this user has published as owning
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
    }

    fetchListings()
  }, [auth.currentUser.uid])
  // Pulls trips that user has booked in the past
  useEffect(() => {
    const fetchListings = async () => {
      const historyData = collection(db, 'bookedTrips')

      const q = query(
        historyData,
        where('customerId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const queryData = await getDocs(q)

      const history = []

      queryData.forEach((doc) => {
        return history.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setHistory(history)
      setLoading(false)
    }

    fetchListings()
  }, [auth.currentUser.uid])

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
              {/* After loading, it shows the most recent trip user has been on with a link to see full history */}
              {!loading && history?.length > 0 ? (
                <>
                  <p className="text-2xl">{history[0].data.locationName}</p>
                  <img
                    className="explore-link"
                    src={history[0].data.image}
                    alt="Last Booked Trip"
                  />
                  <p className="text-2xl">{history[0].data.locationDates}</p>
                </>
              ) : (
                <>
                  <p className="text-2xl">You haven't booked any trips yet.</p>
                </>
              )}

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
            {/* Link to create new location */}
            <Link to="/create-location">
              <button className="btn btn-primary mt-5">Add New Property</button>
            </Link>
            <div className="card-body">
              {/* After loading, it shows every location the user has published, or it says that no locations have been published */}
              {!loading && listings?.length > 0 ? (
                <>
                  {listings.map((listing, index) => (
                    <div className="bg-base-100">
                      <img
                        className="explore-link"
                        src={listing.data.imgUrls[0]}
                        alt={`Location ${index + 1}`}
                      />
                      <p className="card-title">{listing.data.name}</p>
                      <p>{listing.data.location}</p>
                      <Link to={`/edit-location/${listing.id}`}>
                        <button className="btn btn-warning w-full">Edit</button>
                      </Link>
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
