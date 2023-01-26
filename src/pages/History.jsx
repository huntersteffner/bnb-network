import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect,  } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
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
import HistoryCard from '../components/HistoryCard'

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
    <div className='container mx-auto'>
      <h1 className='title'>Your Trip History</h1>
      <div className='flex flex-col justify-center items-center space-y-6 my-3'>
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
