const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const errorhandling = require('../../utils/error')
const jwt = require('jsonwebtoken')




exports.signin = (req,res, next)=>{
    
    
    let obj = {}
    try {
        const {email,password} = req.body
        let query = 'select * from user where email = ?';
        conn.query(query,[email] , async(err,result)=>{
            if(err){
                obj.message = 'database query error'
                res.json(obj)
               
            }
            if(result.length === 0){
                obj.message= 'User not found for this email'
                obj.success = false
                res.json(obj)
            }
            const user = result[0]
            const passwordMatch = await bcryptjs.compare(password,user.password)
            if(!passwordMatch){
                obj.message = 'Wrong credential'
                message = obj.message
                obj.success = false
                res.json(obj)
            }else{
                    const data = {
                        user: {
                            createdAt:user.date,
                           userid:user.userId,
                           username:user.username,
                            email:user. email,
                            password:user.password,
                            avatar:user.avatar,
                            access_token:user.access_token
                        }
                    }
                    obj.message = 'data found for this user successfully'
                    obj.success = true
                    const jwtData = jwt.sign({id:user.userid},process.env.JWT_SECRET);
                    res.cookie('access_token',jwtData,{httpOnly: true})
                    obj.data = data
                      res.json(obj)
            }
        
           
        })
        
    } catch (error) {
        next(error)    }
}