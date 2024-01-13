const express = require('express')
const conn = require("../../db/conn")


exports.test=(req,res)=>{
res.json({message:"hello word"})
}

