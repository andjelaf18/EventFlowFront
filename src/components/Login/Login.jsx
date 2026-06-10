import './Login.css'

import DrustveneMreze from '../DrustveneMreze/DrustveneMreze.jsx';
import Alerts from "../Alerts/Alerts.jsx";

import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [KorisnickoIme, setUserName] = useState("");
    const [Lozinka, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    //alert
    const [poruka, setPoruka] = useState("");
    const [tipPoruke, setTipPoruke] = useState("primary");

    function preusmeriKorisnika(role) {
        switch (role) {
            case "Clan":
                navigate("/clan");
                break;
            case "Koordinator":
                navigate("/koordinator");
                break;
            case "Participant":
                navigate("/participant");
                break;
            case "Predavac":
                navigate("/predavac");
                break;
            default:
                navigate("/"); // Ako je uloga nepoznata, idi na početnu
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const korisnik = {
            KorisnickoIme,
            Lozinka
        };

        try {
            const res = await fetch("https://localhost:7080/api/Autentifikacija/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(korisnik)
            });

            if (res.ok) {
                const data = await res.json(); // Ovde dobijaš { tokenString: "..." }

                // 1. Sačuvaj token da bi ostala ulogovana
                localStorage.setItem("token", data.tokenString);
                localStorage.setItem("id", data.userId);
                localStorage.setItem("username", data.username || KorisnickoIme);
                if (data.imageUrl) {
                    localStorage.setItem("imageUrl", data.imageUrl);
                    localStorage.setItem("imageUsername", data.username || KorisnickoIme);
                } else if (localStorage.getItem("imageUsername") !== (data.username || KorisnickoIme)) {
                    localStorage.removeItem("imageUrl");
                    localStorage.removeItem("imageUsername");
                }

                // 2. Dekodiraj token da vidiš ulogu (Role)
                // Pošto je JWT običan string, možemo ga dekodirati (base64)
                const base64Url = data.tokenString.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                //console.log(payload);
                // U payload-u se obično nalazi "role" (proveri Claims u backendu)
                const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                setPoruka("Uspešno logovanje!");
                setTipPoruke("success");

                // 3. Preusmeri na osnovu uloge
                setTimeout(() => {
                    preusmeriKorisnika(userRole);
                }, 1000);
            }
            else {
                setPoruka("Greska pri unosu korisnickog imena ili lozinke!");
                setTipPoruke("danger");
            }
        }
        catch (err) {
            console.log(err);
            setPoruka("Greška sa serverom!");
            setTipPoruke("danger");
        }
    };

    return (
        <>
         {loading && (
            <div className="loader-blocker">
                <div className="loader-spinner"></div>
                <p>Prijavljivanje...</p>
            </div>
        )}
            <div className="login">

                <h1>Log in</h1>

                <Alerts
                    tip={tipPoruke}
                    poruka={poruka}
                    onClose={() => setPoruka("")}
                />

                <form onSubmit={handleSubmit}>

                    <div className='row'>

                        <input className="form-control mb-3"
                            placeholder="Username"
                            value={KorisnickoIme}
                            required
                            onChange={e => setUserName(e.target.value)} />

                        <div className="password-wrapper mb-3">
                    <input className="form-control" 
                            placeholder="Lozinka"
                            value={Lozinka} 
                            type={showPassword ? "text" : "password"}
                            required
                            onChange={e => setPassword(e.target.value)} />

                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                </div>

                <button className="btn btn-primary form-control" disabled={loading}>
                    Uloguj se
                </button>
                    </div>
                </form>

            </div>
            <DrustveneMreze />

        </>
    )
}
export default Login