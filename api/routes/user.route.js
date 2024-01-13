const express = require('express')
const router = new express.Router()
const Test = require("../controller/usercontroller/user.controller")
const UpdateUser = require('../controller/usercontroller/updateuser')
const DeleteUser = require('../controller/usercontroller/delete.User')
const FetchUser = require('../controller/usercontroller/fetchUser')
const { verifyToken } = require('../utils/verifyUser')

router.get('/api/user/test',Test.test )
router.post('/api/user/update/:userId', verifyToken, UpdateUser.userupdate )
router.delete('/api/user/delete/:userId', verifyToken, DeleteUser.deleteuser )
router.get('/api/user/fetch/:userId', verifyToken,FetchUser.fetchUser  )



module.exports = router;