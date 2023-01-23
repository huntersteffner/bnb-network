import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Loading from '../components/Loading'

const ViewLocation = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.locationId)
      const docData = await getDoc(docRef)

      if (docData.exists()) {
        console.log(docData.data())
        setListing(docData.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])
  if (loading) {
    return <Loading />
  }

  return (
    <div>
        <h1>{listing.name}</h1>
        <img src={listing.imgUrls[0]} alt="" />
        <p>Book rooms</p>
    </div>
  )
}

export default ViewLocation
