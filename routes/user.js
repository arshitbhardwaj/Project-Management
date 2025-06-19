const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user")

// Register form
router.get("/register", (req, res) => {
  res.render("register")
})

// Register logic
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, fullName, profession } = req.body
    const user = new User({ username, fullName, profession })

    const registeredUser = await User.register(user, password)

    req.login(registeredUser, (err) => {
      if (err) return next(err)
      req.flash("success", "Welcome to Project Management!")
      res.redirect("/projects")
    })
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
})

// Login form
router.get("/login", (req, res) => {
  res.render("login")
})

// Login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!")
    res.redirect("/projects")
  },
)

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash("success", "Goodbye!")
    res.redirect("/login")
  })
})

module.exports = router
