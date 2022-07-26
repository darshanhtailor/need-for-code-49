if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser') //--> added
const mongoose = require('mongoose')
const User = require('./models/user')

const mongoURI = 'mongodb://127.0.0.1:27017/school-space'
mongoose.connect(mongoURI)

const initializePassport = require('./passport-config')
initializePassport(passport, email => User.findOne({ email }), user_id => User.findOne({ user_id }))

app.use(cookieParser('thisIsASecret')) //--> added
app.use(express.json()) //-->added
app.use(express.urlencoded({ extended: false }))
app.use(flash())

app.use(session({
	secret: 'thisIsASecret',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/user', checkAuthenticated, (req, res) => {
	res.send(req.user)
})

app.get('/login-failed', checkNotAuthenticated, (req, res) => {
	res.status(500).send({ message: 'Login Failed' })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/user',
	failureRedirect: '/failed',
	failureFlash: true
}))

app.post('/add-teacher', checkNotAuthenticated, async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const user = new User({ 
			user_id: Date.now().toString(),
			name: req.body.name, 
			email: req.body.email, 
			password: hashedPassword,
			userType: 'teacher'
		})
		await user.save()
	} catch(error) {
		throw error
	}
})

app.delete('/logout', (req, res) => {
	req.logOut()
})

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

app.listen(3000, () => {
	console.log('server started at port 3000')
})