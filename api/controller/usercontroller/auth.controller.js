const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const errorhandling = require('../../utils/error')

exports.signup = async (req,res, next)=>{
    const { username, email, password, date} = req.body;


    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);

        let obj = {}
        let query = `insert into user (username, email, password, date) value (?,?,?,now())`;
        if (!username || !email || !password || date) {
            obj.message = ' all fields all require'
            obj.success = false
            res.json(obj)
        }
        conn.query(query, [username, email, hashedPassword,date],(err,result)=>{
            if(err){
                obj.message = 'database query error'
                obj.success = false
                return next(errorhandling.errorHandler(500, err.message));
            }else{
                const userid = result.userId;
                const data = {
                    user: {
                       userid:userid,
                        username: username,
                        email: email,
                        
                    }
                }
                obj.message = 'data added successfully'
                obj.success = true
                obj.data = data
                res.status(200).json(obj);
            }
        })
        
    } catch (error) {
        next(error)
    }
}