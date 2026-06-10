import './ClanoviTimaSection.css'

import Alert from '../Alerts/Alerts';
import Tabela from './TabelaDostupnosti.jsx';

import { useState, useEffect } from 'react';

function ClanoviTimaSection() {

    const [clanovi, setClanovi] = useState([]);
    const [filtriraniClanovi, setFiltriraniClanovi] = useState([]);
    const [loading, setLoading] = useState(true);
    // State za filtere
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    //selectedClan koristim za brisanje, izmenu i pregled
    const [selectedClan, setSelectedClan] = useState(null);
    //state za brisanje clana
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //state za pregled informacija o clanu
    const [showPregled, setShowPregled] = useState(false);
    //state za izmenu podataka o clanu
    const [showIzmena, setShowIzmena] = useState(false);
    const [editClan, setEditClan] = useState(null);
    //state za dugme za sortiranje
    const [isSorted, setIsSorted] = useState(true);

    const statusTekst = (status) => {
        // Pretvaramo u broj jer selekt šalje string "0", "1", a API može vratiti broj
        const s = Number(status);
        switch (s) {
            case 0: return "Slobodan";
            case 1: return "Zauzet";
            case 2: return "Nedostupan";
            default: return "Nepoznat";
        }
    }
    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const handleDeleteClick = (clan) => {
        setSelectedClan(clan);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedClan) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://localhost:7080/api/Korisnik/Obrisi/${selectedClan.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                // uklanjamo iz state-a
                const noviClanovi = clanovi.filter(c => c.id !== selectedClan.id);

                setClanovi(noviClanovi);
                setFiltriraniClanovi(
                    filtriraniClanovi.filter(
                        c => c.id !== selectedClan.id
                    )
                );
                setAlertInfo({
                    poruka: "Član je uspešno obrisan.",
                    tip: "success"
                });
                setShowDeleteModal(false);
                setSelectedClan(null);
            }
        }
        catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri brisanju.",
                tip: "danger"
            });
        }
    };

    const sacuvajIzmene = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `https://localhost:7080/api/Korisnik/Izmeni/${editClan.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editClan)
            }
        );

        if (res.ok) {
            const noviClanovi = clanovi.map(c =>
                c.id === editClan.id ? editClan : c
            );
            setClanovi(noviClanovi);
            setFiltriraniClanovi(noviClanovi);
            setShowIzmena(false);
            setAlertInfo({
                poruka: "Uspešna izmena.",
                tip: "success"
            });
        }
    }

    /*useEffect(() => { //OVO SAM SIGURNO KORISTILA PRE IZMENE
 
         const fetchSve = async () => {
             try {
                 const token = localStorage.getItem("token");
                 const res = await fetch(
                     "https://localhost:7080/api/Clan/vratiSveClanove?opadajuce=true",
                     {
                         headers: {
                             "Authorization": `Bearer ${token}`
                         }
                     }
                 );
 
                 if (res.ok) {
 
                     const data = await res.json();
 
                     setClanovi(data);
                 }
             } catch (err) {
                 console.error(err);
             } finally {
                 setLoading(false);
             }
         };
         fetchSve();
     }, []);*/

    /*useEffect(() => { //OVO SAM SIGURNO KORISTILA PRE IZMENE
        const fetchFiltrirano = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = `https://localhost:7080/api/Clan/vratiSveClanove?opadajuce=${isSorted}`;
                
                // AKO POSTOJI SEARCH
                if (searchQuery.trim() !== "") {

                    const delovi = searchQuery.trim().split(" ");
                    const ime = delovi[0] || "";
                    const prezime = delovi[1] || "";
                    url = `https://localhost:7080/api/Clan/pretragaClanovaPoImenuIPrezimenu?ime=${ime}&prezime=${prezime}`;
                }

                // AKO POSTOJI STATUS
                if (filterStatus !== "") {
                    url = `https://localhost:7080/api/Clan/statusClanovi/${filterStatus}`;
                }

                const res = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {

                    let data = await res.json();

                    // AKO SU ISTOVREMENO SEARCH + STATUS
                    if (
                        searchQuery.trim() !== "" &&
                        filterStatus !== ""
                    ) {

                        data = data.filter(c => {
                            const punoIme =
                                `${c.ime} ${c.prezime}`.toLowerCase();
                            return punoIme.includes(
                                searchQuery.toLowerCase()
                            );
                        });
                    }
                    setFiltriraniClanovi(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFiltrirano();
    }, [searchQuery, filterStatus, isSorted]);*/
    useEffect(() => {
        const fetchPodaci = async () => {
            try {
                //setLoading(true);
                const token = localStorage.getItem("token");
                let url = "";

                // 1. Ako postoji pretraga po imenu/prezime, koristi namensku rutu
                if (searchQuery.trim() !== "") {
                    const delovi = searchQuery.trim().split(/\s+/);
                    const ime = delovi[0] || "";
                    const prezime = delovi[1] || "";

                    url = `https://localhost:7080/api/Clan/pretragaClanovaPoImenuIPrezimenu?ime=${encodeURIComponent(ime)}&prezime=${encodeURIComponent(prezime)}`;
                }
                // 2. Ako nema pretrage, koristi vratiSveClanove sa query parametrima za sortiranje i status
                else {
                    url = `https://localhost:7080/api/Clan/vratiSveClanove?opadajuce=${isSorted}`;
                    if (filterStatus !== "") {
                        url += `&status=${filterStatus}`;
                    }
                }

                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    let data = await res.json();

                    // Kombinovani fallback (Search + Status): Ako je korisnik pretraživao po imenu, 
                    // a izabrao i status, backend ruta za pretragu ne prima status, pa ga ovde dokraja filtriramo
                    if (searchQuery.trim() !== "" && filterStatus !== "") {
                        data = data.filter(c => {
                            const trenutniStatus = c.status !== undefined ? c.status : c.Status;
                            return Number(trenutniStatus) === Number(filterStatus);
                        });
                    }

                    setFiltriraniClanovi(data);
                }
            } catch (err) {
                console.error("Greška pri učitavanju podataka:", err);
            } finally {
                setLoading(false);
            }
        };
        const tajmer = setTimeout(() => {
            fetchPodaci();
        }, 300);

        return () => clearTimeout(tajmer);
    }, [searchQuery, filterStatus, isSorted]);

     const vratiStatus = (c) => Number(c.status ?? c.Status);

    const stats = {
        ukupno: clanovi.length,
        slobodni: clanovi.filter(c => vratiStatus(c) === 0).length,
        zauzeti: clanovi.filter(c => vratiStatus(c) === 1).length,
        nedostupan: clanovi.filter(c => vratiStatus(c) === 2).length,
    };

    if (loading) return <div>Učitavanje...</div>;

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
                <h1 className='naslov'>Članovi tima</h1>

                <div className='stats-red'>
                    <div className='stat-kartica'>
                        <div className='stat-ikona plava'><i className="bi bi-people-fill"></i></div>
                        <div className='stat-tekst'>
                            <p>Ukupno članova</p>
                            <h3>{stats.ukupno}</h3>
                        </div>
                    </div>

                    <div className='stat-kartica'>
                        <div className='stat-ikona zelena'><i className="bi bi-person-fill-check"></i></div>
                        <div className='stat-tekst'>
                            <p>Slobodni</p>
                            <h3>{stats.slobodni}</h3>
                        </div>
                    </div>

                    <div className='stat-kartica'>
                        <div className='stat-ikona zuta'><i className="bi bi-person-fill-dash"></i></div>
                        <div className='stat-tekst'>
                            <p>Zauzeti</p>
                            <h3>{stats.zauzeti}</h3>
                        </div>
                    </div>

                    <div className='stat-kartica'>
                        <div className='stat-ikona siva'><i className="bi bi-person-fill-slash"></i></div>
                        <div className='stat-tekst'>
                            <p>Nedostupni</p>
                            <h3>{stats.nedostupan}</h3>
                        </div>
                    </div>
                </div>
                <div className="search-bar-box">
                    <div className="row g-3">

                        <div className="col-lg-4 position-relative">
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Pretraži člana (ime ili prezime)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                        </div>

                        {/*OVO MI VISE NE TREBA DA FILTRIRAM PO ULOGAMA JER CU OVAJ SECTION DA OSTAVIM SAMO ZA CLANOVI A U DRUGI CU PARTICIPANTA I PREDAVACA 
                    <div className="col-lg-3">
                        <select className="form-select" onChange={(e) => setFilterUloga(e.target.value)}>
                            <option value="">Sve uloge</option>
                            <option value="Clan">Član</option>
                            <option value="Predavac">Predavač</option>
                            <option value="Participant">Participant</option>
                            <option value="Koordinator">Koordinator</option>
                        </select>
                    </div>*/}

                        <div className="col-lg-3">
                            <select className="form-select" onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Svi statusi</option>
                                <option value="0">Slobodan</option>
                                <option value="1">Zauzet</option>
                                <option value="2">Nedostupan</option>
                            </select>
                        </div>

                    </div>
                </div>
                <div className='tabela-box'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Član</th>
                                <th>Status</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => setIsSorted(!isSorted)}>
                                    Broj izvršenih zadataka <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtriraniClanovi.map(c => (
                                <tr key={c.id}>
                                    <td> {c.ime} {c.prezime} </td>
                                    <td>
                                        <span className={`badge-status ${statusTekst(c.status ?? c.Status).toLowerCase()}`}>
                                            {statusTekst(c.status ?? c.Status)}
                                        </span>
                                    </td>
                                    <td> {c.brojIzvrsenihZahteva || c.BrojIzvrsenihZahteva || 0} </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => { setSelectedClan(c); setShowPregled(true); }}> Pregled </button>
                                        <button className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => { setEditClan({ ...c }); setShowIzmena(true); }}> Izmeni </button>
                                        <button className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteClick(c)}> Obriši </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*PROZOR KOJI SE OTVARA KADA SE IZABERE DUGME ZA BRISANJE*/}
            {showDeleteModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> Potvrda brisanja </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p> Da li ste sigurni da želite da obrišete člana:</p>
                                <strong>
                                    {selectedClan?.ime} {selectedClan?.prezime}
                                </strong>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}> Otkaži </button>
                                <button className="btn btn-danger" onClick={confirmDelete}> Obriši</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*PROZOR KOJI SE OTVARA KADA SE IZBERE DUGME ZA PREGLED*/}
            {showPregled && selectedClan && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> Informacije o članu</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPregled(false)}
                                > </button>
                            </div>
                            <div className="modal-body">
                                <p> <strong>Ime:</strong>
                                    {" "}
                                    {selectedClan.ime}
                                </p>

                                <p> <strong>Prezime:</strong>
                                    {" "}
                                    {selectedClan.prezime}
                                </p>

                                <p> <strong>Email:</strong>
                                    {" "}
                                    {selectedClan.mejl}
                                </p>

                                <p> <strong>Telefon:</strong>
                                    {" "}
                                    {selectedClan.brojTelefona}
                                </p>

                                <p> <strong>Status:</strong>
                                    {" "}
                                    {statusTekst(selectedClan.status ?? selectedClan.Status)}
                                </p>

                                <p> <strong>Broj izvršenih zahteva:</strong>
                                    {" "}
                                    {selectedClan.brojIzvrsenihZahteva}
                                </p>

                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPregled(false)} > Zatvori </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROZOR ZA IZMENU */}
            {showIzmena && editClan && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> Izmena člana </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowIzmena(false)}
                                >  </button>
                            </div>

                            <div className="modal-body">
                                <label>Ime</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editClan.ime || ""}
                                    onChange={(e) =>
                                        setEditClan({
                                            ...editClan,
                                            ime: e.target.value
                                        })
                                    }
                                />

                                <label>Prezime</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editClan.prezime || ""}
                                    onChange={(e) =>
                                        setEditClan({
                                            ...editClan,
                                            prezime: e.target.value
                                        })
                                    }
                                />

                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    value={editClan.mejl || ""}
                                    onChange={(e) =>
                                        setEditClan({
                                            ...editClan,
                                            mejl: e.target.value
                                        })
                                    }
                                />

                                <label>Telefon</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editClan.brojTelefona || ""}
                                    onChange={(e) =>
                                        setEditClan({
                                            ...editClan,
                                            brojTelefona: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowIzmena(false)}>
                                    Otkaži
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={sacuvajIzmene}>
                                    Sačuvaj
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Tabela clanovi={filtriraniClanovi}>

            </Tabela>
        </>
    )

} export default ClanoviTimaSection