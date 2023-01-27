import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import Loading from './Loading'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'

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

      <Swiper slidesPerView={1} navigation={true} modules={[Navigation]} pagination={{clickable: true}}>
        {listings.map(({data,id}) => (
          <SwiperSlide key={id} onClick={()=> navigate(`/view-location/${id}`)}>
            <div style={{
              background: `url(${data.imgUrls[0]}) center no-repeat`,
              backgroundSize: 'cover',
              height: "50vw"
            }}>
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        
      </>
    )
  )
}

export default Carousel
