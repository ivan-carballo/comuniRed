import '../../saas/options/userModificar.scss'

import React from "react";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import sha256 from 'js-sha256'
import { getUser, getUserByID, userUpdate, userUpdateIMG } from '../../api/userAPI.js'
import { ImageUpload, validImageTypes } from '../../funciones/resizeIMG.js';
import Swal from 'sweetalert2';


// Componente para que el usuario pueda modificar sus datos
function UserModificar() {
    const userCurrentID = Cookies.get('id')

    const [aviso, setAviso] = useState()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')


    // useEffect para traer la informacion del usuario de MongoDB
    useEffect(() => {
        userData()
        async function userData() {
            const getUserData = await getUserByID(userCurrentID)
            setUsername(getUserData.data.username)
            setEmail(getUserData.data.email)
        }
    }, [])


    // Expresiones regulares para poder validar los datos nuevos que el usuario quiera cambiar
    const regexUsername = /^[A-Za-z0-9]+$/
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#%&_])[a-zA-Z0-9@#%&_]+$/




    // Funcion a la que se llama desde el boton de modificar
    async function sendNewData(e) {
        // Se meten en variables los datos de los inputs
        const newUsername = e.target.parentElement.childNodes[0].value
        const newEmail = e.target.parentElement.childNodes[1].value
        const newPassword = e.target.parentElement.childNodes[2].value
        const newRepeatPassword = e.target.parentElement.childNodes[3].value
        let newIMG = e.target.parentElement.childNodes[4].files[0]

        const usersAll = await getUser()

        // Condicionales para comprobar que se han rellenado todos los inputs, que no existe otro usuario con el mismo username y email, y que los datos nuevos son validos usando las expresiones regulares
        if (newEmail.length > 0 && newUsername.length > 0) {
            const emailFiltrar = usersAll.data.filter((data) => data.email === newEmail)
            const userFiltrar = usersAll.data.filter((data) => data.username === newUsername)

            if (newUsername.length < 1 || newEmail.length < 1 || newPassword.length < 1 || newRepeatPassword.length < 1) {
                setAviso('Debes rellenar todos los campos')
            } else if (newUsername.length < 4) {
                setAviso('Su username debe tener al menos cuatro caracteres')
            } else if (!regexUsername.test(newUsername)) {
                setAviso('Su username solo debe tener letras minusculas, mayusculas y numeros')    
            } else if (!regexEmail.test(newEmail)) {
                setAviso('La direccion de email no es correcta')
            } else if (newPassword !== newRepeatPassword) {
                setAviso('Las contraseñas no coinciden')
            } else if (newPassword.length < 8) {
                setAviso('Su contraseña debe tener al menos 8 caracteres')
            } else if (!regexPassword.test(newPassword)) {
                setAviso('Su contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial (_ @ # % &)')
            } else if (userFiltrar.length > 1) {
                setAviso('El username ya esta en uso')
            } else if (emailFiltrar.length > 1) {
                setAviso('El email ya esta en uso')
            } else {
                
                // Condicional para evitar que se carguen archivos que no sean de imagen
                if (newIMG) {
                    if (validImageTypes(newIMG.type)) {
                        // Condicional para que cuando no haya cargada una imagen, no ejecute la funcion para evitar errores
                        if (newIMG != undefined && newIMG != null) {
                            newIMG = await ImageUpload(newIMG)
                        }
                    } else {
                        setAviso('Debe seleccionar solo archivos de imagen')
                        return
                    }

                    const newUserData = {'username': newUsername,
                                        'email': newEmail,
                                        'password': sha256(newPassword),
                                        'img': newIMG}

                        const userCurrentUpdate = await userUpdateIMG(userCurrentID, newUserData)

                        setAviso('Sus datos han sido modificados correctamente')

                        swalAlert(e)
                } else {
                    const newUserData = {'username': newUsername,
                                        'email': newEmail,
                                        'password': sha256(newPassword)}

                    const userCurrentUpdate = await userUpdate(userCurrentID, newUserData)

                    setAviso('Sus datos han sido modificados correctamente')

                    swalAlert(e)
                }
            }
        }
    }


    // Funcion que muestra un mensaje cuando el usuario se ha cambiado correctamente
    async function swalAlert(e) {

        e.target.parentElement.childNodes[4].value = ''
        e.target.parentElement.childNodes[3].value = ''
        e.target.parentElement.childNodes[2].value = ''

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Su usuario ha sido modificado correctamente",
            showConfirmButton: false,
            timer: 2000
          });
    }


    async function newUsername(e) {
        setUsername(e.target.value)
    }

    async function newEmail(e) {
        setEmail(e.target.value)
    }





    return (
        <div id="userModificar-body">
            <p id='userModificar-rotulo'>Modificar datos de usuario</p>
            <h3 id='userModificar-aviso'>{aviso}</h3>

            <div id="userModificar-inputs">
                <input type="text" placeholder='Username' name="username" value={username} onChange={newUsername} />
                <input type="email" placeholder='Email' name="email" value={email} onChange={newEmail} />
                <input type="password" placeholder='Password' name="password" />
                <input type="password" placeholder='Repeat Password' name="repeatPassword" />
                <input type="file" name="file" id="file" />
                <input type="button" id='userModificar-button' value="Modificar datos" onClick={sendNewData} />

            </div>

        </div>
    )
}



export {
    UserModificar
}