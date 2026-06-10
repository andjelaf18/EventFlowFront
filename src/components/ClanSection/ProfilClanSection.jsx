import './ProfilClanSection.css';
import Alert from '../Alerts/Alerts.jsx';
import { useState, useEffect } from 'react';
function ProfilClanSection() {

    const [clan, setClan] = useState(null);
    const [alertInfo, setAlertInfo] = useState({
        poruka: "",
        tip: ""
    });

    const STATUS_MAP = {
        0: "Slobodan",
        1: "Zauzet",
        2: "Nedostupan"
    };

    useEffect(() => {
        fetchClan();
    }, []);

    const fetchClan = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://localhost:7080/api/Clan/MojProfil",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setClan(data);
            } else {
                setAlertInfo({
                    poruka: "Neuspešno učitavanje profila člana.",
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



    return <>
        <Alert
            tip={alertInfo.tip}
            poruka={alertInfo.poruka}
            onClose={() => setAlertInfo({ poruka: "", tip: "" })}
        />

        <div className="sekcija-kontejner">
            <h1 className="naslov">Podešavanja profila</h1>
        </div>

        {clan && (
            <div className="clan-profil-wrapper">
                <div className="clan-profil-card">
                    <div className="clan-header">
                        <div className="clan-avatar">
                            {clan.ime?.[0]}
                        </div>

                        <h3>
                            {clan.ime} {clan.prezime}
                        </h3>

                        <span className="clan-badge">
                            Član tima
                        </span>
                    </div>

                    <div className="clan-info-box">
                        <h5>Osnovni podaci</h5>

                        <div className="info-red">
                            <span>Korisničko ime</span>
                            <strong>{clan.username || "Nije uneto"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Email</span>
                            <strong>{clan.mejl || "Nije uneto"}</strong>
                        </div>

                        <div className="info-red">
                            <span>Telefon</span>
                            <strong>{clan.brojTelefona || "Nije uneto"}</strong>
                        </div>
                    </div>

                    <div className="clan-info-box">
                        <h5>Radni podaci</h5>

                        <div className="info-red">
                            <span>Trenutni status</span>
                            <strong>
                                {STATUS_MAP[clan.status] || "Nepoznato"}
                            </strong>
                        </div>

                        <div className="info-red">
                            <span>Broj izvršenih zadataka</span>
                            <strong>{clan.brojIzvrsenihZahteva ?? 0}</strong>
                        </div>
                    </div>

                    <div className="clan-napomena">
                        <i className="bi bi-info-circle"></i>
                        <p>
                            Podaci na profilu su samo za pregled. Za izmenu ličnih podataka
                            obratite se koordinatoru.
                        </p>
                    </div>
                </div>
            </div>
        )}




    </>


} export default ProfilClanSection