const express = require("express");
const router = new express.Router();
const {
    checkAuthenticated,
    checkNotAuthenticated,
    checkIsAdmin,
    checkIsNotAdmin
} = require("../utils/middleware");
const path = require("path");
const connection = require("../utils/dbconnection");

router.get("/", [checkAuthenticated, checkIsNotAdmin], (req, res) => {
    res.render("index", {
        user: req.user
    });
})

const executeSQL = (sql) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(sql, (err, rows) => {
                if (err) {
                    console.log("error", err);
                } else {
                    resolve(rows);
                }
            })
        } catch (e) {
            console.log(e);
            reject();
        }

    })
}

module.exports = router;