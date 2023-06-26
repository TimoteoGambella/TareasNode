const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")

require("dotenv").config()

const password=process.env.PassDatabase // FALTA PASSWORD => CONTACTARSE CONMIGO PARA RECIBIRLA
const dbname="todos"

const uri = `mongodb+srv://Timoteo:${password}@cluster0.cbjdwvt.mongodb.net/${dbname}?retryWrites=true&w=majority`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.use(cors({
    origin:"*",
}))

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})

const connection= mongoose.connection

connection.once("open", ()=>{
    console.log("Conexion a la BD exitosa...")
})
connection.on("error", (error)=>{
    console.log("Error en la conexion a la BD:",error)
})

const Todo=mongoose.model("Todo",{
    text:String,
    completed:Boolean
})

app.get("/", (req,res)=>{
    res.send("BIENVENIDOS A LA API")
})

app.post("/add",(req,res)=>{
    const todo = new Todo({
        text: req.body.text,
        completed:false
    })
    todo.save().then(doc=>{
        console.log("Data insertado correctamente", doc)
        res.json({response:"success"})
    })
    .catch(err=>{
        console.log("Error al insertar", err.message)
        res.status(400).json({response:"failed"})
    })
})


app.get("/getall",(req,res)=>{
    Todo.find({},"text completed").then(doc=>{
        res.json({response:"success",data:doc})
    })
    .catch(err=>{
        console.log("ERROR:",err.message)
        res.status(400).json({response:"failed"})
    })
})


app.get("/completed/:id/:status",(req,res)=>{console.log("HOLA")
    const id = req.params.id
    const status = req.params.status === "true"
    Todo.findByIdAndUpdate({_id:id},{$set: {completed: status}}).then(doc=>{
        res.json({response:"success"})
    })
    .catch(err=>{
        console.log(err.message)
        res.status(400).json({response:"failed"})
    })
})
app.get("/delete/:id",(req,res)=>{console.log("HOLA")
    const id = req.params.id

    Todo.findByIdAndDelete({_id:id}).then(doc=>{
        res.json({response:"success"})
    })
    .catch(err=>{
        console.log("Error al eliminar dato",err.message)
        res.status(400).json({response:"failed"})
    })
})


app.listen(3000, ()=>{
    console.log("Servidor listo")
})