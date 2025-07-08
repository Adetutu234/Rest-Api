import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js";
import path from "path"

dotenv.config(); 

const app = express();
const PORT = process.env.PORT
const MY_DATABASE = process.env.MY_DATABASE

app.use(express.json())

mongoose.connect(MY_DATABASE).then(()=>{console.log("Mongoose connected successfully")}).catch((error)=>console.error("Mongoose connection failed"))

// GET :  RETURN ALL USERS 
app.get("/api/users" , async (req,res)=>{
    try{
        const users = await User.find()
        if(!users) return res.status(404).send("user not found")
        res.status(200).send(users)
    }catch (error){ 
        res.status(500).send({Error: error.message})
    }
})

// POST :  ADD A NEW USER TO THE DATABASE 
app.post("/api/users", async (req,res)=>{
    try{
        const newUser = new User(req.body)
        await newUser.save()
        res.status(200).send(newUser)
    }catch(error){
        res.status(500).send({Error: error.message})
    }
})

// // PUT : EDIT A USER BY ID 
app.put("/api/users/:id", async (req,res)=>{
    try{
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } )
        if(!updated) return res.status(400).send(`user not found`)
        res.status(201).send(updated)
    }catch(error){
        res.status(500).send({Error: error.message})
    }
})

// // DELETE user by ID
app.delete("/api/users/:id", async (req,res)=>{
    try{
        const deleted = await User.findByIdAndDelete(req.params.id)
        if(!deleted) return res.status(400).send(`user not found`)
        res.status(201).send(deleted)
    }catch(error){
        res.status(400).send({error: error.message})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})