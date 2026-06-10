import './TabelaDostupnosti.css'
import { useState, useEffect } from "react";

function TabelaDostupnosti({ clanovi }) {


    const statusKlasa = (status) => {

        switch (status) {

            case "Dostupan":
                return "dostupan";

            case "Zauzet":
                return "zauzet";

            case "Nedostupan":
                return "nedostupan";

            default:
                return "";
        }
    };

    const termini = [
        "7-10",
        "10-13",
        "13-16",
        "16-19",
        "19-22",
        "22-01"
    ];

    const [dostupnost, setDostupnost] = useState([]);

    useEffect(() => {

        if (clanovi.length > 0) {

            const inicijalniPodaci = clanovi.map(c => ({

                ...c,

                dostupnost: {

                    "7-10": Number(c.status ?? c.Status) === 0,
                    "10-13": Number(c.status ?? c.Status) === 0,
                    "13-16": Number(c.status ?? c.Status) === 0,
                    "16-19": Number(c.status ?? c.Status) === 0,
                    "19-22": Number(c.status ?? c.Status) === 0,
                    "22-01": Number(c.status ?? c.Status) === 0
                }

            }));

            setDostupnost(inicijalniPodaci);
        }

    }, [clanovi]);

    const promeniDostupnost = (clanId, termin) => {

        setDostupnost(prev =>

            prev.map(c => {

                if (c.id === clanId) {

                    return {

                        ...c,

                        dostupnost: {

                            ...c.dostupnost,

                            [termin]: !c.dostupnost[termin]
                        }
                    };
                }

                return c;
            })
        );
    };

    //ovo realizuje prikaz dostupnosti u tabeli samo za danasnji dan, nisam se bas snasla da obradim za 
    //celu nedelju + izgledalo bi prenatrpano i moralo bi da postoji horizontal scroll
    const danas = new Date().getDay();
    const naziviDana = [
        "Nedelja",
        "Ponedeljak",
        "Utorak",
        "Sreda",
        "Četvrtak",
        "Petak",
        "Subota"
    ];
    const trenutniDan = naziviDana[danas];


    return (
        <>

            <h1 className='naslov'> Dostupnost članova tima</h1>
            <div className='tabela-box'>

                <table className="table ">
                    {/* <table className="table ">
                        <thead>
                            <tr>
                                <th>Član</th>
                                <th>Ponedeljak</th>
                                <th>Utorak</th>
                                <th>Sreda</th>
                                <th>Četvrtak</th>
                                <th>Petak</th>
                            </tr>
                        </thead>

                        <tbody>

                            {clanovi.map((c, index) => (

                                <tr key={index}>

                                    <td>{c.ime} {c.prezime}</td>

                                    <td>
                                        <span className={`status-polje ${statusKlasa(c.ponedeljak)}`}>
                                            {c.ponedeljak}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-polje ${statusKlasa(c.utorak)}`}>
                                            {c.utorak}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-polje ${statusKlasa(c.sreda)}`}>
                                            {c.sreda}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-polje ${statusKlasa(c.cetvrtak)}`}>
                                            {c.cetvrtak}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-polje ${statusKlasa(c.petak)}`}>
                                            {c.petak}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>*/}

                    <thead>

                        <tr>

                            <th rowSpan="2">
                                Član
                            </th>

                            <th colSpan={termini.length}>
                                {trenutniDan}
                            </th>

                        </tr>

                        <tr>

                            {termini.map((t, index) => (

                                <th key={index}>
                                    {t}
                                </th>

                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {dostupnost.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    {c.ime} {c.prezime}
                                </td>

                                {termini.map((t, index) => (
                                    <td key={index}>
                                        <div className="slot-box">

                                            <div className="form-check form-switch">

                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={c.dostupnost[t]}
                                                    onChange={() =>
                                                        promeniDostupnost(c.id, t)
                                                    }
                                                />

                                            </div>

                                            <span
                                                className={
                                                    c.dostupnost[t]
                                                        ? "tekst-slobodan"
                                                        : "tekst-zauzet"
                                                }
                                            >

                                                {c.dostupnost[t]
                                                    ? "Slobodan"
                                                    : "Zauzet"
                                                }

                                            </span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>




        </>
    )
} export default TabelaDostupnosti