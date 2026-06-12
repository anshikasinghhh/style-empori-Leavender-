exports.adminOnly = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access only"
        });
    }

    next();
};
// const express = require("express");
// const router = express.Router();

// const User = require("../models/User");

// const { protect } = require("../middleware/auth");
// const { adminOnly } = require("../middleware/admin");

// router.get(
//   "/users",
//   protect,
//   adminOnly,
//   async (req,res)=>{

//     const users = await User.find();

//     res.json(users);

//   }
// );

// module.exports = router;