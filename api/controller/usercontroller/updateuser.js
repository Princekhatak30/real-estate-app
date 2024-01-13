const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../../utils/error');



exports.userupdate = async (req, res, next) => {
    let obj = {}
    try {
        const userId = req.params.userId
        const { username, email, password, avatar } = req.body;


        let hashedPassword = null;

        if (password) {
            hashedPassword = bcryptjs.hashSync(password, 10);
        }
        // Fetch the existing user data from the database
        conn.query('SELECT * FROM user WHERE userid = ?', [userId], (err, userData) => {
            if (err) {
                obj.message = 'Error fetching existing user data';
                obj.success = false;
                return res.json(obj);
            }

            if (userData.affectedRows === 0) {
                obj.message = ' You can only update your own account'
                return next(errorHandler(401, obj.message))
            }
            const existingData = userData[0];

            // Check if the fields are provided in the request body; if not, retain the existing data
            const updatedUsername = username || existingData.username;
            const updatedEmail = email || existingData.email;
            const updatedPassword = hashedPassword || existingData.password; // If password is not provided, retain the existing hashed password
            const updatedAvatar = avatar || existingData.avatar;


            let query = `UPDATE user
        SET username = ?, email = ?, password = ?, avatar = ?, date = now()
        WHERE userid = ?;`
            conn.query(query, [updatedUsername, updatedEmail, updatedPassword, updatedAvatar, userId], (err, result) => {
                if (err) {

                    obj.message = 'database query error', err,
                        obj.success = false,
                        res.json(obj)
                } else {
                    if(result.length === 0){
                        obj.message = ' You can only update your own account'
                return next(errorHandler(401, obj.message))
                    }
                    
                    
                    const data = {
                        user: {
                            userid: userId,
                            username: updatedUsername,
                            email: updatedEmail,
                            avatar: updatedAvatar,
                            password: updatedPassword
                        }
                    }

                    obj.message = 'user data updated successfully',
                        obj.success = true,
                        obj.data = result,
                        obj.data = data
                    res.json(obj)
                }
            })
        })
    } catch (error) {
        next(error)
    }

}