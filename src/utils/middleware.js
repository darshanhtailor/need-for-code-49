function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function checkIsAdmin(req, res, next) {
    if (req.user.status === "admin") {
        return next();
    } else {
        res.redirect("/");
    }
}

function checkIsNotAdmin(req, res, next) {
    if (req.user.status !== "admin") {
        return next();
    } else {
        res.redirect("/admin-dashboard");
    }
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkIsAdmin,
    checkIsNotAdmin
}