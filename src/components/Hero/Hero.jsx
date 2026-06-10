
import './Hero.css'

function Hero(){

    return ( //GLAVNI SADRZAJ I HERO SEKCIJA
        <>
        
        <main className="main">
            {/* HERO SEKSIJA */}
            <section id="hero" className="hero section">
            <div className="container">
                <div className="row gy-4">
                <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center" data-aos="zoom-out">
                    <h1>Organizuj događaje kao profesionalac</h1>
                    <p>EventFlow ti pomaže da planiraš, organizuješ i promovišeš događaje bez stresa</p>
                </div>
                <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="200">
                    <img src="/hero-img.png" className="img-fluid animated" alt="" />
                </div>
                </div>
            </div>
            </section>
        </main>
        
        </>
    )

}
export default Hero