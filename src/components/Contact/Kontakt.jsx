//import Header from './Header.jsx'
import DrustveneMreze from '../DrustveneMreze/DrustveneMreze.jsx';

import './Kontakt.css';

function Kontakt(){

    return ( 
        <>
        
        <div className="page-title light-background" data-aos="fade" style={{ backgroundImage: "url(assets/img/contact-page-title-bg.jpg)" }}>      
            <div className="container">
                <h1>Kontakt</h1>
            </div>
        </div>
            
        <section id="contact" className="contact section">

        <div className="container position-relative" data-aos="fade-up" data-aos-delay="100">

            <div className="row gy-4">

            <div className="col-lg-5 mojcss">
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                <i className="bi bi-geo-alt flex-shrink-0 belo"></i>
                <div>
                    <h3>Adresa</h3>
                    <p className='tekst'>Aleksandra Medvedeva 4, Niš</p>
                </div>
                </div>

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                <i className="bi bi-telephone flex-shrink-0 belo"></i>
                <div>
                    <h3>Pozovite nas</h3>
                    <p className='tekst'>+381 (18) 529-105</p>
                </div>
                </div>

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                <i className="bi bi-envelope flex-shrink-0 belo"></i>
                <div>
                    <h3>Pišite nam</h3>
                    <p className='tekst'>eventflow@example.com</p>
                </div>
                </div>

            </div>

            <div className="col-lg-7">
                <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="500">
                <div className="row gy-4">

                    <div className="col-md-6">
                    <input type="text" name="name" className="form-control" placeholder="Ime" required=""/>
                    </div>

                    <div className="col-md-6 ">
                    <input type="email" className="form-control" name="email" placeholder="Email" required=""/>
                    </div>

                    <div className="col-md-12">
                    <textarea className="form-control" name="message" rows="6" placeholder="Poruka" required=""></textarea>
                    </div>

                    <div className="col-md-12 text-center">
                    <div className="loading">Učitavanje</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Poslali ste poruku!</div>

                    <button type="submit" className='btn-getstarted'>Pošalji</button>
                    </div>

                </div>
                </form>
            </div>
            </div>

                </div>

        </section>

        <DrustveneMreze/> 

        </>

    )
}
export default Kontakt