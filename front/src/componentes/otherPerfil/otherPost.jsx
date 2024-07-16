import React from "react";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { dateFormat } from '../../funciones/fecha.js'
import { getPostByProperty } from "../../api/postAPI";
import { responseCreate } from '../../api/responseAPI.js'
import { getUserByID } from "../../api/userAPI";

import '../../saas/otherPerfil/otherPost.scss'


function OtherPost({id}) {
    const [data, setData] = useState()

    const userID = Cookies.get('id')


    useEffect(() => {
        otherPost(id)
        async function otherPost(id) {
            let getPostByUserID = await getPostByProperty('userID', id)
            getPostByUserID = getPostByUserID.data.reverse()

            const getPostMap = await getPostByUserID.map((data) => 
                <div key={data._id} id="getPost-div">
                    <p id='getPost-date'>{data.dateString}</p>
                    <p id='getPost-post'>{data.post}</p>
                    <div id="getPost-buttons">
                        <input type="button" value="Responder" id={data._id} onClick={responsePost} />
                        <input type="button" value="Ver respuestas" id={data._id} />
                    </div>
                </div>
            )
            setData(getPostMap)
        }
    }, [])



    async function responsePost(e) {
        const postID = e.target.id

        const userData = await getUserByID(userID)
        const username = userData.data.username

        const responseArray = {'postID': postID,
                                'username': username,
                                'dateString': dateFormat(Date.now())
        }
    }
    


    return (

        <>
        
            <div id="otherPost-body">
                {data}
            </div>
        
        </>

    )
}


export {
    OtherPost
}