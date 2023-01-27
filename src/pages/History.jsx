import { useNavigate } from 'react-router-dom'
import { useState, useEffect,  } from 'react'
import { getAuth,} from 'firebase/auth'
import { db } from '../firebase.config'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import Loading from '../components/Loading'
import HistoryCard from '../components/HistoryCard'

const History = () => {
  const navigate = useNavigate()

  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  // Fetches previously booked trips
  useEffect(() => {
    const fetchListings = async () => {
      const listingsData = collection(db, 'bookedTrips')

      // It specifies to only book the trips that have booked by the current user
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
    }

    fetchListings()
  }, [auth.currentUser.uid])

  return (
    <div className='container mx-auto min-h-screen'>
      <h1 className='title'>Your Trip History</h1>
      <div className='flex flex-col justify-center items-center space-y-6 my-3'>
        {/* After it's done loading it either loads every location the logged in user has previously booked in the base, or it says that no trips have been booked */}
        {loading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            {listings.map((listing) => (
              <>
                <HistoryCard listing={listing.data} id={listing.id} key={listing.id} />
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
