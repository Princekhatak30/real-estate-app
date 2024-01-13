const express = require('express')
const CreateListing = require('../controller/listing/listing.controller')
const { verifyToken } = require('../utils/verifyUser')
const GetLisitng = require('../controller/listing/getlisting.controller')
const DeleteLisitng = require('../controller/listing/deleteListing')
const updateLisitng = require('../controller/listing/updateListing')
const Fetchlisting = require('../controller/listing/fetchlisting')
const Searchlisting = require('../controller/listing/searchlisting')


const router = express.Router()



router.post('/api/listing/create',verifyToken , CreateListing.creatListing)
router.get('/api/getListing/:userId',verifyToken ,GetLisitng.getlisting )
router.delete('/api/deleteListing/:listingId',verifyToken ,DeleteLisitng.deleteListing)
router.put('/api/updateListing/:listingId',verifyToken ,updateLisitng.updateLisitng)
router.get('/api/get/:listingId',Fetchlisting.fetchlisting)
router.get('/api/searchListing',Searchlisting.searchListings)

module.exports = router;