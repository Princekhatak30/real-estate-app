const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn")


exports.fetchlisting = async(req, res, next)=>{
    const obj = {}
     const listingId = req.params.listingId;
     try {
       let query = 'select * from listing where listingId = ?'
     conn.query(query,[listingId],(err,result)=>{
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