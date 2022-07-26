const express = require("express");
const upload = require("express-fileupload");
const router = new express.Router();
const path = require("path");
const {v4: uuidv4} = require("uuid");
router.use(upload());
const {
    checkAuthenticated,
    checkNotAuthenticated,
    checkIsAdmin,
    checkIsNotAdmin
} = require("../utils/middleware");
const connection = require("../utils/dbconnection");

router.get("/admin-dashboard", [checkAuthenticated, checkIsAdmin], (req, res) => {
    res.render("admin-dashboard");
})

module.exports = router;