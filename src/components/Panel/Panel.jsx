import './panel.css'

import Alerts from "../Alerts/Alerts.jsx";

import { useState, useEffect } from 'react'; 
import { useNavigate, Link } from "react-router-dom";

function Panel(){

    const [korisnik, setKorisnik] = useState({ username: "", role: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Dekodiramo JWT token (srednji deo sadrži podatke)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                // Izvlačimo username i ulogu iz claims-a
                setKorisnik({
                    username: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Korisnik",
                    role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                });
            } catch (error) {
                console.error("Greška pri čitanju tokena", error);
            }
        }
    }, []);

    //odjava
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const stavkeMenija = {
        Koordinator: [
            { naziv: "Dashboard", putanja: "/koordinator", ikona: "bi bi-house-door" },
            { naziv: "Članovi tima", putanja: "/koordinator/clanovi", ikona: "bi bi-people-fill" },
            { naziv: "Ostali korisnici", putanja: "/koordinator/ostali-korisnici", ikona:"bi bi-person-fill-gear" },
            { naziv: "Agenda", putanja: "/koordinator/agenda", ikona: "bi bi-clipboard" },
            { naziv: "Događaj", putanja: "/koordinator/novi-event", ikona: "bi bi-calendar4-event" },
            { naziv: "Zahtevi", putanja: "/koordinator/zahtevi", ikona: "bi bi-list-ol" },
            { naziv: "Profil", putanja: "/koordinator/profil-podesavanja", ikona: "bi bi-gear"}
        ],
        Clan: [
            { naziv: "Dashboard", putanja: "/clan", ikona: "bi bi-house-door" },
            { naziv: "Moji Taskovi", putanja: "/clan/taskovi", ikona: "bi bi-card-checklist" },
            { naziv: "Dostupnost", putanja: "/clan/dostupnost", ikona: "bi bi-clock-fill" },
            { naziv: "Profil", putanja: "/clan/profil-podesavanja", ikona: "bi bi-gear"}
        ],
        Predavac: [
            { naziv: "Dashboard", putanja: "/predavac", ikona: "bi bi-house-door" },
            { naziv: "Moje Sesije", putanja: "/predavac/sesije", ikona: "bi bi-hourglass-split" },
           // { naziv: "Termini", putanja: "/predavac/termini", ikona: "bi bi-clock-fill" },
            { naziv: "Traži pomoć", putanja: "/predavac/pomoc-od-koordinatora", ikona: "bi bi-question-circle"}, 
            { naziv: "Profil", putanja: "/predavac/profil-podesavanja", ikona: "bi bi-gear"}
        ],
        Participant: [
            { naziv: "Dashboard", putanja: "/participant", ikona: "bi bi-house-door" },
            { naziv: "Agenda", putanja: "/participant/agenda", ikona: "bi bi-clipboard" },
          //  { naziv: "Moji Zahtevi", putanja: "/participant/zahtevi", ikona: "bi bi-list-ol" },
           //?? da li i partiicpant moze da trazi pomoc { naziv: "Traži pomoć", putanja: "/participant/pomoc-od-koordinatora", ikona: "bi bi-question-circle"}, 
            { naziv: "Profil", putanja: "/participant/profil-podesavanja", ikona: "bi bi-gear"}
        ]
    };

    const trenutneStavke = stavkeMenija[korisnik.role] || [];

    return (
        <>

        <div className='levo'>
            <div className='profil-sekcija'>
                <div className='avatar-krug'>
                    {korisnik.username ? korisnik.username.charAt(0).toUpperCase() : "?"}
                </div>
                <h2 className="user-ime">{korisnik.username}</h2>
                <span className="user-role">{korisnik.role}</span>
            </div>

            <nav className='meni-linkovi'>
               {/* <Link to="/koordinator" className="nav-stavka">Dashboard</Link>
                    {korisnik.role === 'Koordinator' && (
                        <>
                            <Link to="/koordinator/clanovi" className="nav-stavka">Članovi tima</Link>
                            <Link to="/koordinator/agenda" className="nav-stavka">Agenda</Link>
                        </>
                    )} */}
                   {trenutneStavke.map((stavka, index) => (
                    <Link key={index} to={stavka.putanja} className="nav-stavka">
                        <i className={`${stavka.ikona} me-2`}></i> 
                        <span className='beliTekst'>{stavka.naziv}</span>
                    </Link>
                ))}
                <button onClick={handleLogout} className="btn-logout">Odjavi se</button>
            </nav>
        </div>

        </>
    )


} export default Panel