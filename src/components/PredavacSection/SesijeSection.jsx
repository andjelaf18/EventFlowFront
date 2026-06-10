import './SesijeSection.css'
import Alert from '../Alerts/Alerts';

import { useState, useEffect } from 'react';

function SesijeSection (){

    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: "" 
    });

    // const [slotovi, setSlotovi] = useState([]);
    //const [sesije, setSesije] = useState([]);
    //const [unosiNaziva, setUnosiNaziva] = useState({});
    const token = localStorage.getItem("token");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSesijaModal, setShowSesijaModal] = useState(false);
    const [selectedDeo, setSelectedDeo] = useState(null);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [filtriraniDogadjaji, setFiltriraniDogadjaji] = useState([]);
    const [selectedDogadjaj, setSelectedDogadjaj] = useState(null);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [delovi, setDelovi] = useState([]);
    const [novaSesija, setNovaSesija] = useState({
        imeSesije: ""
    });

    const fetchDogadjaji = async () => {
        try {
            const res = await fetch(
                "https://localhost:7080/api/Dogadjaj/VratiSveDogadjaje",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if(res.ok){
                const data = await res.json();
                setDogadjaji(data);
                const filtrirani = data.filter(d =>
                    d.ime.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFiltriraniDogadjaji(filtrirani);
            }
        }
        catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDogadjaji();
    }, [searchQuery]);

    const fetchAgenda = async (dogadjajId) => {

        try {
            const res = await fetch(
                `https://localhost:7080/api/Agenda/AgendaZaDogadjaj/${dogadjajId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if(res.ok){
                const data = await res.json();
                setSelectedAgenda(data);
            }

        } catch(err){
            console.error(err);
        }
    };

    useEffect(() => {

        if(selectedDogadjaj){
            fetchAgenda(selectedDogadjaj.id);
        }

    }, [selectedDogadjaj]);

    const fetchDelovi = async (agendaId) => {

        try {
            const res = await fetch(
                `https://localhost:7080/api/Deo/agenda/${agendaId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if(res.ok){

                const data = await res.json();
                setDelovi(data);

            }

        } catch(err){
            console.error(err);
        }
    };

    useEffect(() => {

        if(selectedAgenda){
            fetchDelovi(selectedAgenda.id);
        }

    }, [selectedAgenda]);

    const otvoriPrijavuSesije = (deo) => {
        setSelectedDeo(deo);

        setNovaSesija({
            imeSesije: ""
        });

        setShowSesijaModal(true);
    };

    const prijaviSesiju = async () => {
        try {
            const token = localStorage.getItem("token");

            //console.log("selectedDeo =", selectedDeo);

            const requestBody = {
                imeSesije: novaSesija.imeSesije,
                vremePocetka: selectedDeo.vremeOd,
                vremeKraja: selectedDeo.vremeDo
            };

            //console.log(requestBody);

            const res = await fetch(
                `https://localhost:7080/api/Sesija/Rezervisi/${selectedDeo.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (res.ok) {
                setAlertInfo({
                    poruka: "Sesija uspešno prijavljena.",
                    tip: "success"
                });
                setShowSesijaModal(false);
                fetchDelovi(selectedAgenda.id);
            } else {
                const greskaTekst = await res.text();
                console.error("Bekhend je vratio grešku:", greskaTekst);

                setAlertInfo({
                    poruka: `Greška na serveru: ${res.status}. Proverite konzolu.`,
                    tip: "error"
                });
            }
        }
        catch (err) {
            console.error("Greška u prijavljivanju sesije na frontu:", err);
            setAlertInfo({
                poruka: "Greška pri prijavi sesije.",
                tip: "error"
            });
        }
    };


    return (
    <>
        <Alert
            tip={alertInfo.tip}
            poruka={alertInfo.poruka}
            onClose={() =>
                setAlertInfo({
                poruka: "",
                tip: ""
                })
            }
        />
        
        <div className='sekcija-kontejner'>
            <h1 className='naslov'>Sesije</h1>
        </div>
        
        <div className="agenda-layout">

            {/* LEVI PANEL - LISTA SVIH AGENDA / DOGAĐAJA */}
            <div className="agenda-sidebar">
                <div className="agenda-sidebar-header d-flex flex-column">
                    <h3>Lista događaja</h3> 
                    <p className="text-muted mb-2 tekstPanelLevo"> Kliknite na događaj da biste videli agendu.</p>
                </div>

                <div className="agenda-search-wrapper">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Pretraži događaje..."
                        className="form-control"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="agenda-dogadjaji-lista">
                    {filtriraniDogadjaji.map((d) => (
                        <div className={`agenda-dogadjaj-card ${selectedDogadjaj?.id === d.id ? "active" : ""}`}
                             key={d.id}
                             onClick={() => setSelectedDogadjaj(d)}>
                            <div className="agenda-dogadjaj-info">
                                <h5>{d.ime}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* DESNI PANEL - DETALJNO UCITANA AGENDA SA OPCIJAMA */}
            <div className="agenda-main-panel">
                <div className="agenda-main-header">
                    <div>
                        <h2 className="agenda-naziv">
                            {selectedDogadjaj ? selectedDogadjaj.ime : "Izaberite događaj sa leve strane"}
                        </h2>
                        {selectedDogadjaj && (
                            <div className="agenda-meta">
                                <span>
                                    <i className="bi bi-calendar-event"></i>
                                    {new Date(selectedDogadjaj.datumOd).toLocaleDateString()}
                                    {" - "}
                                    {new Date(selectedDogadjaj.datumDo).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                </div>

                <div className="agenda-tabs">
                    <button className="agenda-tab active">Agenda</button>
                </div>

                {!selectedDogadjaj ? (
                    <div className="agenda-empty-state">
                        <i className="bi bi-calendar-event"></i>
                        <h4>Nijedna agenda nije učitana</h4>
                        <p>Sa leve strane odaberite događaj kako biste prikazali detalje agende i upravljali rasporedom.</p>
                    </div>
                ) : (
                    <div className="agenda-tabela-wrapper">
                        <table className="table agenda-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Datum</th>
                                    <th>Vreme od</th>
                                    <th>Vreme do</th>
                                    <th>Tip</th>
                                    <th>Sesija</th>
                                    <th>Akcije</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {delovi.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Nema delova agende.</td>
                                </tr>
                            ) : (
                                delovi.map((deo, index) => (
                                    <tr key={deo.id}>
                                        <td>{index + 1}</td>
                                        <td>{new Date(deo.datum).toLocaleDateString()}</td>
                                        <td>{deo.vremeOd?.slice(0, 5)}</td>
                                        <td>{deo.vremeDo?.slice(0, 5)}</td>
                                        <td>
                                            {deo.tip === 0 && "budjenje"}
                                            {deo.tip === 1 && "dorucak"}
                                            {deo.tip === 2 && "rucak"}
                                            {deo.tip === 3 && "vecera"}
                                            {deo.tip === 4 && "pauza"}
                                            {deo.tip === 5 && "sesija"}
                                            {deo.tip === 6 && "druzenje"}
                                        </td>
                                        <td>
                                            {deo.tip === 5
                                                ? deo.sesije?.[0]?.imeSesije || "-"
                                                : "-"
                                            }
                                        </td>
                                        <td>
                                            {deo.tip !== 5 ? (

                                                <span className="text-muted">
                                                    -
                                                </span>

                                            ) : deo.sesije?.length > 0 ? (

                                                <span className="text-success fw-semibold">
                                                    Termin zauzet
                                                </span>

                                            ) : (

                                                <button
                                                    className="btn btn-primary btn-sm btn-tanji"
                                                    onClick={() => otvoriPrijavuSesije(deo)}
                                                >
                                                    Prijavi sesiju
                                                </button>

                                            )}
                                        </td>
                                        <td>
                                            {deo.tip !== 5 ? (
                                                "-"
                                            ) : deo.sesije?.length > 0 ? (
                                                <span className="badge bg-success">
                                                    Rezervisano
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning text-dark">
                                                    Slobodan termin
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

        {showSesijaModal && (

        <div className="agenda-modal-overlay">
            <div className="agenda-modal">
                <h3>Prijava sesije</h3>

                <div className="alert alert-info">

                    <strong>Datum:</strong>
                    {" "}
                    {new Date(selectedDeo.datum).toLocaleDateString()}

                    <br/>

                    <strong>Termin:</strong>
                    {" "}
                    {selectedDeo.vremeOd?.slice(0,5)}
                    -
                    {selectedDeo.vremeDo?.slice(0,5)}

                </div>

                <div className="mb-3">
                    <label>Naziv sesije</label>
                    <input
                        type="text"
                        className="form-control"
                        value={novaSesija.imeSesije}
                        onChange={(e) =>
                            setNovaSesija({
                                ...novaSesija,
                                imeSesije: e.target.value
                            })
                        }
                    />
                </div>

                <div className="agenda-modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowSesijaModal(false)}
                    >
                        Otkaži
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={prijaviSesiju}
                    >
                        Potvrdi
                    </button>

                </div>
            </div>
        </div>
        )}
        

    </>
    )

}export default SesijeSection