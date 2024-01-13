const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn")



exports.deleteListing = async(req, res, next)=>{
    const obj = {}
    const listingId = req.params.listingId
    const userRef = req.user.id;
      
      try {
        let query = `  DELETE from listing  WHERE   listingId = ? AND userRef = ?`
      conn.query(query ,[listingId,userRef],  (err,result)=>{
  if(err){
      obj.message = 'database query error'
      obj.success = false
      res.json(obj)
  
  }else{
    if(result.affectedRows === 0 ){
        return next(errorHandler(404, 'Listing not found'))
    }
     
      obj.message = 'Data deleted successfully'
      obj.success =true
      obj.data = result
      res.json(obj)
  }
      })
      } catch (error) {
        next(error)
      }
}