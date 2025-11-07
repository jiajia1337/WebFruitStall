const path = require('path')
const fs = require('fs')
const express = require('express')
const session = require('express-session')
const multer = require('multer')

const app = express()
const PORT = process.env.PORT || 3000

// In-memory data
const users = [
	{ email: 'customer@fruitsstore.com', password: 'test', name: 'Valued Customer' }
]
const products = [] // store product metadata (filename, name)

// View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
	session({
		secret: 'fruit-store-secret',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 }
	})
)

// Static
app.use(express.static(path.join(__dirname, 'public')))

// Ensure images folder exists
const imagesDir = path.join(__dirname, 'public', 'images')
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

// Multer for image uploads to public/images
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, imagesDir)
	},
	filename: function (req, file, cb) {
		// preserve original name with timestamp prefix to avoid collisions
		const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`
		cb(null, name)
	}
})
const upload = multer({ storage, fileFilter: function (req, file, cb) {
	// accept images only
	if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false)
	cb(null, true)
}})

// Helpers
function requireAuth(req, res, next) {
	if (req.session && req.session.loggedIn) return next()
	return res.redirect('/')
}

// Make login state and activeTab available in all views
app.use((req, res, next) => {
	res.locals.loggedIn = !!(req.session && req.session.loggedIn)
	res.locals.user = req.session.user || null
	next()
})

// Routes
app.get('/', (req, res) => {
	// landing: login page
	res.render('login', { activeTab: 'login', error: null })
})

app.post('/login', (req, res) => {
	const { email, password } = req.body
	const user = users.find(u => u.email === email && u.password === password)
	if (user) {
		req.session.loggedIn = true
		req.session.user = { email: user.email, name: user.name }
		return res.redirect('/home')
	}
	// invalid credentials: show login with error
	return res.status(401).render('login', { activeTab: 'login', error: 'Invalid credentials' })
})

app.get('/home', requireAuth, (req, res) => {
	res.render('home', { activeTab: 'home' })
})

app.get('/products', requireAuth, (req, res) => {
	// read images from public/images folder
	fs.readdir(imagesDir, (err, files) => {
		const images = (files || []).filter(f => !f.startsWith('.'))
		res.render('products', { activeTab: 'products', images })
	})
})

app.get('/add', requireAuth, (req, res) => {
	res.render('add', { activeTab: 'add' })
})

app.post('/add-product', requireAuth, upload.single('image'), (req, res) => {
	const { name } = req.body
	if (!req.file) {
		return res.status(400).render('add', { activeTab: 'add', error: 'Please upload an image' })
	}
	// store metadata in memory
	products.push({ name: name || req.file.originalname, filename: req.file.filename })
	res.redirect('/products')
})

app.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})

// Start
app.listen(PORT, () => {
	console.log(`Fruit Store app listening on http://localhost:${PORT}`)
})

