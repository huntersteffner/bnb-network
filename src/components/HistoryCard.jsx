import { Link } from 'react-router-dom'

const HistoryCard = ({ listing, id }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl lg:w-1/2">
      <figure>
        <img src={listing.image} alt="Shoes" />
      </figure>
      <div className="card-body m-3">
        <h2 className="card-title">{listing.locationName}</h2>
        <p>
          Type: {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
        </p>
        <p>At {listing.locationAddress}</p>
        <p>From {listing.locationDates}</p>
        <div className="card-actions justify-end">
          <Link to={`/view-location/${listing.locationId}`}>
            <button className="btn btn-secondary w-full md:w-auto">
              Book Again
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HistoryCard
