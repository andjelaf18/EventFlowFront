import './AgendaParticipantSection.css';

import Alert from '../Alerts/Alerts';

import { useState, useEffect } from 'react';

function ProfilParticipantSection() {

    const [participant, setParticipant] = useState(null);
    const [editParticipant, setEditParticipant] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

     const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const ISHRANA_MAP = {
        0: "Vegan",
        1: "Vegetarijanac",
        2: "Mesojed"
    };

    useEffect(() => {
        fetchParticipant();
    }, []);

    const fetchParticipant = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://localhost:7080/api/Participant/MojProfil",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setParticipant(data);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje profila.",
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
        setEditParticipant({ ...participant });
        setShowEditModal(true);
    };

    const sacuvajIzmene = async () => {
        try {
            const token = localStorage.getItem("token");

            const body = {
                ime: editParticipant.ime,
                prezime: editParticipant.prezime,
                mejl: editParticipant.mejl,
                brojTelefona: editParticipant.brojTelefona,
                imageUrl: editParticipant.imageUrl,
                komitet: editParticipant.komitet,
                alergije: editParticipant.alergije,
                ishrana: Number(editParticipant.ishrana),
                vremeDolaska: editParticipant.vremeDolaska,
                vremeOdlaska: editParticipant.vremeOdlaska
            };

            const res = await fetch(
                `https://localhost:7080/api/Korisnik/Izmeni/${editParticipant.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok || res.status === 204) {
                setShowEditModal(false);
                setAlertInfo({
                    poruka: "Profil je uspešno izmenjen.",
                    tip: "success"
                });
                fetchParticipant();
            } else {
                const greska = await res.text();
                console.error(greska);
                setAlertInfo({
                    poruka: "Neuspešna izmena profila.",
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
            <h1 className="naslov">Podešavanja profila</h1>
        </div>

        {participant && (
            <div className="participant-profil-wrapper">
                <div className="participant-profil-card">
                    <div className="participant-header">
                        <div className="participant-avatar">
                            {participant.ime?.[0]}
                        </div>

                        <h3>{participant.ime} {participant.prezime}</h3>

                        <span className="participant-badge">
                            Participant
                        </span>
                    </div>

                    <div className="participant-info-box">
                        <h5>Osnovni podaci</h5>

                        <div className="info-red">
                            <span>Korisničko ime</span>
                            <strong>{participant.username}</strong>
                        </div>

                        <div className="info-red">
                            <span>Email</span>
                            <strong>{participant.mejl}</strong>
                        </div>

                        <div className="info-red">
                            <span>Telefon</span>
                            <strong>{participant.brojTelefona || "Nije uneto"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Komitet</span>
                            <strong>{participant.komitet || "Nije uneto"}</strong>
                        </div>
                    </div>

                    <div className="participant-info-box">
                        <h5>Podaci za događaj</h5>

                        <div className="info-red">
                            <span>Ishrana</span>
                            <strong>{ISHRANA_MAP[participant.ishrana] || "Nije uneto"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Alergije</span>
                            <strong>{participant.alergije || "Nema unetih alergija"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Vreme dolaska</span>
                            <strong>{formatDatum(participant.vremeDolaska)}</strong>
                        </div>

                        <div className="info-red">
                            <span>Vreme odlaska</span>
                            <strong>{formatDatum(participant.vremeOdlaska)}</strong>
                        </div>
                    </div>

                    <div className="d-grid mt-4">
                        <button
                            className="btn btn-primary rounded-pill"
                            onClick={otvoriIzmenu}
                        >
                            Izmeni profil
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showEditModal && editParticipant && (
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Izmena profila</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowEditModal(false)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label>Ime</label>
                                    <input
                                        className="form-control"
                                        value={editParticipant.ime || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                ime: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Prezime</label>
                                    <input
                                        className="form-control"
                                        value={editParticipant.prezime || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                prezime: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={editParticipant.mejl || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                mejl: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Telefon</label>
                                    <input
                                        className="form-control"
                                        value={editParticipant.brojTelefona || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                brojTelefona: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Komitet</label>
                                    <input
                                        className="form-control"
                                        value={editParticipant.komitet || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                komitet: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Ishrana</label>
                                    <select
                                        className="form-select"
                                        value={editParticipant.ishrana ?? ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                ishrana: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">Izaberite ishranu</option>
                                        <option value="0">Regularna</option>
                                        <option value="1">Vegetarijanska</option>
                                        <option value="2">Veganska</option>
                                        <option value="3">Bez glutena</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label>Vreme dolaska</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={editParticipant.vremeDolaska?.slice(0, 16) || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                vremeDolaska: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label>Vreme odlaska</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={editParticipant.vremeOdlaska?.slice(0, 16) || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                vremeOdlaska: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-12">
                                    <label>Alergije</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Npr. kikiriki, laktoza..."
                                        value={editParticipant.alergije || ""}
                                        onChange={(e) =>
                                            setEditParticipant({
                                                ...editParticipant,
                                                alergije: e.target.value
                                            })
                                        }
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowEditModal(false)}
                            >
                                Otkaži
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={sacuvajIzmene}
                            >
                                Sačuvaj izmene
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}



    </>


} export default ProfilParticipantSection