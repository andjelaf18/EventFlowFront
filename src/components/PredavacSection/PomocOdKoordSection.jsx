import './PomocOdKoordSection.css'
import Alert from '../Alerts/Alerts';

import { useState, useEffect } from 'react';

function PomocOdKoordSection() {

    //alerts
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const [zahtev, setZahtev] = useState({
        koordinatorId: "",
        naslov: "",
        opis: "",
        prioritet: ""
    });

    // PRIVREMENI PODACI - kasnije ovo dolazi sa backend-a
    const koordinatori = [
        { id: 1, ime: "Ana", prezime: "Antić", tip: "Logistika" },
        { id: 2, ime: "Marko", prezime: "Marković", tip: "IT" },
        { id: 3, ime: "Jovana", prezime: "Jovanović", tip: "HR" }
    ];

    const posaljiZahtev = (e) => {
        e.preventDefault();

        if (!zahtev.koordinatorId || !zahtev.naslov.trim() || !zahtev.opis.trim()) {
            setAlertInfo({
                poruka: "Molimo popunite sva obavezna polja.",
                tip: "error"
            });
            return;
        }

        console.log("Zahtev za pomoć:", zahtev);

        setAlertInfo({
            poruka: "Zahtev je pripremljen za slanje. Backend logika će biti dodata kasnije.",
            tip: "success"
        });

        setZahtev({
            koordinatorId: "",
            naslov: "",
            opis: "",
            prioritet: "srednji"
        });
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
                <h1 className='naslov'>Potraži pomoć od koordinatora</h1>
            </div>


            <div className="pomoc-wrapper">
                <div className="pomoc-card">
                    <div className="pomoc-header">
                        <div>
                            <h3>Zatražite pomoć</h3>
                            <p>
                                Pošaljite pitanje ili opis problema izabranom koordinatoru.
                            </p>
                        </div>

                        <div className="pomoc-ikona">
                            <i className="bi bi-question-circle"></i>
                        </div>
                    </div>

                    <form onSubmit={posaljiZahtev}>
                        <div className="mb-3">

                            <select
                                className="form-select"
                                value={zahtev.koordinatorId}
                                onChange={(e) =>
                                    setZahtev({
                                        ...zahtev,
                                        koordinatorId: e.target.value
                                    })
                                }
                            >
                                <option value="">Izaberite koordinatora</option>

                                {koordinatori.map(k => (
                                    <option key={k.id} value={k.id}>
                                        {k.ime} {k.prezime} - {k.tip}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Kratko napišite temu problema..."
                                value={zahtev.naslov}
                                onChange={(e) =>
                                    setZahtev({
                                        ...zahtev,
                                        naslov: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={zahtev.prioritet}
                                onChange={(e) =>
                                    setZahtev({
                                        ...zahtev,
                                        prioritet: e.target.value
                                    })
                                }
                            >
                                <option value="">
                                    Izaberite prioritet problema
                                </option>

                                <option value="srednji">
                                    Srednji
                                </option>

                                <option value="nizak">
                                    Niski
                                </option>

                                <option value="visok">
                                    Visoki
                                </option>
                            </select>
                        </div>

                        <div className="mb-4">

                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Detaljno opišite problem ili pitanje..."
                                value={zahtev.opis}
                                onChange={(e) =>
                                    setZahtev({
                                        ...zahtev,
                                        opis: e.target.value
                                    })
                                }
                            ></textarea>
                        </div>

                        <div className="pomoc-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setZahtev({
                                        koordinatorId: "",
                                        naslov: "",
                                        opis: "",
                                        prioritet: "srednji"
                                    })
                                }
                            >
                                Poništi
                            </button>

                            <button type="submit" className="btn btn-primary">
                                Pošalji zahtev
                            </button>
                        </div>
                    </form>
                </div>
            </div>




        </>
    )
} export default PomocOdKoordSection