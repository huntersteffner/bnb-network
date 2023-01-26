import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import houseLink from '../img/house-link.jpg'
import condoLink from '../img/condo-link.jpg'
import apartmentLink from '../img/apartment-link.jpg'
import cabinLink from '../img/cabin-link.jpg'
import roomLink from '../img/room-link.jpg'

const Explore = () => {
  return (
    <>
      <Carousel />
      <h1 className="title">What type of BNB are you looking for?</h1>
      <div className="">
        <div className="card w-96 bg-base-100 shadow-xl">
          <Link to="/explore-results/house">
          <p className="text-2xl font-bold">House</p>
            <img
              className="object-cover w-[22rem] h-[15rem]"
              src={houseLink}
              alt="House"
            />
          </Link>
        </div>
        <Link to="/explore-results/condo">
          <img src={condoLink} alt="Condo" />
          <p>Condo</p>
        </Link>
        <Link to="/explore-results/cabin">
          <img src={cabinLink} alt="Cabin" />
          <p>Cabin</p>
        </Link>
        <Link to="/explore-results/apartment">
          <img src={apartmentLink} alt="Apartment" />
          <p>Apartment</p>
        </Link>
        <Link to="/explore-results/room">
          <img src={roomLink} alt="Room" />
          <p>Room</p>
        </Link>
      </div>
    </>
  )
}

export default Explore
