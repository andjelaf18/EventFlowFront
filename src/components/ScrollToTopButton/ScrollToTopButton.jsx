import './ScrollToTopButton.css';
import { useEffect, useState } from "react";

function ScrollToTopButton(){

    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
        
        <a href="#" className={`scroll-top d-flex align-items-center justify-content-center ${showScroll ? "active" : ""}`}>
            <i className="bi bi-arrow-up-short"> </i>
        </a>
        
        </>
    )

}
export default ScrollToTopButton