import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/',(req,res) =>{
    res.send("HELLO WORLD")
})



app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`);
})


