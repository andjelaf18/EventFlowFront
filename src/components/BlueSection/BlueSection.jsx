import './BlueSection.css'

function BlueSection (){

    return (
        <>
        <section className="blue-section">
            <div className="container">
                <h2 className="section-title">Zašto EventFlow?</h2>
                <div className="features-grid">

                    <div className="feature-card">
                        <img src="/slika1.png" alt="" />
                        <h3>Planiraj bez haosa</h3>
                        <p>Kreiraj događaje, organizuj ljude i prati svaki korak — sve na jednom mestu.</p>
                    </div>

                    <div className="feature-card">
                        <img src="/slika2.png" alt="" />
                        <h3>Lakša komunikacija</h3>
                        <p>Sve informacije i dogovori su transparentni, najnovije informacije u realnom vremenu.</p>
                    </div>

                    <div className="feature-card">
                        <img src="/slika3.png" alt="" />
                        <h3>Potpuna kontrola</h3>
                        <p>Uvek znaš ko šta radi i šta sledi. Organizacija nikada nije bila jednostavnija.</p>
                    </div>
                </div>
            </div>
        </section>
        
        </>
    )
}
export default BlueSection