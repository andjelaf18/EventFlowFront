import './ProfilPredavacSection.css';
import Alert from '../Alerts/Alerts.jsx';

import { useState, useEffect } from 'react';

function ProfilPredavacSection() {

    const [predavac, setPredavac] = useState(null);
        const [editPredavac, setEditPredavac] = useState(null);
    const [showIzmena, setShowIzmena] = useState(false);

    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    useEffect(() => {
        fetchPredavac();
    }, []);

    const fetchPredavac = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://localhost:7080/api/Predavac/MojProfil",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setPredavac(data);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje profila predavača.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju profila.",
                tip: "error"
            });
        }
    };

    const formatDatum = (datum) => {
        if (!datum) return "Nije uneto";
        return new Date(datum).toLocaleString();
    };

     const otvoriIzmenu = () => {
        setEditPredavac({ ...predavac });
        setShowIzmena(true);
    };

    const sacuvajProfil = async () => {
        try {
            const token = localStorage.getItem("token");

            const dto = {
                username: editPredavac.username,
                password: editPredavac.password || "",
                ime: editPredavac.ime,
                prezime: editPredavac.prezime,
                mejl: editPredavac.mejl,
                brojTelefona: editPredavac.brojTelefona,
                imageUrl: editPredavac.imageUrl || null,
                role: editPredavac.role ?? 3,
                komitet: editPredavac.komitet || null,
                alergije: editPredavac.alergije || null,
                ishrana: editPredavac.ishrana ?? null,
                vremeDolaska: editPredavac.vremeDolaska || null,
                vremeOdlaska: editPredavac.vremeOdlaska || null
            };

            const res = await fetch(
                `https://localhost:7080/api/Korisnik/Izmeni/${editPredavac.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dto)
                }
            );

            if (res.ok || res.status === 204) {
                setShowIzmena(false);
                setAlertInfo({
                    poruka: "Profil je uspešno izmenjen.",
                    tip: "success"
                });

                if (editPredavac.imageUrl) {
                    localStorage.setItem("imageUrl", editPredavac.imageUrl);
                    localStorage.setItem("imageUsername", editPredavac.username);
                }

                fetchPredavac();
            } else {
                const greska = await res.text();
                setAlertInfo({
                    poruka: greska || "Neuspešna izmena profila.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri izmeni profila.",
                tip: "error"
            });
        }
    };

    return
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
            <h1 className='naslov'>Podešavanja profila</h1>
        </div>

        {predavac && (
            <div className="predavac-profil-wrapper">
                <div className="predavac-profil-card">
                    <div className="predavac-header">
                        <div className="predavac-avatar">
                            {predavac.ime?.[0]}
                        </div>

                        <h3>
                            {predavac.ime} {predavac.prezime}
                        </h3>

                        <span className="predavac-badge">
                            Predavač
                        </span>
                    </div>

                    <div className="predavac-info-box">
                        <h5>Osnovni podaci</h5>

                        <div className="info-red">
                            <span>Korisničko ime</span>
                            <strong>{predavac.username}</strong>
                        </div>

                        <div className="info-red">
                            <span>Email adresa</span>
                            <strong>{predavac.mejl}</strong>
                        </div>

                        <div className="info-red">
                            <span>Broj telefona</span>
                            <strong>{predavac.brojTelefona || "Nije uneto"}</strong>
                        </div>
                    </div>

                    <div className="predavac-info-box">
                        <h5>Podaci za događaj</h5>

                        <div className="info-red">
                            <span>Komitet</span>
                            <strong>{predavac.komitet || "Nije uneto"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Vreme dolaska</span>
                            <strong>{formatDatum(predavac.vremeDolaska)}</strong>
                        </div>

                        <div className="info-red">
                            <span>Vreme odlaska</span>
                            <strong>{formatDatum(predavac.vremeOdlaska)}</strong>
                        </div>
                    </div>
                    <div className="d-grid mt-4">
                        <button className="btn btn-primary rounded-pill" onClick={otvoriIzmenu}>
                            Izmeni profil
                        </button>
                    </div>

                </div>
            </div>
        )}
               {showIzmena && editPredavac && (
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Izmena profila</h5>
                            <button type="button" className="btn-close" onClick={() => setShowIzmena(false)}></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Ime" value={editPredavac.ime || ""} onChange={(e) => setEditPredavac({...editPredavac, ime: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Prezime" value={editPredavac.prezime || ""} onChange={(e) => setEditPredavac({...editPredavac, prezime: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Email" value={editPredavac.mejl || ""} onChange={(e) => setEditPredavac({...editPredavac, mejl: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Telefon" value={editPredavac.brojTelefona || ""} onChange={(e) => setEditPredavac({...editPredavac, brojTelefona: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Komitet" value={editPredavac.komitet || ""} onChange={(e) => setEditPredavac({...editPredavac, komitet: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" placeholder="Slika URL" value={editPredavac.imageUrl || ""} onChange={(e) => setEditPredavac({...editPredavac, imageUrl: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input type="datetime-local" className="form-control" value={editPredavac.vremeDolaska?.slice(0, 16) || ""} onChange={(e) => setEditPredavac({...editPredavac, vremeDolaska: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <input type="datetime-local" className="form-control" value={editPredavac.vremeOdlaska?.slice(0, 16) || ""} onChange={(e) => setEditPredavac({...editPredavac, vremeOdlaska: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowIzmena(false)}>Otkaži</button>
                            <button className="btn btn-primary" onClick={sacuvajProfil}>Sačuvaj izmene</button>
                        </div>
                    </div>
                </div>
            </div>
        )}


    </>

} export default ProfilPredavacSection