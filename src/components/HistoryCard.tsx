import React from 'react'
import { Link } from 'react-router-dom'
import { HistoryData } from '../types'

const HistoryCard = ({ history, id }: {history: HistoryData, id: string}) => {
  // History Card info is passed by props
  return (
    <div className="card w-96 bg-base-100 shadow-xl lg:w-1/2">
      <figure>
        <img className='explore-link' src={history.image} alt={`Location: ${id}`} />
      </figure>
      <div className="card-body m-3">
        <h2 className="card-title">{history.locationName}</h2>
        <p>
          Type: {history.type.charAt(0).toUpperCase() + history.type.slice(1)}
        </p>
        <p>At {history.locationAddress}</p>
        <p>From {history.locationDates}</p>
        <div className="card-actions justify-end">
          <Link to={`/view-location/${history.locationId}`}>
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
