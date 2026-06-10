import './ZahtevSection.css'
import Alert from '../Alerts/Alerts';
import { useState, useEffect } from 'react';

function ZahtevSection() {

    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const token = localStorage.getItem("token");

    //const koordinatorId = 5; //NE SMEM DA OSTAVIM HARDKODIRANO!!
    const koordinatorId = localStorage.getItem("id");

    const [zahtevi, setZahtevi] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [slobodniClanovi, setSlobodniClanovi] = useState([]);

    const [noviZahtev, setNoviZahtev] = useState({
        opis: "",
        dogadjajId: ""
    });

    const [showDodeliModal, setShowDodeliModal] = useState(false);
    const [selectedZahtev, setSelectedZahtev] = useState(null);
    const [selektovaniClanoviIds, setSelektovaniClanoviIds] = useState([]);

    const fetchZahtevi = async () => {
        try {
            const res = await fetch("https://localhost:7080/api/Zahtev/detalji", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setZahtevi(data);
            }
        } catch (err) {
            console.error("Greška pri učitavanju zahteva:", err);
        }
    };

    const fetchDogadjaji = async () => {
        try {
            const res = await fetch("https://localhost:7080/api/Dogadjaj/VratiSveDogadjaje", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDogadjaji(data);
            }
        } catch (err) {
            console.error("Greška pri učitavanju događaja:", err);
        }
    };

    const fetchSlobodniClanovi = async () => {
        try {
            const res = await fetch("https://localhost:7080/api/Clan/pretragaClanovaPoImenuIPrezimenu?ime=&prezime=", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();

                const slobodni = data.filter(clan => clan.status === 0);
                setSlobodniClanovi(slobodni);
            }
        } catch (err) {
            console.error("Greška pri učitavanju članova sa ličnim podacima:", err);
        }
    };

    useEffect(() => {
        fetchZahtevi();
        fetchDogadjaji();
    }, []);

    const handleKreirajZahtev = async (e) => {
        e.preventDefault();
        if (!noviZahtev.opis || !noviZahtev.dogadjajId) {
            setAlertInfo({ poruka: "Molimo popunite opis i izaberite događaj.", tip: "error" });
            return;
        }

        try {
            console.log("TOKEN:", token);
            const res = await fetch(
                `https://localhost:7080/api/Zahtev/KreirajZahtev?dogadjajId=${noviZahtev.dogadjajId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ opis: noviZahtev.opis })
                }
            );

            if (res.ok) {
                setAlertInfo({ poruka: "Zadatak uspešno kreiran!", tip: "success" });
                setNoviZahtev({ opis: "", dogadjajId: "" });
                fetchZahtevi();
            } else {
                const greska = await res.text();
                setAlertInfo({ poruka: `Greška: ${greska}`, tip: "error" });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({ poruka: "Greška na serveru pri kreiranju zahteva.", tip: "error" });
        }
    };

    const otvoriModalZaDodelu = (zahtev) => {
        setSelectedZahtev(zahtev);
        setSelektovaniClanoviIds([]);
        fetchSlobodniClanovi();
        setShowDodeliModal(true);
    };

    const handleCheckboxChange = (clanId) => {
        if (selektovaniClanoviIds.includes(clanId)) {
            setSelektovaniClanoviIds(selektovaniClanoviIds.filter(id => id !== clanId));
        } else {
            setSelektovaniClanoviIds([...selektovaniClanoviIds, clanId]);
        }
    };

    const handlePotvrdiDodelu = async () => {
        if (selektovaniClanoviIds.length === 0) {
            alert("Morate izabrati barem jednog člana.");
            return;
        }

        try {
            const clanoviQuery = selektovaniClanoviIds.map(id => `clanId=${id}`).join('&');

            const url = `https://localhost:7080/api/Zahtev/${selectedZahtev.id}/dodeli?${clanoviQuery}&koordinatorId=${koordinatorId}`;

            const res = await fetch(url, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setAlertInfo({ poruka: "Zadatak uspešno dodeljen članovima!", tip: "success" });
                setShowDodeliModal(false);
                fetchZahtevi();
            } else {
                const greska = await res.text();
                alert(`Greška pri dodeli: ${greska}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge bg-primary">Prihvaćeno</span>;
            case 1: return <span className="badge bg-danger">Odbijeno</span>;
            case 2: return <span className="badge bg-success">Izvršeno</span>;
            case 3: return <span className="badge bg-warning text-dark">Na čekanju</span>;
            default: return <span className="badge bg-secondary">Nepoznato</span>;
        }
    };
    
const fetchNedodeljeniZahtevi = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            "https://localhost:7080/api/Zahtev/nedodeljeni",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (res.ok) {
            const data = await res.json();
            setZahtevi(data);
        } else {
            const greska = await res.text();
            console.error("Greška za nedodeljene:", greska);
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
                <h1 className='naslov'>Upravljanje zahtevima</h1>
            </div>


            <div className="zahtevi-layout">
                {/* GORNJI PANEL: FORMA ZA KREIRANJE */}
                <div className="zahtevi-forma-panel">
                    <form onSubmit={handleKreirajZahtev}>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Opis zadatka..."
                                value={noviZahtev.opis}
                                onChange={(e) => setNoviZahtev({ ...noviZahtev, opis: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={noviZahtev.dogadjajId}
                                onChange={(e) => setNoviZahtev({ ...noviZahtev, dogadjajId: e.target.value })}
                            >
                                <option value="">Izaberite događaj</option>
                                {dogadjaji.map(d => (
                                    <option key={d.id} value={d.id}>{d.ime}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn dugmePlavo w-50">
                            Kreiraj zadatak
                        </button>
                    </form>

                    <div className="mb-3 d-flex gap-2">
                        <button className="btn btn-outline-primary" onClick={fetchZahtevi}>
                            Svi zahtevi
                        </button>

                        <button className="btn btn-outline-warning" onClick={fetchNedodeljeniZahtevi}>
                            Nedodeljeni zahtevi
                        </button>
                    </div>
                </div>

                {/* DONJI PANEL: TABELA SA SVIM ZADACIMA */}
                <div className="zahtevi-tabela-panel">
                    <h3>Lista svih zadataka</h3>
                    <div className="table-responsive">
                        <table className="table agenda-table align-middle">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Opis</th>
                                    <th>Događaj</th>
                                    <th>Zaduženi članovi</th>
                                    <th>Status</th>
                                    <th>Akcija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zahtevi.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">Nema kreiranih zadataka.</td>
                                    </tr>
                                ) : (
                                    zahtevi.map((zahtev, index) => (
                                        <tr key={zahtev.id}>
                                            <td>{index + 1}</td>
                                            <td className="text-wrap" style={{ maxWidth: "250px" }}>{zahtev.opis}</td>
                                            <td>{zahtev.dogadjaj?.ime || "-"}</td>
                                            <td>
                                                {zahtev.zaduzeniClan && zahtev.zaduzeniClan.length > 0 ? (
                                                    zahtev.zaduzeniClan.map(c => {
                                                        const ime = c.ime || c.korisnik?.ime;
                                                        const prezime = c.prezime || c.korisnik?.prezime;
                                                        
                                                        const prikazImenaTabele = (ime && prezime) ? `${ime} ${prezime}` : `Član #${c.id}`;

                                                        return (
                                                            <span key={c.id} className="badge bg-light text-dark border me-1">
                                                                {prikazImenaTabele}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-muted">Niko</span>
                                                )}
                                            </td>
                                            <td>{renderStatusBadge(zahtev.statusZahteva)}</td>
                                            <td>
                                                {zahtev.statusZahteva === 3 ? (
                                                    <button
                                                        className="btn btn-primary btn-sm btn-tanji"
                                                        onClick={() => otvoriModalZaDodelu(zahtev)}
                                                    >
                                                        Dodeli članove
                                                    </button>
                                                ) : (
                                                    <span className="text-muted small">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL ZA DODELU ČLANOVA */}
            {showDodeliModal && (
                <div className="agenda-modal-overlay">
                    <div className="agenda-modal" style={{ maxWidth: "500px" }}>
                        <h3>Dodeli zadatak članovima</h3>
                        <p className="text-muted small">Izaberite jednog ili više slobodnih članova za ovaj zadatak.</p>

                        <div className="card bg-light p-3 mb-3">
                            <strong>Zadatak:</strong> {selectedZahtev?.opis}
                        </div>

                        <div className="clanovi-izbor-lista mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {slobodniClanovi.length === 0 ? (
                                <p className="text-danger text-center my-2">Trenutno nema slobodnih članova!</p>
                            ) : (

                                slobodniClanovi.map(clan => {
                                    const ime = clan.ime || clan.korisnik?.ime;
                                    const prezime = clan.prezime || clan.korisnik?.prezime;
                                    const korisnickoIme = clan.korisnickoIme || clan.korisnik?.korisnickoIme;

                                    const prikazImena = (ime && prezime) ? `${ime} ${prezime}` : `Član # ${clan.id}`;
                                    const imaKorisnickoIme = korisnickoIme ? true : false;

                                    const jeSelektovan = selektovaniClanoviIds.includes(clan.id);

                                    return (
                                        <div
                                            key={clan.id}
                                            className={`clan-kartica-izbor p-3 mb-2 border rounded d-flex align-items-center ${jeSelektovan ? 'selektovan-clan' : ''}`}
                                            onClick={() => handleCheckboxChange(clan.id)}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        >
                                            <div className="me-3">
                                                {jeSelektovan ? (
                                                    <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '1.3rem' }}></i>
                                                ) : (
                                                    <i className="bi bi-circle text-muted" style={{ fontSize: '1.3rem' }}></i>
                                                )}
                                            </div>

                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold">{prikazImena}</h6>
                                                {imaKorisnickoIme && <small className="text-muted">@{korisnickoIme}</small>}
                                                <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                                    Izvršeno zadataka: <span className="fw-bold text-dark">{clan.brojIzvrsenihZahteva || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="agenda-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDodeliModal(false)}>
                                Otkaži
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handlePotvrdiDodelu}
                                disabled={slobodniClanovi.length === 0}
                            >
                                Potvrdi i Dodeli
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </>
    )
} export default ZahtevSection