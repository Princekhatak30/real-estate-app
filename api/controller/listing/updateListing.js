const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn")


exports.updateLisitng = async (req, res, next) => {
    const obj = {}
    const listingId = req.params.listingId

    try {
        const {
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
            userRef,
            imagesUrls,
        } = req.body;

        conn.query('select * from listing where userRef = ? and listingId = ?', [userRef, listingId], (err, userData) => {
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
            const updatedName = name || existingData.name;
            const updatedaddress = address || existingData.address;
            const updatedbedrooms = bedrooms || existingData.bedrooms;
            const updateddescription = description || existingData.description;
            const updatedregularPrice = regularPrice || existingData.regularPrice;
            const updateddiscountedPrice = discountedPrice || existingData.discountedPrice;
            const updatedbathrooms = bathrooms || existingData.bathrooms;
            const updatedfurnished = furnished === false ? 0 : 1 || existingData.furnished;
            const updatedparking = parking === false ? 0 : 1 || existingData.parking;
            const updatedtype = type || existingData.type;
            const updatedoffer = offer === false ? 0 : 1 || existingData.offer;
            const updatedimagesUrls = imagesUrls || existingData.imagesUrls;



            let query = `  UPDATE listing SET  name = ?,
        address = ?,
        bedrooms = ?,
        description = ?,
        regularPrice = ?,
        discountedPrice = ?,
        bathrooms = ?,
        furnished = ?,
        parking = ?,
        type = ?,
        offer = ?,
        imagesUrls = ?,
        listingDate = NOW()
      WHERE
        listingId = ? AND userRef = ?`
            const values = [
                updatedName,
                updatedaddress,
                updatedbedrooms,
                updateddescription,
                updatedregularPrice,
                updateddiscountedPrice,
                updatedbathrooms,
                updatedfurnished,
                updatedparking,
                updatedtype,
                updatedoffer,
                JSON.stringify(updatedimagesUrls),
              
                listingId,
                userRef,
               
            ];
            conn.query(query, values, (err, result) => {
                if (err) {
                    obj.message = 'database query error'
                    obj.success = false
                    res.json(obj)

                } else {

                    if (!listingId) {
                        return next(errorHandler(404, 'no any listing found '));
                    }
                    if (result.affectedRows === 0) {
                        return next(errorHandler(500, 'data updation failed'));
                    }

                   
                    const newListing =
                    {
                        listingId,
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
                        imagesUrls,
                        userRef,
                        listingDate: new Date()
                    };



                    obj.message = 'Data updated successfully'
                    obj.success = true
                    obj.new = true
                    obj.data = newListing
                    return res.status(201).json(obj);
                }
            })
        })
    } catch (error) {
next(error)
    }
}