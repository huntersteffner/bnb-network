import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import Loading from './Loading'

const Carousel = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const locationsRef = collection(db, 'listings')
      const q = query(locationsRef, orderBy('timestamp', 'desc'), limit(5))
      const queryData = await getDocs(q)

      let listings = []

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
  }, [])

  if (loading) {
    return <Loading />
  }

  if (listings.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
        <div className="carousel carousel-end rounded-box">
          {listings.map(({ data, id }) => (
            <div className="carousel-item h-[50vh]">
              <img src={data.imgUrls[0]} alt="Drink" />
            </div>
          ))}
          {/* <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div>
          <div className="carousel-item">
            <img src="https://placeimg.com/400/300/arch" alt="Drink" />
          </div> */}
        </div>
      </>
    )
  )
}

export default Carousel
