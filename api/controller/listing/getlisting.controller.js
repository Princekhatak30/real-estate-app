const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn")





exports.getlisting= async (req, res, next)=>{
    const obj = {}
     const userRef = req.params.userId;
     try {
       let query = 'select * from listing where userRef = ?'
     conn.query(query,[userRef],(err,result)=>{
        if(err){
            obj.message = 'database query error'
            obj.success = false
           return next(errorHandler(401, obj.message))
        }else{
            
                if (result.length === 0) {
                    obj.message = 'No any listing found';
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