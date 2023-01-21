import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import Loading from '../components/Loading'

const ExploreResults = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [prevFetchedListing, setPrevFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = collection(db, 'listings')

        const q = query(
          listingsData,
          where('type', '==', params.locationType),
          orderBy('timestamp', 'desc'),
          limit(10)
        )
        

        const queryData = await getDocs(q)
        let listings = []

        queryData.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
        alert('Could not fetch listings')
      }
    }
    fetchListings()
  }, [params.locationType])

  return <h1>Results</h1>
}

export default ExploreResults
