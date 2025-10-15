import React, { useState } from "react";
import "./navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
        <img src="navas_logo2.jpg" alt="Navaasss Logo" className="nav-logo-image" />
      <div className="nav-logo">Navaasss</div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {/* hamburger icon */}
        <div className={menuOpen ? "bar rotate1" : "bar"}></div>
        <div className={menuOpen ? "bar fade" : "bar"}></div>
        <div className={menuOpen ? "bar rotate2" : "bar"}></div>
      </div>

      <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li><a href="/" onClick={() => setMenuOpen(false)}>Home</a></li>
        <li><a href="/people" onClick={() => setMenuOpen(false)}>Members</a></li>
        {/* <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li> */}
        {/* <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
