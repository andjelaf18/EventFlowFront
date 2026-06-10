import './ProfilSection.css'
import Alert from '../Alerts/Alerts';

import { useState, useEffect } from 'react';

function ProfilSection(){

    const [koordinator, setKoordinator] = useState(null);
        const [editKoordinator, setEditKoordinator] = useState(null);
    const [showIzmena, setShowIzmena] = useState(false);

    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    //tipovi koordinatora
    const TIP_MAP = {
        0: "FR",
        1: "HR",
        2: "CP",
        3: "PR",
        4: "Logistika",
        5: "IT",
        6: "Chairperson"
    };
    
    useEffect(() => {
        fetchKoordinator();
    }, []);

    const fetchKoordinator = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://localhost:7080/api/Koordinator/MojProfil",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setKoordinator(data);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje profila sa servera.",
                    tip: "error"
                });
            }

        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška na klijentu prilikom preuzimanja podataka.",
                tip: "error"
            });
        }
    };

     const otvoriIzmenu = () => {
        setEditKoordinator({ ...koordinator });
        setShowIzmena(true);
    };

     const sacuvajProfil = async () => {
        try {
            const token = localStorage.getItem("token");

            const dto = {
                username: editKoordinator.username,
                password: editKoordinator.password || "",
                ime: editKoordinator.ime,
                prezime: editKoordinator.prezime,
                mejl: editKoordinator.mejl,
                brojTelefona: editKoordinator.brojTelefona,
                imageUrl: editKoordinator.imageUrl || null,
                role: editKoordinator.role ?? 1,
                komitet: editKoordinator.komitet || null,
                alergije: editKoordinator.alergije || null,
                ishrana: editKoordinator.ishrana ?? null,
                vremeDolaska: editKoordinator.vremeDolaska || null,
                vremeOdlaska: editKoordinator.vremeOdlaska || null,
                tipKoordinatora: editKoordinator.tip ?? editKoordinator.tipKoordinatora ?? null
            };

            const res = await fetch(
                `https://localhost:7080/api/Korisnik/Izmeni/${editKoordinator.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
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

                if (editKoordinator.imageUrl) {
                    localStorage.setItem("imageUrl", editKoordinator.imageUrl);
                    localStorage.setItem("imageUsername", editKoordinator.username);
                }

                fetchKoordinator();
            } else {
                const greska = await res.text();
                setAlertInfo({
                    poruka: greska || "Nije moguće izmeniti profil.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška na klijentu prilikom izmene profila.",
                tip: "error"
            });
        }
    };

    const unaprediUChairperson = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://localhost:7080/api/Koordinator/IzmeniTip/${koordinator.id}?noviTip=6`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                fetchKoordinator(); 
                setAlertInfo({
                    poruka: "Uspešno ste unapređeni u Chairperson!",
                    tip: "success"
                });
            } else {
                setAlertInfo({
                    poruka: "Nije moguće izvršiti unapređenje.",
                    tip: "error"
                });
            }

        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška na klijentu prilikom izmene tipa.",
                tip: "error"
            });
        }
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
            <h1 className='naslov'>Podešavanja profila</h1>
        </div>

       {koordinator && (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 p-4 rounded-3">
                            <div className="text-center mb-4">
                                <div className="avatar-placeholder mx-auto mb-3">
                                    {koordinator.imageUrl ? (
                                        <img src={koordinator.imageUrl} alt="Profil" className="profil-img" />
                                    ) : (
                                        koordinator.ime?.[0]
                                    )}
                                </div>
                                <h3 className="fw-bold mb-1 plavo">
                                    {koordinator.ime} {koordinator.prezime}
                                </h3>
                                <span className={`badge ${koordinator.tip === 6 ? 'bg-warning text-dark' : 'bg-secondary'} px-3 py-2 rounded-pill`}>
                                    {TIP_MAP[koordinator.tip] || "Nepoznato"}
                                </span>
                            </div>

                            <div className="card-body bg-light rounded-3 p-3 mb-4">
                                <div className="mb-2">
                                    <strong className="text-muted">Korisničko ime:</strong>
                                    <p className="mb-0 fw-semibold text-dark">{koordinator.username}</p>
                                </div>
                                <div className="mb-2">
                                    <strong className="text-muted">Email adresa:</strong>
                                    <p className="mb-0 fw-semibold text-dark">{koordinator.mejl}</p>
                                </div>
                                <div className="mb-0">
                                    <strong className="text-muted">Broj telefona:</strong>
                                    <p className="mb-0 fw-semibold text-dark">{koordinator.brojTelefona || "Nije uneto"}</p>
                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-primary rounded-pill" onClick={otvoriIzmenu}>
                                    Izmeni profil
                                </button>

                                {koordinator.tip !== 6 && (
                                    <button className="btn btn-primary btn-lg rounded-pill shadow-sm"
                                            onClick={unaprediUChairperson}
                                    >
                                        Postani Chairperson <i className="bi bi-rocket-takeoff-fill belo"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}


        {showIzmena && editKoordinator && (
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Izmena profila</h5>
                            <button type="button" className="btn-close" onClick={() => setShowIzmena(false)}></button>
                        </div>

                        <div className="modal-body">
                            <input className="form-control mb-2" placeholder="Ime" value={editKoordinator.ime || ""} onChange={(e) => setEditKoordinator({...editKoordinator, ime: e.target.value})} />
                            <input className="form-control mb-2" placeholder="Prezime" value={editKoordinator.prezime || ""} onChange={(e) => setEditKoordinator({...editKoordinator, prezime: e.target.value})} />
                            <input className="form-control mb-2" placeholder="Email" value={editKoordinator.mejl || ""} onChange={(e) => setEditKoordinator({...editKoordinator, mejl: e.target.value})} />
                            <input className="form-control mb-2" placeholder="Broj telefona" value={editKoordinator.brojTelefona || ""} onChange={(e) => setEditKoordinator({...editKoordinator, brojTelefona: e.target.value})} />
                            <input className="form-control mb-2" placeholder="Slika URL" value={editKoordinator.imageUrl || ""} onChange={(e) => setEditKoordinator({...editKoordinator, imageUrl: e.target.value})} />
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

    )
}
export default ProfilSection