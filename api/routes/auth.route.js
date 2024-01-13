const express = require("express")
 const router = express.Router()
 const Signup = require('../controller/usercontroller/auth.controller')
 const signin = require('../controller/usercontroller/signin.controller')
 const Googlesignin = require('../controller/usercontroller/googlesignin')
 const Signout = require('../controller/usercontroller/signout')


 router.post("/api/auth/signup",Signup.signup)
 router.post("/api/auth/signin",signin.signin)
 router.post("/api/auth/google",Googlesignin.google)
 router.get("/api/auth/signout",Signout.signout)


 module.exports = router;
