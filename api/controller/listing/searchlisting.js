const { errorHandler } = require("../../utils/error");
const conn = require("../../db/conn");

exports.searchListings = async (req, res, next) => {
  const obj = {};

  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = [false, true];
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = [false, true];
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = [false, true];
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = ['sale', 'rent'];
    }else{
      type = [type]
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'listingDate';
    const order = req.query.order || 'desc';

    const query = `
    SELECT * FROM listing
    WHERE name LIKE '%${searchTerm}%' COLLATE utf8mb4_general_ci
    AND offer IN (${offer})
    AND furnished IN (${furnished})
    AND parking IN (${parking})
    AND type in ('${type.join("','")}')
    ORDER BY ${sort} ${order}
    LIMIT ${limit} OFFSET ${startIndex}`;

    conn.query(
      query,
      [],
      (err, result) => {
        if (err) {
          obj.message = 'database query error';
          obj.success = false;
          return next(errorHandler(401, obj.message));
        } else {
          if (result.length === 0) {
            obj.message = 'not any data found for this query';
            obj.success = false;
            return next(errorHandler(401, obj.message));
          }

          obj.message = 'data found successfully';
          obj.success = true;
          obj.data = result;
          res.json(obj);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
