import './Registracija.css'

import DrustveneMreze from '../DrustveneMreze/DrustveneMreze.jsx'; 
import Alerts from "../Alerts/Alerts.jsx";

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
//import Input from "@/components/lib/inputs/text-input";

function Registracija(){

    const navigate = useNavigate();
    //osnovni podaci
    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [mejl, setMejl] = useState("");
    const [brojTelefona, setBrTelefona] = useState("");
     const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(0);
    const [slika, setPic] = useState("");
    //dodatni podaci za razlicite uloge
    const [komitet, setKomitet] = useState("");
    const [alergije, setAlergije] = useState("");
    const [ishrana, setIshrana] = useState("");
    const [vremeDolaska, setDolazak] = useState("");
    const [vremeOdlaska, setOdlazak] = useState("");
    const [tipKoordinatora, setKoordinator] = useState(0);
    //alert
    const [poruka, setPoruka] = useState("");
    const [tipPoruke, setTipPoruke] = useState("primary");
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        const korisnik = {
            //osnovni podaci
            username: username,
            password: password,
            ime: ime,
            prezime: prezime,
            mejl: mejl,
            brojTelefona: brojTelefona,
            role: parseInt(role),
            //dodatni podaci - mogu a i ne mora da se unose, zavisno od role 
            komitet: (role == 1 || role == 2 || role == 3) ? komitet : null,
            alergije: (role == 2 || role == 3) ? alergije : null,
            ishrana: (role == 2 || role == 3) ? parseInt(ishrana) : null,
            vremeDolaska: (role == 2 || role == 3) ? (vremeDolaska || null) : null,
            vremeOdlaska: (role == 2 || role == 3) ? (vremeOdlaska || null) : null,
            tipKoordinatora: role == 1 ? tipKoordinatora : null 
        };

        try {
            setLoading(true);
            const res = await fetch("https://localhost:7080/api/Autentifikacija/Registracija", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(korisnik)
            });
        
            if (res.ok) {
                const data = await res.json();
                //console.log("Odgovor sa bekenda:", data);
               /* if(data.tokenString) {
                    localStorage.setItem("token", data.tokenString);
                }
                setPoruka("Uspešna registracija!");
                setTipPoruke("success");*/
                if(data.tokenString) {
                    localStorage.setItem("token", data.tokenString);
                }
                if(data.userId) {
                    localStorage.setItem("id", data.userId);
                }
                localStorage.setItem("username", data.username || username);
                if(slika) {
                    localStorage.setItem("imageUrl", slika);
                    localStorage.setItem("imageUsername", data.username || username);
                } else {
                    localStorage.removeItem("imageUrl");
                    localStorage.removeItem("imageUsername");
                }
                setPoruka("Uspešna registracija!");
                setTipPoruke("success");
                
                //nakon logovanja se ucitava odgovarajuca strana na osnovu uloge koju korisnik odabere
                setTimeout(() => {
                    if (role === 0) navigate("/clan");
                    if (role === 1) navigate("/koordinator");
                    if (role === 2) navigate("/participant");
                    if (role === 3) navigate("/predavac");
                }, 1500);
                   
            } 
            else {
                setPoruka("Greška pri registraciji!");
                setTipPoruke("danger");
            }
        }
        catch (err) {
            console.log(err);
            etPoruka("Greška sa serverom!");
            setTipPoruke("danger");
        }
        finally {
            setLoading(false);
        }
    };

    return(
        <> 
        {loading && (
            <div className="loader-blocker">
                <div className="loader-spinner"></div>
                <p>Registracija u toku...</p>
            </div>
        )}
        <div className="registracija">

            <h2 className="text-center mb-4">Registracija</h2>

            <Alerts 
                tip={tipPoruke} 
                poruka={poruka} 
                onClose={() => setPoruka("")}
            />

            <form onSubmit={handleSubmit}> 

            <div className='row'> 
                <input className="form-control mb-3" 
                        placeholder="Ime"
                        value={ime} 
                        required
                        onChange={e => setIme(e.target.value)} />

                <input className="form-control mb-3"
                        placeholder="Prezime"
                        value={prezime} 
                        required
                        onChange={e => setPrezime(e.target.value)} />

                <input className="form-control mb-3" 
                        placeholder="Email"
                        value={mejl} 
                        type="email"
                        required
                        onChange={e => setMejl(e.target.value)} />

                <input className="form-control mb-3" 
                        placeholder="Telefon"
                        value={brojTelefona} 
                        required
                        onChange={e => setBrTelefona(e.target.value)} />

                <input className="form-control mb-3" 
                        placeholder="Username"
                        value={username} 
                        required
                        onChange={e => setUsername(e.target.value)} />

                <input className="form-control mb-3" 
                        placeholder="Lozinka"
                        value={password} 
                        type="password"
                        required
                        onChange={e => setPassword(e.target.value)} />

                <select className="form-control mb-3"
                        value={role} 
                        onChange={e => setRole(parseInt(e.target.value))}>

                    <option value={0}>Član</option>
                    <option value={1}>Koordinator</option>
                    <option value={2}>Participant</option>
                    <option value={3}>Predavač</option>
                </select>

                {/*{role === 0 && (
                    <input className="form-control mb-3" 
                                    placeholder="Broj izvrsenih zahteva" />  
                ?? DA LI MI OVO REALNO TREBA - TO SE OCEKUJE KAO PODATAK
                ZA CLANA ALI ON SE PRVI PUT REGISTRUJE
                ZNACI NEMA IZVRSENE ZAHTEVE PA MI NISTA DODATNO ZA CLANA I NE TREBA
                )}*/}

                {(role === 3 || role === 2) && (
                <>
                        <input className="form-control mb-3" 
                                placeholder="Komitet" 
                                onChange={e => setKomitet(e.target.value)} />

                        <input className="form-control mb-3" 
                                placeholder="Alergije" 
                                onChange={e => setAlergije(e.target.value)} />

                       <select className="form-control mb-3" 
                                value={ishrana}
                                onChange={e => setIshrana(e.target.value)}>
                                    
                            <option value="">Izaberi tip ishrane</option>
                            <option value={0}>Vegan</option>
                            <option value={1}>Vegetarijanac</option>
                            <option value={2}>Mesojed</option>
                        </select>             

                        <input 
                                type="datetime-local"
                                className={`form-control mb-3 custom-datetime ${!vremeDolaska ? "empty" : ""}`}
                                data-placeholder="Vreme dolaska"
                                value={vremeDolaska}
                                onChange={(e) => setDolazak(e.target.value)} />

                        <input 
                                type="datetime-local"
                                className={`form-control mb-3 custom-datetime ${!vremeOdlaska ? "empty" : ""}`}
                                data-placeholder="Vreme odlaska"
                                value={vremeOdlaska}
                                onChange={(e) => setOdlazak(e.target.value)} />

                    </>
                )}

                {role === 1 && (
                        <select className="form-control mb-3" 
                                value={tipKoordinatora}
                                onChange={e => setKoordinator(e.target.value)}>
                                    
                            <option value="">Izaberi tip koordinatora</option>
                            <option value={0}>FR</option>
                            <option value={1}>HR</option>
                            <option value={2}>CP</option>
                            <option value={3}>PR</option>
                            <option value={4}>Logistika</option>
                            <option value={5}>IT</option>
                            <option value={6}>Chairperson</option>
                        </select>
                )}

                <input className="form-control mb-3" 
                        placeholder="Slika URL (opciono)"
                        value={slika} 
                        onChange={e => setPic(e.target.value)} />

                <button className="btn btn-primary form-control">Registruj se </button>

            </div>
            </form>

        </div>
        <DrustveneMreze/>        
        
        </>
    )
}
export default Registracija