import './DogadjajSection.css'
import Alert from '../Alerts/Alerts';
import { useState, useEffect } from 'react';

function DogadjajSection(){

    
    const [dogadjaji, setDogadjaji] = useState([]);
    const [filtriraniDogadjaji, setFiltriraniDogadjaji] = useState([]);
    //state za prozor za brisanje
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //state za mogucnost izmene podataka  
    const [showIzmena, setShowIzmena] = useState(false);
    const [editDogadjaj, setEditDogadjaj] = useState(null);
    //state za podaci koji se menjaju
    const [selectedDogadjaj, setSelectedDogadjaj] = useState(null);
    //
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); 
    //za dodavanje
    const [showDodavanje, setShowDodavanje] = useState(false);
    const [noviDogadjaj, setNoviDogadjaj] = useState({
        ime: "",
        opis: "",
        datumOd: "",
        datumDo: "",
        imageUrl: ""
    });
    //za lepo prikazivanje placeholdera za inputi u koje se unosi datum - ovo mi valjda vise ne treba - obrisi
    const [isDatumOdEmpty, setIsDatumOdEmpty] = useState(true);
    const [isDatumDoEmpty, setIsDatumDoEmpty] = useState(true);
    //za karticu
    const stats = { 
        ukupno: dogadjaji.length
    };
    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: "" 
    });

    const handleDeleteClick = (dogadjaj) => {
    setSelectedDogadjaj(dogadjaj);
    setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedDogadjaj) return;

        const token = localStorage.getItem("token");
        const dogadjajId = selectedDogadjaj.id;

        try {

            const res = await fetch(
                `https://localhost:7080/api/Dogadjaj/IzbrisiDogadjaj${dogadjajId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {

                const noviDogadjaji =
                    dogadjaji.filter(d => d.id !== dogadjajId);

                setDogadjaji(noviDogadjaji);
                setFiltriraniDogadjaji(noviDogadjaji);

                setShowDeleteModal(false);
                setSelectedDogadjaj(null);
                setAlertInfo({
                    poruka: "Događaj uspešno obrisan.",
                    tip: "success"
                });

            } else {

                const text = await res.text();
                console.log(text);

                setAlertInfo({
                    poruka: "Greška pri brisanju događaja.",
                    tip: "danger"
                });

            }

        } catch(err) {

            console.error(err);

        }
    };

    const sacuvajIzmene = async () => {
        const token = localStorage.getItem("token");

        const dto = {
        Ime: editDogadjaj.ime || "",
        Opis: editDogadjaj.opis || "",
        DatumOd: editDogadjaj.datumOd,
        DatumDo: editDogadjaj.datumDo,
        ImageUrl: editDogadjaj.imageUrl || ""
    };

        try {
            const res = await fetch(`https://localhost:7080/api/Dogadjaj/IzmeniDogadjaj/${editDogadjaj.id}`, {
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
                await fetchDogadjaji();
                setAlertInfo({
                    poruka: "Uspešna izmena događaja.",
                    tip: "success"
                });
            } else {
                const greske = await res.json();
                console.log("Backend odbio zahtev. Detalji:", greske.errors);
                setAlertInfo({
                    poruka: "Greška pri izmeni događaja.",
                    tip: "danger"
                });
            }
        } catch (err) {
            console.error("Mrežna greška:", err);
        }
    };

    //useEffect(() => { //za tabelu
        const fetchDogadjaji = async () => {

            try {

                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "https://localhost:7080/api/Dogadjaj/VratiSveDogadjaje",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if(res.ok){

                    const data = await res.json();
                    // SEARCH FILTER - RUCNI JER NEMA TO U BACKEND
                    const filtrirani = data.filter(d =>
                        d.ime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.opis?.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    setDogadjaji(data);
                    setFiltriraniDogadjaji(filtrirani);
                }

            } catch(err){
                console.error(err);
            }
            finally{
                setLoading(false);
            }
        };
        //fetchDogadjaji();
    //}, [searchQuery]);

    useEffect(() => {
        fetchDogadjaji();
    }, [searchQuery]);

    const dodajDogadjaj = async () => { //za dodavanje dogadjaja

        const token = localStorage.getItem("token");

        const dto = {
            ime: noviDogadjaj.ime,
            opis: noviDogadjaj.opis || "",
            datumOd: noviDogadjaj.datumOd,
            datumDo: noviDogadjaj.datumDo,
            imageUrl: noviDogadjaj.imageUrl || ""
        };

        try{

            const res = await fetch(
                "https://localhost:7080/api/Dogadjaj/KreirajDogadjaj",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dto)
                }
            );

            if(res.ok){

               setAlertInfo({
                    poruka: "Događaj je uspešno kreiran.",
                    tip: "success"
                });

                setShowDodavanje(false);

                setNoviDogadjaj({
                    ime: "",
                    opis: "",
                    datumOd: "",
                    datumDo: "",
                    imageUrl: ""
                });

               // window.location.reload();
               await fetchDogadjaji();

            } else {

                const greska = await res.text();
                console.log(greska);

                setAlertInfo({
                    poruka: "Greška pri dodavanju događaja.",
                    tip: "danger"
                });
            }

        } catch(err){
            console.error(err);
        }
    };

    // Pomoćna funkcija koja formatira bilo koji datum sa backenda u format koji datetime-local prihvata
    const formatirajZaInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        
        const godina = date.getFullYear();
        const mesec = pad(date.getMonth() + 1);
        const dan = pad(date.getDate());
        const sati = pad(date.getHours());
        const minuti = pad(date.getMinutes());
        
        return `${godina}-${mesec}-${dan}T${sati}:${minuti}`;
    };

    const imaValidnuSliku = (url) => { 
        if (!url) return false;
        const cistUrl = url.trim();
        return cistUrl.startsWith("http://") || cistUrl.startsWith("https://");
    };

    return(
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
                <h1 className='naslov'>Događaj</h1>

                <div className='stats-red'>
                    <div className='stat-kartica'>
                        <div className='stat-ikona plava'><i className="bi bi-calendar-event"></i></div>
                        <div className='stat-tekst'>
                            <p>Ukupan broj događaja </p>
                            <h3>{stats.ukupno}</h3>
                        </div>
                    </div>
                </div>
            </div>
   
        <div className='search-bar-box mb-4'>
            <div className="row align-items-center justify-content-between g-3">

                {/* LEVA STRANA - SAMO DUGME */}
                <div className="col-12 col-md-5 col-lg-4">
                    <button
                        className="btn dodaj-btn w-100"
                        onClick={() => setShowDodavanje(!showDodavanje)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Dodaj novi događaj
                    </button>
                </div>
    
                {/* DESNA STRANA - SEARCH BAR */}
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            className="form-control ps-5" 
                            placeholder="Pretraži događaj"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                    </div>
                </div>
            </div>

            {showDodavanje && (
                <div className="row mt-3 animate-fade-in">
                    <div className="col-12 col-md-10 col-lg-8">
                        <form
                            className="dodaj-dogadjaj-forma"
                            onSubmit={(e) => {
                                e.preventDefault();
                                dodajDogadjaj();
                            }}
                        >
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ime događaja"
                                    required
                                    value={noviDogadjaj.ime}
                                    onChange={(e) => setNoviDogadjaj({...noviDogadjaj, ime: e.target.value})}
                                />
                            </div>

                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Opis događaja"
                                    value={noviDogadjaj.opis}
                                    onChange={(e) => setNoviDogadjaj({...noviDogadjaj, opis: e.target.value})}
                                />
                            </div>

                            <div className="mb-2">
                                <div className="datum-container">
                                    <input
                                        type="datetime-local"
                                        className="form-control datum-input"
                                        required
                                        value={noviDogadjaj.datumOd}
                                        onChange={(e) => setNoviDogadjaj({...noviDogadjaj, datumOd: e.target.value})}
                                    />
                                    {!noviDogadjaj.datumOd && <span className="custom-placeholder">Datum i vreme od</span>}
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="datum-container">
                                    <input
                                        type="datetime-local"
                                        className="form-control datum-input"
                                        required
                                        value={noviDogadjaj.datumDo}
                                        onChange={(e) => setNoviDogadjaj({...noviDogadjaj, datumDo: e.target.value})}
                                    />
                                    {!noviDogadjaj.datumDo && <span className="custom-placeholder">Datum i vreme do</span>}
                                </div>
                            </div>
                                                                                
                            <div className="mb-3">
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="Link ka slici (opciono)"
                                    value={noviDogadjaj.imageUrl}
                                    onChange={(e) => setNoviDogadjaj({...noviDogadjaj, imageUrl: e.target.value})}
                                />
                            </div>

                            <button type="submit" className="btn sacuvaj-dogadjaj-btn dodaj-btn">
                                Sačuvaj događaj
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

            <div className='tabela-box'>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Opis</th>
                            <th>Datum od</th>
                            <th>Datum do</th>
                            <th>Link ka slici</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtriraniDogadjaji.map((d, index) => (
                            <tr key={d.id || index}>
                                <td>{d.ime}</td>

                                <td>{d.opis || "Nema opisa"}</td>

                                <td>
                                    {
                                        //d.datumOd = new Date(d.datumOd).toLocaleDateString()
                                        new Date(d.datumOd).toLocaleDateString()
                                    }
                                </td>

                                <td>
                                    {
                                        //d.datumDo = new Date(d.datumDo).toLocaleDateString()
                                        new Date(d.datumDo).toLocaleDateString()
                                    }
                                </td>

                                <td>
                                   {imaValidnuSliku(d.imageUrl) ? (
                                        <a 
                                            href={d.imageUrl.trim()} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="btn btn-sm btn-link p-0"
                                        >
                                            Pogledaj sliku
                                        </a>
                                    ) : (
                                        <span className="text-muted">/</span>
                                    )
                                    }
                                </td>

                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-info me-2"
                                        onClick={() => {
                                            setEditDogadjaj({ ...d });
                                            setShowIzmena(true);
                                        }}
                                    >
                                        Izmeni
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteClick(d)}
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
            {showDeleteModal && selectedDogadjaj && (
                <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title"> Potvrda brisanja </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedDogadjaj(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Da li ste sigurni da želite da obrišete događaj:</p>
                                <strong>
                                    {selectedDogadjaj.ime}, opis: {selectedDogadjaj.opis}
                                </strong>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedDogadjaj(null);
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

            {/* PROZOR ZA IZMENU */}
            {showIzmena && editDogadjaj && (
                <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Izmena događaja</h5>
                                <button type="button" className="btn-close" onClick={() => setShowIzmena(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <input
                                        placeholder="Ime"
                                        type="text"
                                        className="form-control"
                                        value={editDogadjaj.ime || ""}
                                        onChange={(e) => setEditDogadjaj({...editDogadjaj, ime: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        placeholder="Opis"
                                        type="text"
                                        className="form-control"
                                        value={editDogadjaj.opis || ""}
                                        onChange={(e) => setEditDogadjaj({...editDogadjaj, opis: e.target.value})}
                                    />
                                </div>
                               <div className="mb-3">
                                    <input
                                        placeholder="Datum od"
                                        type="datetime-local"
                                        className="form-control"
                                       /*  value={editDogadjaj.datumOd?.split("T")[0] || ""}*/ 
                                        value={formatirajZaInput(editDogadjaj.datumOd)}
                                        onChange={(e) =>
                                            setEditDogadjaj({ ...editDogadjaj, datumOd: e.target.value})
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        placeholder="Datum dp"
                                        type="datetime-local"
                                        className="form-control"
                                        /*  value={editDogadjaj.datumDo?.split("T")[0] || ""}*/
                                        value={formatirajZaInput(editDogadjaj.datumDo)}
                                        onChange={(e) => setEditDogadjaj({...editDogadjaj, datumDo: e.target.value})
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        placeholder="Slika"
                                        type="url"
                                        className="form-control"
                                        value={editDogadjaj.imageUrl || ""}
                                        onChange={(e) =>
                                            setEditDogadjaj({
                                                ...editDogadjaj,
                                                imageUrl: e.target.value
                                            })
                                        }
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
}export default DogadjajSection