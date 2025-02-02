import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { getUserByID } from "../../api/userAPI";
import { getFollowByProperty } from '../../api/followAPI'
import { getFollowerByProperty } from "../../api/followerAPI";
import { followAdd } from '../../funciones/follow.js'
import Swal from "sweetalert2";

import '../../saas/perfil/userPost.scss'


function AllFollowByUser() {
    const navigate = useNavigate()
    const userCurrentID = Cookies.get('id')

    const [reboot, setReboot] = useState(true)
    const [buttonFollow, setButtonFollow] = useState('active')
    const [buttonFollower, setButtonFollower] = useState()
    const [show, setShow] = useState()
    const [showFollow, setShowFollow] = useState()
    const [showFollower, setShowFollower] = useState()



    // useEffect para traer los usuarios que me siguen y a los que sigo
    useEffect(() => {
        if (reboot) {

            getDataFollow()
            async function getDataFollow() {
                let allUserFollow = []
                let allUserFollower = []
                let getArrayFollow = []

                // Obtener los arrays de ambas tablas
                const getFollow = await getFollowByProperty('userID', userCurrentID)
                const getFollower = await getFollowerByProperty('userID', userCurrentID)

                // Crear condicional por cada tabla para controlar errores si no existe informacion
                // En cada condicional hay una busqueda de seguidores, un map para obtener datos de los usuarios y otro map para mostrar en pantalla dentro del return
                if (getFollow.data.length > 0) {
                    getArrayFollow = await getFollow.data[0].follow.reverse()

                    const followDataUser = await Promise.all( getArrayFollow.map( async (data) => {
                        const getUserFollow = await getUserByID(data)
                        allUserFollow.push(getUserFollow.data)
                    }))

                    const followMap = allUserFollow.map((data) => 
                        <div id="follow-div" key={data._id}>
                            <img src={data.img} />
                            <p id='follow-p' onClick={async () => { navigate(`/user/${data._id}`) }}>{data.username}</p>
                            <input type="button" className="deleteFollow" value="Dejar de seguir" id={data._id} onClick={sweetAlert} />
                        </div>
                    )
                    setShowFollow(followMap)
                    setShow(followMap)
                }


                if (getFollower.data.length > 0) {
                    const getArrayFollower = await getFollower.data[0].follower.reverse()

                    const followerDataUser = await Promise.all( getArrayFollower.map( async (data) => {
                        const getUserFollower = await getUserByID(data)
                        allUserFollower.push(getUserFollower.data)
                    }))
    
                    const followerMap = allUserFollower.map((data) => 
                        <div id="follow-div" key={data._id}>
                            <img src={data.img} />
                            <p id='follow-p' onClick={async () => { navigate(`/user/${data._id}`) }}>{data.username}</p>
                            <input type="button" className={ getArrayFollow.includes(data._id) ? 'deleteFollow' : 'follow' } value={ getArrayFollow.includes(data._id) ? 'Dejar de seguir' : 'Seguir' } id={data._id} onClick={followResolve} />
                        </div>
                    )
                    setShowFollower(followerMap)
                }
            }
            setReboot(false)
        }
    }, [reboot])





    // Funcion para eliminar a un follow
    async function followMinus(e) {
        const id = e.target.id
        const classNameButton = e.target.className

        followAdd(userCurrentID, id, true)
        
        setTimeout(() => {
            setReboot(true)
            setButtonFollow('active')
            setButtonFollower('')
       }, 300);
    }




    // Funcion para comprobar si el usuario ya se esta siguiendo o si es nuevo
    async function followResolve(e) {
        const followState = e.target.value
        const id = e.target.id
        
        if (followState === 'Seguir') {
            followAdd(userCurrentID, id, false)

            setTimeout(() => {
                setReboot(true)
                setButtonFollow('active')
                setButtonFollower('')
           }, 300);

        } else {
            sweetAlert(e)
        }
    }




    // Funcion intermedia para desplegar un aviso al usuario antes de dejar de seguir al otro usuario
    async function sweetAlert(e) {
        const username = document.getElementById('follow-p')
        
        Swal.fire({
            title: 'Confirmar dejar de seguir',
            text: `¿Desea dejar de seguir a ${username.textContent}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dejar de seguir',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                followMinus(e);
                Swal.fire(
                    '¡Hecho!',
                    `Has dejado de seguir a ${username.textContent}`,
                    'success'
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelado',
                    'Tu acción ha sido cancelada :)',
                    'error'
                )
            }
        })
    }
    





    // Funcion para controlar los estilos de los botones y lo que se muestra en pantalla, follow o followers
    async function buttonShow(e) {
        const buttonValue = e.target.value

        if (buttonValue === 'Siguiendo') {
            setShow(showFollow)
            setButtonFollow('active')
            setButtonFollower('')
        } else if (buttonValue === 'Seguidores') {
            setShow(showFollower)
            setButtonFollow('')
            setButtonFollower('active')
        }
    }





    return (
        <>
        
            <div id="followByUser-body">

                <div id="followByUser-buttons">
                    <div id="followByUser-buttons-responsive">
                        <input type="button" value="Siguiendo" id={buttonFollow} onClick={buttonShow} />
                        <input type="button" value="Seguidores" id={buttonFollower} onClick={buttonShow} />
                    </div>
                </div>

                <div id="followByUser-data">
                    <div id="followByUser-data-responsive">
                        {show}
                    </div>
                </div>
               
            </div>
        
        </>
    )
}



export {
    AllFollowByUser
}