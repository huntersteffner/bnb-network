import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'

const Explore = () => {
  return (
    <>
      <Carousel/>
      <h1>What type of BNB are you looking for?</h1>
      <div>
        <Link to="/explore-results/house">
          <p>House</p>
        </Link>
        <Link to="/explore-results/condo">
          <p>Condo</p>
        </Link>
        <Link to="/explore-results/room">
          <p>Room</p>
        </Link>
      </div>
    </>
  )
}

export default Explore
