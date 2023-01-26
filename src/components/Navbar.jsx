import { Link } from 'react-router-dom'

const Navbar = () => {
  // jsx pulled from https://daisyui.com/components/navbar/
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-[18rem]"
          >
            <li >
              <Link className='text-3xl' to="/">Explore</Link>
            </li>
            <li>
              <Link className='text-3xl' to="/history">My History</Link>
            </li>
            <li>
              <Link className='text-3xl' to="/profile">My Profile</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <h1 className="title">Bnb Network</h1>
      </div>
      <div className="navbar-end"></div>
    </div>
  )
}

export default Navbar
