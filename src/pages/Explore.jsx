import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import houseLink from '../img/house-link.jpg'
import condoLink from '../img/condo-link.jpg'
import apartmentLink from '../img/apartment-link.jpg'
import cabinLink from '../img/cabin-link.jpg'
import roomLink from '../img/room-link.jpg'

const Explore = () => {
  return (
    <div className='min-h-screen'>
      <Carousel />
      <h1 className="title">What type of BNB are you looking for?</h1>
      <h2 className='title'>Click Below</h2>
      <div className="flex flex-col justify-center items-center md:flex-row md:flex-wrap">
        
          <Link className="explore-card" to="/explore-results/house">
            <p className="explore-title">House</p>
            <img
              className="explore-link"
              src={houseLink}
              alt="House"
            />
          </Link>
        
        <Link className="explore-card" to="/explore-results/condo">
          <p className='explore-title'>Condo</p>
          <img className="explore-link" src={condoLink} alt="Condo" />
        </Link>
        <Link className="explore-card" to="/explore-results/cabin">
          <p className='explore-title'>Cabin</p>
          <img className="explore-link" src={cabinLink} alt="Cabin" />
        </Link>
        <Link className="explore-card" to="/explore-results/apartment">
          <p className='explore-title'>Apartment</p>
          <img className="explore-link" src={apartmentLink} alt="Apartment" />
        </Link>
        <Link className="explore-card" to="/explore-results/room">
          <p className='explore-title'>Room</p>
          <img className="explore-link" src={roomLink} alt="Room" />
        </Link>
      </div>
    </div>
  )
}

export default Explore
