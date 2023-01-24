const HistoryCard = ({ listing, id }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl lg:w-1/2">
      <figure>
        <img src={listing.image} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {listing.locationName}
        </h2>
        <p>Type: {listing.type}</p>
        <p>{listing.locationAddress}</p>
        <p>{listing.locationDates}</p>
        <div className="card-actions justify-end">
          <button className="btn">Book Again</button>
        </div>
      </div>
    </div>
  )
}

export default HistoryCard
