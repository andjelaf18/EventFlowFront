import './TaskoviZaClanoveSection.css';
import Alert from '../Alerts/Alerts';
import { useEffect, useState } from 'react';

function TaskoviZaClanoveSection() {
    const [taskovi, setTaskovi] = useState([]);
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const clanId = Number(localStorage.getItem("id"));
    const token = localStorage.getItem("token");

    const STATUS_MAP = {
        0: "Prihvaćeno",
        1: "Odbijeno",
        2: "Izvršeno",
        3: "Na čekanju"
    };

    useEffect(() => {
        fetchTaskovi();
    }, []);

    const fetchTaskovi = async () => {
        try {
            const res = await fetch(
                "https://localhost:7080/api/Zahtev/detalji",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();

                const mojiTaskovi = data.filter(zahtev =>
                    zahtev.zaduzeniClan?.some(clan => clan.id === clanId)
                );

                setTaskovi(mojiTaskovi);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje zadataka.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri učitavanju zadataka.",
                tip: "error"
            });
        }
    };

    const oznaciKaoIzvrseno = async (id) => {
        try {
            const res = await fetch(
                `https://localhost:7080/api/Zahtev/${id}/izvrsi`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                setAlertInfo({
                    poruka: "Zadatak je označen kao izvršen.",
                    tip: "success"
                });

                fetchTaskovi();
            } else {
                const greska = await res.text();
                setAlertInfo({
                    poruka: greska || "Neuspešna izmena statusa zadatka.",
                    tip: "error"
                });
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                poruka: "Greška pri završavanju zadatka.",
                tip: "error"
            });
        }
    };

    const formatDatum = (datum) => {
        if (!datum) return "-";
        return new Date(datum).toLocaleDateString();
    };

    const aktivniTaskovi = taskovi.filter(t => Number(t.statusZahteva) !== 2);
    const zavrseniTaskovi = taskovi.filter(t => Number(t.statusZahteva) === 2);

    const renderStatus = (status) => {
        const s = Number(status);

        return (
            <span className={`task-status status-${s}`}>
                {STATUS_MAP[s] || "Nepoznato"}
            </span>
        );
    };

    const renderTabela = (lista, prikaziDugme) => (
        <div className="table-responsive">
            <table className="table taskovi-table align-middle">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Opis</th>
                        <th>Događaj</th>
                        <th>Status</th>
                        <th>Datum kreiranja</th>
                        {prikaziDugme && <th>Akcija</th>}
                    </tr>
                </thead>

                <tbody>
                    {lista.length === 0 ? (
                        <tr>
                            <td
                                colSpan={prikaziDugme ? "6" : "5"}
                                className="text-center py-4"
                            >
                                Nema zadataka za prikaz.
                            </td>
                        </tr>
                    ) : (
                        lista.map((task, index) => (
                            <tr key={task.id}>
                                <td>{index + 1}</td>
                                <td className="task-opis">{task.opis}</td>
                                <td>{task.dogadjaj?.ime || "-"}</td>
                                <td>{renderStatus(task.statusZahteva)}</td>
                                <td>{formatDatum(task.createdAt)}</td>

                                {prikaziDugme && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => oznaciKaoIzvrseno(task.id)}
                                        >
                                            Označi kao izvršeno
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            <Alert
                tip={alertInfo.tip}
                poruka={alertInfo.poruka}
                onClose={() => setAlertInfo({ poruka: "", tip: "" })}
            />

            <div className="sekcija-kontejner">
                <h1 className="naslov">Moji zadaci</h1>
            </div>

            <div className="taskovi-wrapper">
                <div className="taskovi-card">
                    <div className="taskovi-header">
                        <div>
                            <h4>Aktivni zadaci</h4>
                            <p>Zadaci koji su vam trenutno dodeljeni.</p>
                        </div>

                        <span className="taskovi-broj">
                            {aktivniTaskovi.length}
                        </span>
                    </div>

                    {renderTabela(aktivniTaskovi, true)}
                </div>

                <div className="taskovi-card">
                    <div className="taskovi-header">
                        <div>
                            <h4>Završeni zadaci</h4>
                            <p>Pregled zadataka koje ste označili kao izvršene.</p>
                        </div>

                        <span className="taskovi-broj zavrseni">
                            {zavrseniTaskovi.length}
                        </span>
                    </div>

                    {renderTabela(zavrseniTaskovi, false)}
                </div>
            </div>
        </>
    );
}

export default TaskoviZaClanoveSection;