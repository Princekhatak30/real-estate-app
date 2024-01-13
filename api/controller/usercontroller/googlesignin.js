const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const errorhandling = require('../../utils/error')
const jwt = require('jsonwebtoken')




exports.google = (req, res, next) => {

    let obj = {}
    try {
        const { email, password } = req.body
        let query = 'select * from user where email = ?';
        conn.query(query, [email], async (err, result) => {
            if (err) {
                obj.message = 'database query error'
                res.json(obj)
            }
             if(result.length === 0) {
                // user not found, create a new user

                const generetedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
                const hashedPassword = bcryptjs.hashSync(generetedPassword, 10)
                 // Add a creation date to the newUser object
        const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

                const newUser = {
                    username:
                        req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                    email: req.body.email,
                    password: hashedPassword,
                    avatar: req.body.photo,
                    date: currentDate,
                }

                // Save the new user to the database
                conn.query('insert into user set ?', newUser, async (err, result) => {
                    if (err) {
                        obj.message = 'Error creating a new user'
                        res.json(obj)
                    } else {
                        const token = jwt.sign({ id: newUser.userId }, process.env.JWT_SECRET)
                        const { password: pass, ...rest } = newUser
                        obj.message = 'New user created successfullu'
                        obj.success = true;
                        obj.data = { user: rest }

                        res.cookie('access_token', token, { httpOnly: true })
                    }
                })
            } 
            else{
                const user = result[0]
                const data = {
                    user: {
                        createdAt:user.date,
                       userid:user.userId,
                       username:user.username,
                        email:user. email,
                        avatar:user.avatar
                    }
                }
                obj.message = 'data found for this user successfully'
                obj.success = true
                const jwtData = jwt.sign({id:user.userId},process.env.JWT_SECRET);
                res.cookie('access_token',jwtData,{httpOnly: true})
                obj.data = data
                  res.json(obj)
        }
        })


    } catch (error) {
        next(error)
    }
}