
const conn = require("../../db/conn")
const { errorHandler } = require('../../utils/error');


exports.creatListing = async (req, res, next) => {
    const obj = {}
    
    try {
        const {
            name,
            address,
            bedrooms,
            description ,
            regularPrice,
            discountedPrice,
            bathrooms,
            furnished,
            parking,
            type,
            offer,
            imagesUrls,
            userRef,
        } = req.body;

        const query = `INSERT INTO listing (name, address,bedrooms, description, regularPrice, discountedPrice, bathrooms, furnished, parking, type, offer, imagesUrls, userRef, listingDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, NOW())`
        const values = [
            name,
            address,
            bedrooms,
            description,
            regularPrice,
            discountedPrice,
            bathrooms,
            furnished,
            parking,
            type,
            offer,
            JSON.stringify(imagesUrls),
            userRef,
        ];
        console.log('Query:', query);
        console.log('Values:', values);
        conn.query(query, values, (err, result) => {
            if (err) {
                obj.message = "data base query error"
                return next(errorHandler(500, err.message));
            }

            const listingid  = result.insertId
            const newListing =
            {
                listingid,
                name,
                address,
                description,
                regularPrice,
                discountedPrice,
                bathrooms,
                furnished,
                parking,
                type,
                offer,
                imagesUrls,
                userRef,
                listingDate: new Date()
            };
            obj.message = 'listing created successfully'
                obj.success = true
                obj.new = true
                obj.data = newListing
            return res.status(201).json(obj);
        });
    } catch (error) {
        next(error)
    }

}