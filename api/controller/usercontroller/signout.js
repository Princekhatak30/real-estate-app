const express = require('express');
const bcryptjs = require("bcryptjs")

const conn = require("../../db/conn")
const { errorHandler } = require('../../utils/error');
const jwt = require('jsonwebtoken')


exports.signout = async (req, res, next)=> {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been loggen out!')
    } catch (error) {
     next(error)   
    }
}