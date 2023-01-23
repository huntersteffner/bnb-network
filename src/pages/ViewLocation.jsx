import { useEffect, useState, Component } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Loading from '../components/Loading'
// import { DateRangePicker } from 'react-date-range'
import { Calendar, DateRange, DateRangePicker } from 'react-date-range'
import format from 'date-fns/format'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns/esm'

// import { DateRangePicker } from 'rsuite'
// import 'rsuite/dist/styles/rsuite-default.css'

const ViewLocation = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const [range, setRange] = useState([
    {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: 'selection'
    }
  ])

//   const calendarHandler =(date) => {
//     console.log(format(date, 'MM/dd/yyyy'))
//     // setCalendar(format(date, 'MM/dd/yyyy'))
//   }

  useEffect(() => {
    // setCalendar(() => {
    //     setCalendar(format(new Date(), 'MM/dd/yyyy'))
    // })
  }, [])

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
        {/* <DateRangePicker showOneCalendar /> */}
        {/* <DateRangePicker/> */}
        <form>
            {/* <input readOnly value={calendar} /> */}
            {/* <Calendar date={new Date()} onChange={calendarHandler}/> */}
            <input id='dateRange' readOnly value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(range[0].endDate, 'MM/dd/yyyy')}`} />
            <DateRange 
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction='horizontal'

            />
            {/* <DateRangePicker/> */}
            <button className='btn'>Book</button>
        </form>
    </div>
  )
}

export default ViewLocation
