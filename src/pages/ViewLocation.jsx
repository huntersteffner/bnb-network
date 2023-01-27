import { useEffect, useState, useRef } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  getDoc,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase.config'
import Loading from '../components/Loading'
// import { DateRangePicker } from 'react-date-range'
import { Calendar, DateRange, DateRangePicker } from 'react-date-range'
import format from 'date-fns/format'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { addDays } from 'date-fns/esm'
import { v4 as uuidv4 } from 'uuid'
import Carousel from '../components/Carousel'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

// import { DateRangePicker } from 'rsuite'
// import 'rsuite/dist/styles/rsuite-default.css'

const ViewLocation = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const [dateRangeForSubmit, setDateRangeForSubmit] = useState({})

  let currentUser = ''
  const { dateRange } = dateRangeForSubmit

  const [range, setRange] = useState([
    {
      // startDate: new Date(),
      // endDate: addDays(new Date(), 7),
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()
  const isMounted = useRef(true)

  const {} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GEOCODE_API_KEY,
  })

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigate('/login')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint=disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  let dateString = ''

  useEffect(() => {
    dateString = `${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(
      range[0].endDate,
      'MM/dd/yyyy'
    )}`

    const prepareToPost = async () => {
      await setDateRangeForSubmit({
        // locationDates: `${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(
        //   range[0].endDate,
        //   'MM/dd/yyyy'
        // )}`,
        locationDates: dateString,
        locationAddress: listing.location,
        customerId: auth.currentUser.uid,
        image: listing.imgUrls[0],
        locationId: params.locationId,
        locationName: listing.name,
        timestamp: serverTimestamp(),
        type: listing.type,
        ownerId: listing.userRef,
      })
    }

    prepareToPost()
  }, [range])

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user.uid
    }
  })

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
  }, [navigate, params.locationId])
  if (loading) {
    return <Loading />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const docRef = await addDoc(
      collection(db, 'bookedTrips'),
      dateRangeForSubmit
    )

    setLoading(false)
    // navigate('/history')
  }

  const onChange = (e) => {
    const input = document.getGetElementById('dateRange').value()
    console.log(input)
    setDateRangeForSubmit({
      locationDates: e.target.value,
    })

    console.log(dateRangeForSubmit)
  }

  return (
    <>
      <Swiper slidesPerView={1.05} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
                height: '50vh',
              }}
              className="relative w-full h-full"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-col justify-center items-center">
        {/* <img src={listing.imgUrls[0]} alt="" /> */}

        <div className="explore-card">
          <h1 className="title">{listing.name}</h1>
          <div className="card-body">
            <p className="text-lg font-semibold">Address: {listing.location}</p>
            <p className="text-lg font-semibold">${listing.price} per night</p>
          </div>
        </div>
        <div className="explore-card">
          <div className="card-body">
            <h1 className="title">Details</h1>
            <p className="text-lg font-semibold">{listing.bedrooms} Bedrooms</p>
            <p className="text-lg font-semibold">
              {listing.bathrooms} Bathrooms
            </p>
            <p className="text-lg font-semibold">
              {listing.food ? 'Host will provide food' : 'No food provided'}
            </p>
            <p className="text-lg font-semibold">
              {listing.hostPresent
                ? 'Host will be onsite'
                : 'Host will not be onsite'}
            </p>
          </div>
        </div>
        <GoogleMap
          zoom={10}
          center={{
            lat: listing.geolocation.lat,
            lng: listing.geolocation.lng,
          }}
          mapContainerClassName="w-full h-[50vh] md:h-[20vh] md:w-[50%]"
        >
          <MarkerF
            position={{
              lat: listing.geolocation.lat,
              lng: listing.geolocation.lng,
            }}
          />
        </GoogleMap>
        <p className="title">Book rooms</p>

        <form onSubmit={onSubmit} className="flex flex-col">
          <input
            id="dateRange"
            className="hidden"
            readOnly
            onChange={onChange}
            value={`${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(
              range[0].endDate,
              'MM/dd/yyyy'
            )}`}
          />
          <DateRange
            onChange={(item) => {
              setRange([item.selection])
            }}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            minDate={addDays(new Date(), 0)}
            direction="horizontal"
          />
          {/* <DateRangePicker/> */}
          <button type="submit" className="btn btn-warning my-3">
            Book
          </button>
        </form>
      </div>
    </>
  )
}

export default ViewLocation
