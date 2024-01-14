const express = require('express');
const userRouter = require("./routes/user.route")
const cookieParser = require('cookie-parser')

const authRouter = require("./routes/auth.route")
const listingRouter = require('./routes/listing.route')
const path = require ('path')
const app = express()


const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())
const port = 3000

app.use(userRouter)
app.use(authRouter)
app.use(listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res)=>{
   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html') )
})


app.listen(port , () => {
   console.log( `Server is running  on port ${port}`);
})

//middelware function 

app.use((err, req, res, next)=>{
   const statusCode = err.statusCode || 500;
   const message = err.message || ' Internal server error';
   return res.status(statusCode).json({
      success:false,
      statusCode,
      message
   })
})
