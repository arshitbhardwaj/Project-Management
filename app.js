const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const methodOverride = require("method-override")
const flash = require("connect-flash")
const User = require("./models/user")

// Initialize Express app
const app = express()

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/project-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Configure Express
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(flash())

// Configure sessions
app.use(
  session({
    secret: "project-management-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
)

// Configure Passport
app.use(passport.initialize())
app.use(passport.session())

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to pass user to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

// Import routes
const userRoutes = require("./routes/user")
const projectRoutes = require("./routes/project")

// Use routes
app.use("/", userRoutes)
app.use("/projects", projectRoutes)

// Home route
app.get("/", (req, res) => {
  res.redirect("/projects")
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
