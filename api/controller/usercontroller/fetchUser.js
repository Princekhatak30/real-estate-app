const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn")


exports.fetchUser= async (req, res, next)=>{
    const obj = {}
     const userId = req.params.userId;
     try {
       let query = 'select * from user where userId = ?'
     conn.query(query,[userId],(err,result)=>{
        if(err){
            obj.message = 'database query error'
            obj.success = false
           return next(errorHandler(401, obj.message))
        }else{
            
                if (result.length === 0) {
                    obj.message = 'No any user found';
                    obj.success = false;
                    return next(errorHandler(401, obj.message))
                }else{

                    obj.message = 'data found successfully '
                    obj.success = true
                    obj.data = result
                    res.json(obj)
                }
        }
     }) 
     } catch (error) {
        next(error)
     }
}