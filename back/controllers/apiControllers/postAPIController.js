import express from "express";
import cors from "cors"
import dotenv from 'dotenv';
import postController from "../controllers/postController.js";

dotenv.config();
const app = express();
app.use(cors())


const getAllScroll = async(req,res)=>{
    try {
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 15

        const propiedad = await postController.getAll()

        const paginatedMessages = propiedad.reverse().slice(skip, skip + limit)

        res.json({ data: paginatedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




const getAll = async(req,res)=>{
    const propiedad = await postController.getAll();
    res.json({data:propiedad})
}


const getById = async (req,res) =>{
    const id = req.params.id
    const propiedad = await postController.getById(id);
    res.json({data:propiedad});
}

const getByProperty=async(req,res)=>{
    const {property,value}=req.body;
    const propiedad = await postController.getByProperty(property,value);
    res.json({data:propiedad})
}

const create = async(req,res)=>{
    const propiedad = await postController.create(req.body);
    res.json({data:propiedad})
}


const update = async(req,res)=>{
    const id = req.params.id;
    const propiedad = await postController.update(id,req.body);
    res.json({data:propiedad})
}

const remove = async(req,res)=>{
    const id = req.params.id;
    const propiedad = await postController.remove(id);
    res.json({data:propiedad})
}

export default{
    getAll,
    getAllScroll,
    getById,
    getByProperty,
    create,
    update,
    remove
}