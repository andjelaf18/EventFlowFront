import './DashboardSection.css'
import { useState, useEffect } from 'react';

function DashboardSection() {

const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const token = localStorage.getItem("token");
    // Povlačimo ID sigurno i pretvaramo ga u broj odmah
    const korisnikId = parseInt(localStorage.getItem("id")) || null;

    // Učitavanje zadataka sa bekhenda čim se stranica otvori
    useEffect(() => {
        if (token) {
            fetchZadaci();
        }
    }, [token]);

    const fetchZadaci = async () => {
        try {
            const res = await fetch(`https://localhost:7080/api/ListaDashboard/VratiMojuListu`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            } else {
                console.error("Bekhend je vratio grešku pri učitavanju:");
            }
        } catch (err) {
            console.error("Greška pri učitavanju zadataka:", err);
        }
    };
    // Primer ako koristiš standardni fetch:

/* ovo je drugo   const fetchZadaci = async () => {
    try {
        // Izvlačimo token iz localStorage (proveri tačan naziv ključa koji koristiš pri logovanju!)
        const token = localStorage.getItem("token") || localStorage.getItem("tokenString"); 

        const response = await fetch(`https://localhost:7080/api/ListaDashboard/Korisnik/${korisnikId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // DODAJ OVU LINIJU:
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.error("Niste autorizovani! Token nedostaje ili je istekao.");
            return;
        }

        const podaci = await response.json();
        // ... tvoj kod za postavljanje stanja (npr. setLista(podaci))
    } catch (error) {
        console.error("Greška:", error);
    }
};*/

    // Dodavanje novog zadatka na bekhend
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim() || !korisnikId) return;

        try {
            const res = await fetch(`https://localhost:7080/api/ListaDashboard/DodajTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // Šaljemo tačna svojstva u skladu sa C# backend konvencijom (Velika slova)
                body: JSON.stringify({
                    Tekst: newTask,
                    KorisnikId: korisnikId
                })
            });

            if (res.ok) {
                setNewTask("");
                fetchZadaci(); // Osveži listu sa baze
            }
        } catch (err) {
            console.error("Greška pri dodavanju zadatka:", err);
        }
       /*ovo je drugo try {
        const token = localStorage.getItem("token") || localStorage.getItem("tokenString");

        const response = await fetch("https://localhost:7080/api/ListaDashboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // DODAJ OVU LINIJU:
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Tekst: noviTask, // Ili kako ti se već zove polje u DTO-u na bekhendu [cite: 86-87]
                Zavrsen: false,
                DatumKreiranja: new Date().toISOString()
            })
        });

        if (response.ok) {
            const rezultat = await response.json();
            // ... osvežavanje stanja na frontu
        }
    } catch (error) {
        console.error("Greška pri dodavanju:", error);
    }*/
    };

    // Menjanje statusa (Završen/Aktivan) na bekhendu
    const toggleTask = async (id) => {
        try {
            const res = await fetch(`https://localhost:7080/api/ListaDashboard/Ispunjeno/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchZadaci(); // Osveži stanje
            }
        } catch (err) {
            console.error("Greška pri izmeni statusa zadatka:", err);
        }
    };

    // Brisanje zadatka sa bekhenda
    const deleteTask = async (id) => {
        try {
            const res = await fetch(`https://localhost:7080/api/ListaDashboard/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchZadaci(); // Osveži listu
            }
        } catch (err) {
            console.error("Greška pri brisanju zadatka:", err);
        }
    };

    // Pomoćni podaci za brzi kalendar
    const danas = new Date();
    const trenutniMesecGodina = danas.toLocaleDateString('sr-Latn-RS', { month: 'long', year: 'numeric' });
    const danUMesecu = danas.getDate();
    return (
        <>
           <div className='sekcija-kontejner'>
                <h1 className='naslov'>Dobrodošli nazad!</h1>
            </div>

            <div className="dashboard-wrapper">
                <div className="row g-4">

                    {/* LEVA STRANA: To-Do*/}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 p-4 bg-white h-100 rounded-3">
                            <h4 className="fw-bold mb-3 text-dark"> <i className="bi bi-pin-angle-fill"></i> Moj podsetnik</h4>

                            <form onSubmit={addTask} className="d-flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Dodaj novu obavezu..."
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary px-3">Dodaj</button>
                            </form>

                            <ul className="list-group list-group-flush task-lista">
                                {tasks.map(task => {
                                    // Fleksibilno čitanje polja (pokriva i mala i velika početna slova iz JSON-a)
                                    const idZadatka = task.id || task.Id;
                                    const tekstZadatka = task.text || task.tekst || task.Tekst;
                                    const jeZavrsen = task.completed !== undefined ? task.completed : (task.ispoljeno || task.Ispoljeno);

                                    return (
                                        <li key={idZadatka} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={jeZavrsen || false}
                                                    onChange={() => toggleTask(idZadatka)}
                                                />
                                                <span className={jeZavrsen ? "text-decoration-line-through text-muted" : "text-dark"}>
                                                    {tekstZadatka}
                                                </span>
                                            </div>
                                            <button className="btn btn-link text-danger p-0" onClick={() => deleteTask(idZadatka)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* DESNA STRANA: Kalendar */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 p-4 bg-white h-100 rounded-3 text-center d-flex flex-column justify-content-center">
                            <h5 className="text-uppercase text-muted fw-bold mb-1">{trenutniMesecGodina}</h5>
                            <hr className="my-2" />
                            <div className="kalendar-veliki-dan mb-2 text-primary fw-bold">
                                {danUMesecu}
                            </div>
                            <p className="text-secondary mb-0 fw-semibold">
                                Danas je: {danas.toLocaleDateString('sr-Latn-RS', { weekday: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

} export default DashboardSection