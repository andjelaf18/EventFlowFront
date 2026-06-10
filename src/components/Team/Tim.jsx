import './Tim.css'
import DrustveneMreze from '../DrustveneMreze/DrustveneMreze.jsx'; 

function Tim(){

    return (
    <> 
      <div className="page-title light-background" data-aos="fade" style={{ backgroundImage: "url(assets/img/contact-page-title-bg.jpg)" }}>      
            <div className="container">
                <h1>SignalR-oseos Ladies</h1>
                <h3>Stručni tim (budućih) inženjera koji stoji iza ovog projekta je predstavljen u nastavku</h3>
            </div>
        </div>

        <section className="section">
            <div className="container">
                <div className="row gy-4 justify-content-center">
                    
                   
                    <div className="col-lg-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <div className="team-member d-flex align-items-start">
                            <div className="pic">
                                <img src="/kristina.png" className="img-fluid" alt="Kristina Zdravković"/>
                            </div>
                            <div className="member-info">
                                <h4>Kristina Zdravković</h4>
                                <span>Backend developer</span>
                                <div className="info">
                                    <ul>
                                        <li>Ličnost motivisana zadatkom</li>
                                        <li>Praktična i dosledna</li>
                                        <li>Cilj: sticanje iskustva u Web projektovanju i programiranju</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                        <div className="team-member d-flex align-items-start">
                            <div className="pic">
                                <img src="/andjela.png" className="img-fluid" alt="Anđela Filipović"/>
                            </div>
                            <div className="member-info">
                                <h4>Anđela Filipović</h4>
                                <span>Frontend developer</span>
                                <div className="info">
                                    <ul>
                                        <li>Ličnost koja se sama motiviše</li>
                                        <li>Razvijen osećaj za detalje</li>
                                        <li>Cilj: praćenje procesa projektovanja celokupnog softvera i proces kreiranja njegove neophodne dokumentacije</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <DrustveneMreze/> 
    </>
    )
}
export default Tim