import './AgendaParticipantSection.css';
import Alert from "../Alerts/Alerts.jsx";

import { useState, useEffect } from 'react';

function AgendaParticipantSection() {
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const [dogadjaji, setDogadjaji] = useState([]);
    const [filtriraniDogadjaji, setFiltriraniDogadjaji] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedDogadjaj, setSelectedDogadjaj] = useState(null);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [delovi, setDelovi] = useState([]);

    const tipPodeoka = (tip) => {
        switch (Number(tip)) {
            case 0: return "Buđenje";
            case 1: return "Doručak";
            case 2: return "Ručak";
            case 3: return "Večera";
            case 4: return "Pauza";
            case 5: return "Sesija";
            case 6: return "Druženje";
            default: return "Nepoznato";
        }
    };

    const formatDatum = (datum) => {
        if (!datum) return "-";
        return new Date(datum).toLocaleDateString();
    };

    const formatVreme = (vreme) => {
        if (!vreme) return "-";
        return vreme.slice(0, 5);
    };

    const fetchDogadjaji = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://localhost:7080/api/Dogadjaj/VratiSveDogadjaje",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();

                setDogadjaji(data);

                const filtrirani = data.filter(d =>
                    d.ime.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setFiltriraniDogadjaji(filtrirani);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje događaja.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju događaja.",
                tip: "error"
            });
        }
    };

    const fetchAgenda = async (dogadjajId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://localhost:7080/api/Agenda/AgendaZaDogadjaj/${dogadjajId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setSelectedAgenda(data);
            } else {
                setSelectedAgenda(null);
                setDelovi([]);

                setAlertInfo({
                    poruka: "Agenda za izabrani događaj nije pronađena.",
                    tip: "warning"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju agende.",
                tip: "error"
            });
        }
    };

    const fetchDelovi = async (agendaId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://localhost:7080/api/Deo/agenda/${agendaId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setDelovi(data);
            } else {
                setDelovi([]);
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju delova agende.",
                tip: "error"
            });
        }
    };

    useEffect(() => {
        fetchDogadjaji();
    }, [searchQuery]);

    useEffect(() => {
        if (selectedDogadjaj) {
            fetchAgenda(selectedDogadjaj.id);
        }
    }, [selectedDogadjaj]);

    useEffect(() => {
        if (selectedAgenda) {
            fetchDelovi(selectedAgenda.id);
        }
    }, [selectedAgenda]);

    return <>

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

        <div className="sekcija-kontejner">
            <h1 className="naslov">Agenda</h1>
        </div>

        <div className="agenda-layout">
            <div className="agenda-sidebar">
                <div className="agenda-sidebar-header d-flex flex-column">
                    <h3>Lista događaja</h3>
                    <p className="text-muted mb-2 tekstPanelLevo">
                        Kliknite na događaj da biste videli agendu.
                    </p>
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
                        <div
                            className={`agenda-dogadjaj-card ${selectedDogadjaj?.id === d.id ? "active" : ""
                                }`}
                            key={d.id}
                            onClick={() => setSelectedDogadjaj(d)}
                        >
                            <div className="agenda-dogadjaj-info">
                                <h5>{d.ime}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="agenda-main-panel">
                <div className="agenda-main-header">
                    <div>
                        <h2 className="agenda-naziv">
                            {selectedDogadjaj
                                ? selectedDogadjaj.ime
                                : "Izaberite događaj sa leve strane"}
                        </h2>

                        {selectedDogadjaj && (
                            <div className="agenda-meta">
                                <span>
                                    <i className="bi bi-calendar-event"></i>
                                    {formatDatum(selectedDogadjaj.datumOd)}
                                    {" - "}
                                    {formatDatum(selectedDogadjaj.datumDo)}
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
                        <p>
                            Sa leve strane odaberite događaj kako biste prikazali
                            raspored aktivnosti.
                        </p>
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
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {delovi.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            Nema delova agende.
                                        </td>
                                    </tr>
                                ) : (
                                    delovi.map((deo, index) => (
                                        <tr key={deo.id}>
                                            <td>{index + 1}</td>
                                            <td>{formatDatum(deo.datum)}</td>
                                            <td>{formatVreme(deo.vremeOd)}</td>
                                            <td>{formatVreme(deo.vremeDo)}</td>
                                            <td>{tipPodeoka(deo.tip)}</td>

                                            <td>
                                                {deo.tip === 5
                                                    ? deo.sesije?.[0]?.imeSesije || "-"
                                                    : "-"}
                                            </td>

                                            <td>
                                                {deo.tip === 5 ? (
                                                    deo.sesije?.length > 0 ? (
                                                        <span className="badge bg-success">
                                                            Zakazana sesija
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-warning text-dark">
                                                            Termin još nije popunjen
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="badge bg-secondary">
                                                        Planirano
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


    </>


} export default AgendaParticipantSection