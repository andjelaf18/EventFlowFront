import './DostupnostClanovaSection.css';
import Alert from '../Alerts/Alerts.jsx';
import { useState, useEffect } from 'react';

function DostupnostClanovaSection() {
    
    const [termini, setTermini] = useState([]);
    const [noviTermin, setNoviTermin] = useState({
        datum: "",
        vremeOd: "",
        vremeDo: "",
        jeDostupan: ""
    });

    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const clanId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const STATUS_MAP = {
        0: "Slobodan",
        1: "Zauzet",
        2: "Nedostupan"
    };

    useEffect(() => {
        fetchTermini();
    }, []);

    const fetchTermini = async () => {
        try {
            const res = await fetch(
                `https://localhost:7080/api/VremeDostupnosti/Clan/${clanId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setTermini(data);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje termina dostupnosti.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju dostupnosti.",
                tip: "error"
            });
        }
    };

    const dodajTermin = async (e) => {
        e.preventDefault();

        if (
            !noviTermin.datum ||
            !noviTermin.vremeOd ||
            !noviTermin.vremeDo ||
            noviTermin.jeDostupan === ""
        ) {
            setAlertInfo({
                poruka: "Popunite sva polja za dostupnost.",
                tip: "error"
            });
            return;
        }

        const body = {
            datum: noviTermin.datum,
            vremeOd: `${noviTermin.vremeOd}:00`,
            vremeDo: `${noviTermin.vremeDo}:00`,
            jeDostupan: Number(noviTermin.jeDostupan)
        };

        try {
            const res = await fetch(
                `https://localhost:7080/api/VremeDostupnosti/Dodaj/${clanId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (res.ok) {
                setAlertInfo({
                    poruka: "Termin dostupnosti je uspešno dodat.",
                    tip: "success"
                });

                setNoviTermin({
                    datum: "",
                    vremeOd: "",
                    vremeDo: "",
                    jeDostupan: ""
                });

                fetchTermini();
            } else {
                const greska = await res.text();
                setAlertInfo({
                    poruka: greska || "Neuspešno dodavanje termina.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri dodavanju termina.",
                tip: "error"
            });
        }
    };

    const obrisiTermin = async (id) => {
        try {
            const res = await fetch(
                `https://localhost:7080/api/VremeDostupnosti/Obrisi/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                setAlertInfo({
                    poruka: "Termin dostupnosti je obrisan.",
                    tip: "success"
                });

                fetchTermini();
            } else {
                const greska = await res.text();
                setAlertInfo({
                    poruka: greska || "Neuspešno brisanje termina.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri brisanju termina.",
                tip: "error"
            });
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



    return <>
        <Alert
            tip={alertInfo.tip}
            poruka={alertInfo.poruka}
            onClose={() => setAlertInfo({ poruka: "", tip: "" })}
        />

        <div className="sekcija-kontejner">
            <h1 className="naslov">Moja dostupnost</h1>
        </div>

        <div className="dostupnost-wrapper">
            <div className="dostupnost-form-card">
                <h4>Dodaj termin dostupnosti</h4>
                <p className="text-muted">
                    Unesite period u kom ste dostupni, zauzeti ili nedostupni.
                </p>

                <form onSubmit={dodajTermin}>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <input
                                type="date"
                                className={`form-control custom-dostupnost-input ${!noviTermin.datum ? "empty" : ""}`}
                                data-placeholder="Datum"
                                value={noviTermin.datum}
                                onChange={(e) =>
                                    setNoviTermin({
                                        ...noviTermin,
                                        datum: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <input
                                type="time"
                                className={`form-control custom-dostupnost-input ${!noviTermin.vremeOd ? "empty" : ""}`}
                                data-placeholder="Vreme od"
                                value={noviTermin.vremeOd}
                                onChange={(e) =>
                                    setNoviTermin({
                                        ...noviTermin,
                                        vremeOd: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <input
                                type="time"
                                className={`form-control custom-dostupnost-input ${!noviTermin.vremeDo ? "empty" : ""}`}
                                data-placeholder="Vreme do"
                                value={noviTermin.vremeDo}
                                onChange={(e) =>
                                    setNoviTermin({
                                        ...noviTermin,
                                        vremeDo: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={noviTermin.jeDostupan}
                                onChange={(e) =>
                                    setNoviTermin({
                                        ...noviTermin,
                                        jeDostupan: e.target.value
                                    })
                                }
                            >
                                <option value="">Izaberite status</option>
                                <option value="0">Slobodan</option>
                                <option value="1">Zauzet</option>
                                <option value="2">Nedostupan</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <button className="btn btn-primary" type="submit">
                            Dodaj termin
                        </button>
                    </div>
                </form>
            </div>

            <div className="dostupnost-tabela-card">
                <h4>Moji termini</h4>

                <div className="table-responsive">
                    <table className="table dostupnost-table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Datum</th>
                                <th>Vreme od</th>
                                <th>Vreme do</th>
                                <th>Status</th>
                                <th>Akcija</th>
                            </tr>
                        </thead>

                        <tbody>
                            {termini.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Nema unetih termina dostupnosti.
                                    </td>
                                </tr>
                            ) : (
                                termini.map((termin, index) => (
                                    <tr key={termin.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDatum(termin.datum)}</td>
                                        <td>{formatVreme(termin.vremeOd)}</td>
                                        <td>{formatVreme(termin.vremeDo)}</td>
                                        <td>
                                            <span
                                                className={`status-badge status-${termin.jeDostupan}`}
                                            >
                                                {STATUS_MAP[termin.jeDostupan] || "Nepoznato"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => obrisiTermin(termin.id)}
                                            >
                                                Obriši
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>




    </>


} export default DostupnostClanovaSection