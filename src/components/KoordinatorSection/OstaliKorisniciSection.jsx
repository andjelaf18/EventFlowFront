import './OstaliKorisniciSection.css'
import Alert from '../Alerts/Alerts';
import { useState, useEffect } from 'react';

function OstaliKorisnici() {

    const [filterRole, setFilterRole] = useState("");
    const [filterKomitet, setFilterKomitet] = useState("");
    const [filterIshrana, setFilterIshrana] = useState("");
    const [filterAlergije, setFilterAlergije] = useState("");
    const [komiteti, setKomiteti] = useState([]);
    const [loading, setLoading] = useState(true); //ovo je iz clanovi nisam sigurna da li mi je potrebno i ovde 

    // State za filtere
    const [searchQuery, setSearchQuery] = useState("");
    //const [selectedClan, setSelectedClan] = useState(null);

    //OVO NE DIRAJ AKO ZA BOGA ZNAS
    //state za brisanje 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //state za pregled informacija 
    const [showPregled, setShowPregled] = useState(false);
    //state za izmenu podataka 
    const [showIzmena, setShowIzmena] = useState(false);
    const [editClan, setEditClan] = useState(null);
    //za kartice
    const [clanovi, setClanovi] = useState([]);
    const [filtriraniClanovi, setFiltriraniClanovi] = useState([]);
    const [sviKorisnici, setSviKorisnici] = useState([]);
    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });
    //za izmenu i pregled
    const [selectedKorisnik, setSelectedKorisnik] = useState(null);

    // Pomoćna funkcija za ispis alergija i ishrane (dodaj je unutar komponente)
    const statusTekst = (alergije) => {
        return (alergije && alergije.trim() !== "") ? alergije : "Nema";
    };

    const ishranaTekst = (id) => {
        switch (id) {
            case 0: return "Vegan";
            case 1: return "Vegetarijanac";
            default: return "Mesojed";
        }
    };

    const statsIzvor = sviKorisnici.length > 0 ? sviKorisnici : clanovi;

    const stats = { //ZA KARTICE
        ukupno: statsIzvor.length,
        predavaci: statsIzvor.filter(
            c => c.role === 3 || c.Role === 3
        ).length,
        participanti: statsIzvor.filter(
            c => c.role === 2 || c.Role === 2
        ).length
    };


    //if (loading) return <div>Učitavanje...</div>;

    const handleDeleteClick = (korisnik) => {
        setSelectedKorisnik(korisnik);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedKorisnik) return;

        const token = localStorage.getItem("token");
        const korisnikId = selectedKorisnik.id || selectedKorisnik.Id;

        try {
            const res = await fetch(
                `https://localhost:7080/api/Korisnik/Obrisi/${korisnikId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                // Uklanjamo iz state-a da se tabela odmah osveži bez reload-a
                const noviClanovi = clanovi.filter(c => (c.id || c.Id) !== korisnikId);
                setClanovi(noviClanovi);
                setFiltriraniClanovi(noviClanovi);

                // Zatvaramo modal i čistimo selektovanog korisnika
                setShowDeleteModal(false);
                setSelectedKorisnik(null);
                setAlertInfo({
                    poruka: "Uspešno brisanje.",
                    tip: "success"
                });
            } else {
                setAlertInfo({
                    poruka: "Greška pri brisanju.",
                    tip: "danger"
                });
            }
        }
        catch (err) {
            console.error("Mrežna greška pri brisanju:", err);
        }
    };

    useEffect(() => { //ZA KOMITETI DA SE POPUNI DROPDOWN 
        const fetchKomiteti = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "https://localhost:7080/api/Gosti/komiteti",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setKomiteti(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchKomiteti();
    }, []);

    useEffect(() => {
        const fetchSviKorisniciZaStatistiku = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "https://localhost:7080/api/Gosti/filter?ime=&prezime=&komitet=&role=&imaAlergije=&ishrana=",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setSviKorisnici(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSviKorisniciZaStatistiku();
    }, []);


    useEffect(() => { //ZA TABELU - FETCH PREMA METODU KOJA OBJEDINJUJE SVI FILTERI

        const fetchGosti = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const delovi = searchQuery.trim().split(" ");
                const ime = delovi[0] || "";
                const prezime = delovi[1] || "";

                const url =
                    `https://localhost:7080/api/Gosti/filter?` +
                    `ime=${ime}` +
                    `&prezime=${prezime}` +
                    `&komitet=${filterKomitet}` +
                    `&role=${filterRole}` +
                    `&imaAlergije=${filterAlergije}` +
                    `&ishrana=${filterIshrana}`;

                const res = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    //console.log(data);
                    setClanovi(data);
                    setFiltriraniClanovi(data);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchGosti();
    }, [searchQuery, filterRole, filterKomitet, filterIshrana, filterAlergije]);

    const otvoriIzmenu = (korisnik) => {
        //console.log("Podaci koji su stigli sa bekenda:", korisnik); 

        setEditClan({
            id: korisnik.id || korisnik.Id,
            ime: korisnik.ime || korisnik.Ime,
            prezime: korisnik.prezime || korisnik.Prezime,
            // email: korisnik.email || korisnik.Email, 
            //brojTelefona: korisnik.brojTelefona || korisnik.BrojTelefona,
            komitet: korisnik.komitet || korisnik.Komitet,
            ishrana: korisnik.ishrana !== undefined ? korisnik.ishrana : korisnik.Ishrana,
            alergije: korisnik.alergije || korisnik.Alergije,
            role: korisnik.role !== undefined ? korisnik.role : korisnik.Role
        });
        setShowIzmena(true);
    };

    const sacuvajIzmene = async () => { //NE RADI JER DTO NEMA EMAIL, BROJ TELEFONA
        const token = localStorage.getItem("token");

        const dto = {
            id: editClan.id,
            ime: editClan.ime || "",
            prezime: editClan.prezime || "",
            // email: editClan.mejl || "", 
            //brojTelefona: editClan.brojTelefona || "",
            komitet: editClan.komitet || "",
            alergije: editClan.alergije || "",
            role: parseInt(editClan.role) || 0,
            ishrana: editClan.ishrana !== "" ? parseInt(editClan.ishrana) : 2
        };
        //console.log("Šaljem sledeći DTO:", dto);

        try {
            const res = await fetch(`https://localhost:7080/api/Korisnik/Izmeni/${dto.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dto)
            });

            if (res.ok) {
                setShowIzmena(false);
                //window.location.reload(); 
                const azuriraniClanovi = clanovi.map(c => {
                    if ((c.id || c.Id) === dto.id) {
                        return { ...c, ...dto };
                    }

                    return c;
                });
                setClanovi(azuriraniClanovi);
                setFiltriraniClanovi(azuriraniClanovi);
                setAlertInfo({
                    poruka: "Uspešna izmena podataka o korisniku.",
                    tip: "success"
                });
            } else {
                //const greske = await res.json();
                //console.log("Backend odbio zahtev. Detalji:", greske.errors);
                setAlertInfo({
                    poruka: "Greška pri izmeni.",
                    tip: "danger"
                });
            }
        } catch (err) {
            console.error("greška:", err);
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
                <h1 className='naslov'>Predavači i participanti</h1>

                <div className='stats-red'>
                    <div className='stat-kartica'>
                        <div className='stat-ikona plava'><i className="bi bi-people-fill"></i></div>
                        <div className='stat-tekst'>
                            <p>Ukupno </p>
                            <h3>{stats.ukupno}</h3>
                        </div>
                    </div>

                    <div className='stat-kartica'>
                        <div className='stat-ikona plava'><i className="bi bi-person-workspace"></i></div>
                        <div className='stat-tekst'>
                            <p>Predavači</p>
                            <h3>{stats.predavaci}</h3>
                        </div>
                    </div>

                    <div className='stat-kartica'>
                        <div className='stat-ikona plava'><i className="bi bi-person-badge"></i></div>
                        <div className='stat-tekst'>
                            <p>Participanti</p>
                            <h3>{stats.participanti}</h3>
                        </div>
                    </div>
                </div>

            </div>

            <div className="search-bar-box">
                <div className="row g-3">

                    <div className="col-lg-8 position-relative">
                        <input
                            type="text"
                            className="form-control ps-5"
                            placeholder="Pretraži korisnika (ime ili prezime)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    </div>

                    <div className="col-lg-4">
                        <select className="form-select" onChange={(e) => setFilterAlergije(e.target.value)} >
                            <option value="">Alergije</option>
                            <option value="true">Da</option>
                            <option value="false">Ne</option>
                        </select>
                    </div>

                    <div className="col-lg-4">
                        {/*OVAJ DEO NISMO NAVELI U DOKUMENTACIJU DA CE DA POSTOJI 
                        NITI POSTOJI U BACKEND ALI JE FRONTEND PROGRAMER ODLUCIO DA JE LEPSE DA PODELIMO
                        STRANICE ZA CLANOVE I OSTALE (SA VECIM PRIVILEGIJAMA) KORISNIKE. 
                        TI KORISNICI SA VECIM PRIVILEGIJAMA - PREDAVAC I PARTICIPANT IMAJU DOSTA SLICNE PODATKE
                        PA SU ONI ZAJEDNO NA U OVU KOMPONENTU. 
                        DA BI BILO LASKE KOORDINATORU, ODLUCENO JE DA POSTOJI FILTRIRANJE PO ULOZI */}
                        <select className="form-select" onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="">Uloga</option>
                            <option value="3">Predavač</option>
                            <option value="2">Participant</option>
                        </select>
                    </div>

                    <div className="col-lg-4">
                        <select className="form-select" onChange={(e) => setFilterIshrana(e.target.value)}>
                            <option value="">Ishrana</option>
                            <option value="0">Vegan</option>
                            <option value="1">Vegetarijanac</option>
                            <option value="2">Mesojed</option>
                        </select>
                    </div>

                    <div className="col-lg-4">
                        <select className="form-select" onChange={(e) => setFilterKomitet(e.target.value)}>
                            <option value="">Komitet</option>

                            {komiteti.map((k, index) => (
                                <option key={index} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='tabela-box'>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Korisnik</th>
                            <th>Uloga</th>
                            <th>Komitet</th>
                            <th>Ishrana</th>
                            <th>Alergije</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtriraniClanovi.map(c => (
                            <tr key={c.id}>
                                <td> {c.ime} {c.prezime} </td>
                                <td>
                                    <span className="badge-status">
                                        {
                                            (c.role === 3 || c.Role === 3) ? "Predavač" : "Participant"
                                        }
                                    </span>
                                </td>

                                <td> {c.komitet || "Nema"} </td>

                                <td>
                                    {
                                        (c.ishrana === 0 || c.Ishrana === 0) ? "Vegan" :
                                            (c.ishrana === 1 || c.Ishrana === 1) ? "Vegetarijanac" :
                                                "Mesojed"
                                    }
                                </td>

                                <td>
                                    {
                                        (c.alergije && c.alergije.trim() !== "") ? "Da" : "Ne"
                                    }
                                </td>

                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        onClick={() => {
                                            setSelectedKorisnik(c);
                                            setShowPregled(true);
                                        }}
                                    >
                                        Pregled
                                    </button>

                                    {/*<button
                                        className="btn btn-sm btn-outline-info me-2"
                                        onClick={() => {
                                            setEditClan({ ...c });
                                            setShowIzmena(true);
                                        }}
                                    >
                                        Izmeni
                                    </button>*/}
                                    <button
                                        className="btn btn-sm btn-outline-info me-2"
                                        onClick={() => otvoriIzmenu(c)}
                                        title="Izmeni"
                                    >
                                        Izmeni
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteClick(c)}
                                    >
                                        Obriši
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*PROZOR KOJI SE OTVARA KADA SE IZABERE DUGME ZA BRISANJE*/}
            {showDeleteModal && selectedKorisnik && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Potvrda brisanja</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedKorisnik(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Da li ste sigurni da želite da obrišete korisnika:</p>
                                <strong>
                                    {selectedKorisnik.ime} {selectedKorisnik.prezime}
                                </strong>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedKorisnik(null);
                                    }}
                                >
                                    Otkaži
                                </button>
                                <button className="btn btn-danger" onClick={confirmDelete}>Obriši</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*PROZOR KOJI SE OTVARA KADA SE IZBERE DUGME ZA PREGLED*/}
            {showPregled && selectedKorisnik && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Informacije o korisniku: {selectedKorisnik.ime} {selectedKorisnik.prezime}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPregled(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Email:</strong> {selectedKorisnik.mejl || "Nema"}</p>
                                <p><strong>Telefon:</strong> {selectedKorisnik.brojTelefona || "Nema"}</p>
                                <p><strong>Uloga:</strong> {Number(selectedKorisnik.role) === 3 ? "Predavač" : "Participant"}</p>
                                <p><strong>Komitet:</strong> {selectedKorisnik.komitet || "Nema"}</p>
                                <p><strong>Ishrana:</strong> {ishranaTekst(selectedKorisnik.ishrana)}</p>
                                <p><strong>Alergije:</strong> {statusTekst(selectedKorisnik.alergije)}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowPregled(false)}>Zatvori</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROZOR ZA IZMENU */}
            {showIzmena && editClan && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Izmena korisnika</h5>
                                <button type="button" className="btn-close" onClick={() => setShowIzmena(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Ime</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editClan.ime || ""}
                                        onChange={(e) => setEditClan({ ...editClan, ime: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Prezime</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editClan.prezime || ""}
                                        onChange={(e) => setEditClan({ ...editClan, prezime: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={editClan.mejl || ""}
                                        onChange={(e) => setEditClan({ ...editClan, mejl: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Telefon</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editClan.brojTelefona || ""}
                                        onChange={(e) => setEditClan({ ...editClan, brojTelefona: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Komitet</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editClan.komitet || ""}
                                        onChange={(e) => setEditClan({ ...editClan, komitet: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Ishrana</label>
                                    <select
                                        className="form-select"
                                        value={editClan.ishrana ?? ""}
                                        onChange={(e) => setEditClan({ ...editClan, ishrana: e.target.value })}
                                    >
                                        <option value="0">Vegan</option>
                                        <option value="1">Vegetarijanac</option>
                                        <option value="2">Mesojed</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Alergije</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editClan.alergije || ""}
                                        onChange={(e) => setEditClan({ ...editClan, alergije: e.target.value })}
                                    />
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowIzmena(false)}>Otkaži</button>
                                <button className="btn btn-primary" onClick={sacuvajIzmene}>Sačuvaj izmene</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )

} export default OstaliKorisnici