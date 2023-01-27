import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import Loading from '../components/Loading'

const ExploreResults = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()

  // Fetches all locations that match what the page is specified for
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = collection(db, 'listings')

        // The params are used to specify that only locations that match what the page is for are selected
        const q = query(
          listingsData,
          where('type', '==', params.locationType),
          orderBy('timestamp', 'desc')
        )

        const queryData = await getDocs(q)
        let listings = []

        // data is pushed to listings
        queryData.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        // listings state is updated
        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
        alert('Could not fetch listings')
      }
    }
    fetchListings()
  }, [params.locationType])

  return (
    <div className="min-h-[80vh] container mx-auto flex flex-col items-center">
      <h1 className="title">
        Results for{' '}
        {params.locationType.charAt(0).toUpperCase() +
          params.locationType.slice(1)}
      </h1>
      <div>
        {/* After it's done loading, it maps every state that is pulled */}
        {loading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            {listings.map((listing, index) => (
              <div className="explore-card">
                <p className="card-title">{listing.data.name}</p>
                <div className="card-body">
                  <img className='explore-link' src={listing.data.imgUrls[0]} alt={`Location ${index +1}`} />
                  <p>{listing.data.location}</p>
                  <p>${listing.data.price}/night</p>

                  <Link to={`/view-location/${listing.id}`}>
                    <button className="btn btn-warning">
                      More Information
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </>
        ) : (
          // If no locations have been created for this category, it displays this.
          <h2 className="text-3xl">No locations have been created yet.</h2>
        )}
      </div>
    </div>
  )
}

export default ExploreResults
