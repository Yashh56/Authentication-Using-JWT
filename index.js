const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const MongoURL = 'mongodb+srv://Zoro11:zoro11@cluster0.tzkokwz.mongodb.net/?retryWrites=true&w=majority'

// Import Routes
const AuthRoute = require('./routes/Auth');
const postsRoute = require('./routes/posts');


mongoose.connect(MongoURL).then(() => console.log("MongoDB Connected")).catch(err => console.log(err))
// Connect to DB
// const mongoconnect = async ()=> {try {
//     mongoose.set("strictQuery", false)
//      await mongoose.connect(process.env.DB_CONNECT)
//     console.log("MongoDB Connected");
// } catch (error) {
//     console.log("Error");
// }}

// mongoconnect()

// MiddleWares
app.use(express.json())


// Route MiddleWares
app.use('/api/user', AuthRoute);
app.use('/api/posts', postsRoute);


app.listen(3000, () => console.log("Server is Running On Port 3000"))