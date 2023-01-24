import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import Loading from '../components/Loading'

const History = () => {
  const navigate = useNavigate()

  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      const listingsData = collection(db, 'bookedTrips')

      const q = query(
        listingsData,
        where('customerId', '==', auth.currentUser.uid),
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
    <div>
      <h1>Your Trip History</h1>
      <div>
        {loading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            {listings.map((listing) => (
              <>
                <p>{listing.data.locationName}</p>
                <img src={listing.data.image} alt={`First image for ${listing.data.locationName}`} />
              </>
            ))}
          </>
        ) : (
          <p>No history</p>
        )}
      </div>
    </div>
  )
}

export default History
