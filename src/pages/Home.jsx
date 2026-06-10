
//import Header from '../components/Header/Header.jsx';
import Hero from '../components/Hero/Hero.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton/ScrollToTopButton.jsx';
import Brojke from '../components/Brojke/Brojke.jsx';
import DrustveneMreze from '../components/DrustveneMreze/DrustveneMreze.jsx';
import BlueSection from '../components/BlueSection/BlueSection.jsx';

function Home() {

  return (
    <>

    {/*MENI
    <Header/>*/}

    {/* GLAVNI SADRŽAJ I HERO SEKSIJA */}
    <Hero/>

    {/*BELA SEKCIJA NA SREDINI*/}
    <Brojke> </Brojke> 

    {/*MINI TEKST SEKCIJA, PLAVA POZADINA*/}
    <BlueSection/>
     
    {/*DRUSTVENE MREZE*/}
    <DrustveneMreze> </DrustveneMreze>

    {/*SCROLL TO TOP DUGME*/}
    <ScrollToTopButton/>

    </>
  )
}

export default Home
