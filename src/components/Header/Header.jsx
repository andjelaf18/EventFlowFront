
import './Header.css'

//import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Header(){

  /* const [reg, setReg] = useState(0);

  useEffect(() => {
      SetReg(() => );
    }, [reg]); */

    return ( //HEADER I MENI
        <>

        <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">

        <Link to="/" className="logo d-flex align-items-center me-auto">
          <img public = "logo+ime.png" alt=""/> 
          <h1 className="sitename">EventFlow</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/">Početna</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
            <li><Link to="/team">Tim</Link></li>
          </ul>

          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i> {/*ovo je da se meni pokazuje kao tri crtice kad se pristupi od telefon na sajt */}
        </nav>

          <div className="search-box">
              <input type="text" placeholder="Pretraži događaj" />
              <button className="search-btn">
                <i className="bi bi-search"></i>
              </button>
          </div>
        
        <Link className="btn-getstarted" to="/registracija">Registruj se</Link>
        <Link className="btn-getstarted" to="/login">Prijavi se</Link>

        </div>
        </header>
        
        </>
    )

}
export default Header