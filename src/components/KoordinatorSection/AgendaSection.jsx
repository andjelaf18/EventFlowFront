import './AgendaSection.css';
import Alert from '../Alerts/Alerts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AgendaSection() {

    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });
    //za paneli
    const [dogadjaji, setDogadjaji] = useState([]);
    const [filtriraniDogadjaji, setFiltriraniDogadjaji] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDogadjaj, setSelectedDogadjaj] = useState(null);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [delovi, setDelovi] = useState([]);
    //za navigaciju na stranicu za Dogadjaje ako koordinator zeli da radi crud operacije nad dogadjajem
    const navigate = useNavigate();
    //za upravljenje delovima (slotovima) u agendi
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedDeo, setSelectedDeo] = useState(null);
    //za sesije i izmene
    const [showSesijaModal, setShowSesijaModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [sesije, setSesije] = useState([]);
    const [novaSesija, setNovaSesija] = useState({
        imeSesije: "",
        vremePocetka: "",
        vremeKraja: ""
    });

    useEffect(() => {

        fetchDogadjaji();

    }, [searchQuery]);

    const fetchDogadjaji = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                "https://localhost:7080/api/Dogadjaj/VratiSveDogadjaje",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (res.ok) {
                const data = await res.json();

                /*const filtrirani = data.filter(d => //rucno filtriranje po naziv dogadjaja jer nemam backedn za to
                    d.ime?.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setDogadjaji(data);
                setFiltriraniDogadjaji(filtrirani);*/

                const saStatusom = await Promise.all(
                    data.map(async (d) => {
                        try {
                            const statusRes = await fetch(
                                `https://localhost:7080/api/Dogadjaj/AgendaStatus/${d.id}`,
                                {
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    }
                                }
                            );

                            if (statusRes.ok) {
                                const statusData = await statusRes.json();
                                return {
                                    ...d,
                                    agendaPrazna: statusData.agendaPrazna
                                };
                            }
                        } catch (err) {
                            console.error(`Greška pri dobijanju statusa za događaj ${d.id}:`, err);
                        }

                        return { ...d, agendaPrazna: true };
                    })
                );
                const filtrirani = saStatusom.filter(d =>
                    d.ime?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setDogadjaji(saStatusom);
                setFiltriraniDogadjaji(filtrirani);
            }
        } catch (err) {

            console.error(err);

        }
    };

    useEffect(() => {

        if (selectedDogadjaj) {
            fetchAgenda(selectedDogadjaj.id);
        }

    }, [selectedDogadjaj]);

    const fetchAgenda = async (dogadjajId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://localhost:7080/api/Agenda/AgendaZaDogadjaj/${dogadjajId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setSelectedAgenda(data);
            } else {
                setSelectedAgenda(null);
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        if (selectedAgenda) {
            fetchDelovi(selectedAgenda.id);
        }

    }, [selectedAgenda]);

    const fetchDelovi = async (agendaId) => {

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://localhost:7080/api/Deo/agenda/${agendaId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setDelovi(data);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const obrisiDeo = async (id) => {
        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://localhost:7080/api/Deo/ObrisiDeo/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                setAlertInfo({
                    poruka: "Deo uspešno obrisan.",
                    tip: "success"
                });

                fetchDelovi(selectedAgenda.id);
            }

        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri brisanju.",
                tip: "error"
            });
        }
    };

    const [noviDeo, setNoviDeo] = useState({
        datum: "",
        vremeOd: "",
        vremeDo: "",
        tip: 0
    });

    const sacuvajDeo = async () => {
        try {
            const token = localStorage.getItem("token");
            const formatirajVreme = (vreme) => {
                if (!vreme) return "00:00:00";
                if (vreme.length === 5) return `${vreme}:00`; // "14:30" -> "14:30:00"
                return vreme;
            };

            let ispravanDatum = noviDeo.datum;
            if (ispravanDatum && !ispravanDatum.includes("T")) {
                ispravanDatum = `${ispravanDatum}T00:00:00`;
            }

            const body = {
                id: editMode && selectedDeo ? selectedDeo.id : 0,
                datum: ispravanDatum,
                vremeOd: formatirajVreme(noviDeo.vremeOd),
                vremeDo: formatirajVreme(noviDeo.vremeDo),
                tip: Number(noviDeo.tip),
                agendaId: selectedAgenda.id
            };

            let url = "https://localhost:7080/api/Deo/DodajDeo";
            let method = "POST";

            if (editMode && selectedDeo) {
                url = `https://localhost:7080/api/Deo/IzmeniDeo${selectedDeo.id}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setAlertInfo({
                    poruka: editMode ? "Slot uspešno izmenjen." : "Slot uspešno dodat.",
                    tip: "success"
                });

                setShowModal(false);
                fetchDelovi(selectedAgenda.id);

            } else {
                console.error("Server vratio grešku:", res.status);
                setAlertInfo({
                    poruka: `Server je vratio status ${res.status}. Pogledaj konzolu.`,
                    tip: "error"
                });
            }

        } catch (err) {
            console.error("Greška u fetch-u:", err);
            setAlertInfo({
                poruka: "Greška na klijentu.",
                tip: "error"
            });
        }
    };

    const otvoriSesije = async (deo) => {
        setSelectedSlot(deo);
        setSesije(deo.sesije || []);
        setShowSesijaModal(true);
    };

    const dodajSesiju = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                imeSesije: novaSesija.imeSesije,
                vremePocetka: novaSesija.vremePocetka,
                vremeKraja: novaSesija.vremeKraja
            };

            const res = await fetch(
                `https://localhost:7080/api/Sesija/Rezervisi/${selectedSlot.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {

                setAlertInfo({
                    poruka: "Sesija uspešno dodata.",
                    tip: "success"
                });

                // refresh slotova
                fetchDelovi(selectedAgenda.id);

                // refresh modala
                setSesije([
                    ...sesije,
                    body
                ]);

                setNovaSesija({
                    imeSesije: "",
                    vremePocetka: "",
                    vremeKraja: ""
                });

                const formatirajVreme = (vreme) => {
                    if (!vreme) return null;
                    if (vreme.length === 5) return `${vreme}:00`;
                    return vreme;
                };

            } else {

                const greska = await res.text();

                setAlertInfo({
                    poruka: greska,
                    tip: "error"
                });
            }

        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri dodavanju sesije.",
                tip: "error"
            });
        }
    };

    const fetchSlobodniSlotovi = async () => {
        if (!selectedAgenda) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://localhost:7080/api/Agenda/slobodni-slotovi/${selectedAgenda.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setDelovi(data);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const pokreniIzmenuSlota = (deo) => {
        setSelectedDeo(deo);
        setEditMode(true);

        setNoviDeo({
            datum: deo.datum?.split("T")[0] || "",
            vremeOd: deo.vremeOd?.slice(0, 5) || "",
            vremeDo: deo.vremeDo?.slice(0, 5) || "",
            tip: deo.tip
        });

        setShowModal(true);
    };
    const sacuvajIzmenuSlota = async () => {
        try {
            const token = localStorage.getItem("token");

            const body = {
                id: selectedDeo.id,
                datum: `${noviDeo.datum}T00:00:00`,
                vremeOd: `${noviDeo.vremeOd}:00`,
                vremeDo: `${noviDeo.vremeDo}:00`,
                tip: Number(noviDeo.tip),
                agendaId: selectedAgenda.id
            };

            const res = await fetch(
                `https://localhost:7080/api/Deo/IzmeniDeo${selectedDeo.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {
                setShowModal(false);
                fetchDelovi(selectedAgenda.id);
            } else {
                const greska = await res.text();
                console.error(greska);
            }
        } catch (err) {
            console.error(err);
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
                <h1 className='naslov'>Agenda</h1>
            </div>

            <div className="agenda-layout">

                {/*LEVI PANEL - DOGADJAJI */}
                <div className="agenda-sidebar">

                    <div className="agenda-sidebar-header">
                        <h3>Događaji</h3>
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

                            <div className={`agenda-dogadjaj-card ${selectedDogadjaj?.id === d.id ? "active" : ""
                                }`}
                                key={d.id}
                                onClick={() => setSelectedDogadjaj(d)}>

                                <div className="agenda-dogadjaj-info">
                                    <h5>{d.ime}</h5>
                                </div>
                                <span className={`status-badge ${d.agendaPrazna ? "success" : "danger"
                                    }`}>
                                    {d.agendaPrazna ? "Agenda popunjena" : "Agenda prazna"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DESNI PANEL - PODESAVANJA AGENDE*/}
                <div className="agenda-main-panel">
                    <div className="agenda-main-header">
                        <div>
                            <h2 className="agenda-naziv">
                                {selectedDogadjaj
                                    ? selectedDogadjaj.ime
                                    : "Izaberite događaj"}
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

                        <div className="agenda-header-actions">

                            <button className="btn btn-outline-primary"
                                onClick={() => navigate('/koordinator/novi-event')}
                                disabled={!selectedDogadjaj}>

                                <i className="bi bi-dpad"></i>
                                Upravljaj događajem
                            </button>

                        </div>
                    </div>

                    <div className="agenda-tabs">

                        <button className="agenda-tab active">
                            Agenda
                        </button>
                        {/*
                        <button className="agenda-tab">
                            Koordinatori
                        </button>

                        <button className="agenda-tab">
                            Zahtevi
                        </button>

                        <button className="agenda-tab">
                            Statistika
                        </button> */}
                    </div>

                    <div className="agenda-toolbar">

                        <div className="agenda-toolbar-left">

                            <button className="btn dodaj-btn"
                                onClick={() => {
                                    setEditMode(false);

                                    setNoviDeo({
                                        datum: "",
                                        vremeOd: "",
                                        vremeDo: "",
                                        tip: 0
                                    });
                                    setShowModal(true);
                                }}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Dodaj slot
                            </button>

                            <button className="btn btn-outline-secondary"
                                disabled={!selectedAgenda}
                                onClick={fetchSlobodniSlotovi}
                            >
                                Slobodne sesije
                            </button>

                        </div>
                    </div>

                    {!selectedDogadjaj ? (

                        <div className="agenda-empty-state">

                            <i className="bi bi-calendar-event"></i>

                            <h4>Izaberite događaj</h4>

                            <p>
                                Sa leve strane odaberite događaj kako biste
                                prikazali njegovu agendu.
                            </p>

                        </div>

                    ) : (

                        <>
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
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {delovi.length === 0 ? (

                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    Nema delova agende.
                                                </td>
                                            </tr>

                                        ) : (

                                            delovi.map((deo, index) => (

                                                <tr key={deo.id}>

                                                    <td>{index + 1}</td>

                                                    <td>
                                                        {new Date(deo.datum).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        {deo.vremeOd?.slice(0, 5)}
                                                    </td>

                                                    <td>
                                                        {deo.vremeDo?.slice(0, 5)}
                                                    </td>

                                                    <td>
                                                        {/* <span className={`tip-badge ${deo.tip?.toLowerCase()}`}>
                                                        {deo.tip}
                                                    </span>*/}
                                                        {/*MORA OVO IZ ENUM */}
                                                        {deo.tip === 0 && "budjenje"}
                                                        {deo.tip === 1 && "dorucak"}
                                                        {deo.tip === 2 && "rucak"}
                                                        {deo.tip === 3 && "vecera"}
                                                        {deo.tip === 4 && "pauza"}
                                                        {deo.tip === 5 && "sesija"}
                                                        {deo.tip === 6 && "druzenje"}
                                                    </td>

                                                    <td>
                                                        {deo.sesije && deo.sesije.length > 0
                                                            ? deo.sesije[0].imeSesije
                                                            : "Nema sesije"}
                                                    </td>

                                                    <td>

                                                        <button className="btn btn-sm btn-outline-dark me-2"
                                                            onClick={() => otvoriSesije(deo)}
                                                            disabled={deo.tip !== 5}
                                                            title={
                                                                deo.tip !== 5
                                                                    ? "Sesije se mogu dodavati samo u slot tipa Sesija"
                                                                    : "Upravljaj sesijama"
                                                            }
                                                        >
                                                            <i className="bi bi-easel"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => pokreniIzmenuSlota(deo)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => obrisiDeo(deo.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                    </td>

                                                </tr>

                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="agenda-modal-overlay">
                    <div className="agenda-modal">
                        <h3>
                            {editMode ? "Izmeni slot" : "Dodaj slot"}
                        </h3>

                        <div className="mb-3">
                            <label>Datum</label>

                            <input
                                type="date"
                                required
                                className="form-control"
                                value={noviDeo.datum}
                                onChange={(e) =>
                                    setNoviDeo({
                                        ...noviDeo,
                                        datum: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label>Vreme od</label>

                            <input
                                type="time"
                                required
                                className="form-control"
                                value={noviDeo.vremeOd}
                                onChange={(e) =>
                                    setNoviDeo({
                                        ...noviDeo,
                                        vremeOd: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label>Vreme do</label>

                            <input
                                type="time"
                                required
                                className="form-control"
                                value={noviDeo.vremeDo}
                                onChange={(e) =>
                                    setNoviDeo({
                                        ...noviDeo,
                                        vremeDo: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">

                            <label>Tip</label>

                            <select
                                className="form-control"
                                value={noviDeo.tip}
                                onChange={(e) =>
                                    setNoviDeo({
                                        ...noviDeo,
                                        tip: Number(e.target.value)
                                    })
                                }
                            >

                                <option value={0}>Budjenje</option>
                                <option value={1}>Dorucak</option>
                                <option value={2}>Rucak</option>
                                <option value={3}>Vecera</option>
                                <option value={4}>Pauza</option>
                                <option value={5}>Sesija</option>
                                <option value={6}>Druzenje</option>

                            </select>

                            {noviDeo.tip === 5 && ( //ako je izabrana opcija 5 iz selekta (ako je izabrana sesija)
                                <div className="mb-3">
                                    <label>Naziv sesije</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-control"
                                        value={noviDeo.nazivSesije || ""}
                                        onChange={(e) =>
                                            setNoviDeo({
                                                ...noviDeo,
                                                nazivSesije: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="agenda-modal-actions">

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Otkaži
                            </button>

                            <button
                                className="btn dodaj-btn"
                                onClick={() => {
                                    if (editMode)
                                        sacuvajIzmenuSlota();
                                    else
                                        sacuvajDeo();
                                }} > Sacuvaj</button>

                        </div>
                    </div>
                </div>
            )}

            {showSesijaModal && (
                <div className="agenda-modal-overlay">

                    <div className="agenda-modal">

                        <h3>Sesije</h3>

                        <div className="mb-3">
                            <label>Naziv sesije</label>

                            <input
                                type="text"
                                required
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

                        <div className="mb-3">
                            <label>Vreme početka</label>

                            <input
                                type="time"
                                required
                                className="form-control"
                                value={novaSesija.vremePocetka}
                                onChange={(e) =>
                                    setNovaSesija({
                                        ...novaSesija,
                                        vremePocetka: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label>Vreme kraja</label>

                            <input
                                required
                                type="time"
                                className="form-control"
                                value={novaSesija.vremeKraja}
                                onChange={(e) =>
                                    setNovaSesija({
                                        ...novaSesija,
                                        vremeKraja: e.target.value
                                    })
                                }
                            />
                        </div>


                        {sesije.map(s => (

                            <div key={s.id} className="sesija-card">

                                <h5>{s.imeSesije}</h5>

                                <small>
                                    {s.vremePocetka} - {s.vremeKraja}
                                </small>

                            </div>

                        ))}

                        <button className="btn dodaj-btn"
                            onClick={dodajSesiju}
                        >
                            Dodaj sesiju
                        </button>

                        <button className="btn btn-secondary ms-2"
                            onClick={() => setShowSesijaModal(false)}
                        >
                            Zatvori
                        </button>

                    </div>

                </div>
            )}


        </>
    )
} export default AgendaSection