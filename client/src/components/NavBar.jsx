import { Link } from 'react-router-dom'
import logo from '../assets/LogoFinal-no-background.png'
import './NavBar.css'

function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo-link" aria-label="Home">
        <img
          src={logo}
          alt="AvaDennis"
          className="nav-logo"
        />
      </Link>
      <ul className="nav-menu">
        <li>
          <Link to="/how-it-was-built">How It Was Built</Link>
        </li>
        <li>
          <Link to="/indicator-updates">Indicator Updates</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav