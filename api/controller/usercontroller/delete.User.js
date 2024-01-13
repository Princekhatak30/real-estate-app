const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const { errorHandler } = require('../../utils/error');
const jwt = require('jsonwebtoken')


exports.deleteuser = async (req, res, next) => {
    obj = {}
    const userId = req.params.userId

    try {

        let query = `  DELETE from user  WHERE   userId = ? `
        conn.query(query, [userId], (err, result) => {
            if (err) {
                obj.message = 'database query error'
                obj.success = false
                res.json(obj)
            } else {

                if (result.affectedRows === 0) {
                    obj.message = ' You can only update your own account'
                    return next(errorHandler(401, obj.message))
                }
                res.clearCookie('access_token')
                obj.message = 'User has been deleted '
                obj.success = true
                obj.data = result
                res.json(obj)
            }
        })
    } catch (error) {
        next(error)
    }
}