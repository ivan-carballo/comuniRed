import { useState, useEffect } from "react";
import { Navbar } from "../componentes/navbar.jsx";
import { useNavigate } from "react-router-dom";
import { obtenerToken } from "../funciones/token.js";
import { Navigate } from "react-router-dom";





function ComuniWall() {
    const navigate = useNavigate()

    const [recarga, setRecarga] = useState(false)


    

    useEffect(() => {
        if (recarga) {
            const token = obtenerToken()

            if (token === null) {
                navigate("/")
            }
            setRecarga(false)
        }
    })

    setInterval(() => {
        setRecarga(true)
    }, 60000);






    return (
        <div id='index-cuerpo'>
            <Navbar />
            <h2>ComuniWall</h2>



        </div>
    )
}




export {
    ComuniWall
}