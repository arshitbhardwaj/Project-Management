const express = require("express")
const router = express.Router()
const Project = require("../models/project")

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in")
    return res.redirect("/login")
  }
  next()
}

// GET all projects
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const projects = await Project.find({})
    res.render("projects/index", { projects })
  } catch (e) {
    req.flash("error", "Error fetching projects")
    res.redirect("/")
  }
})

// GET new project form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("projects/new")
})

// POST create new project
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const project = new Project(req.body.project)
    project.creator = req.user._id
    await project.save()
    req.flash("success", "Successfully created new project!")
    res.redirect(`/projects/${project._id}`)
  } catch (e) {
    req.flash("error", "Error creating project")
    res.redirect("/projects/new")
  }
})

// GET show project
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("creator")
    if (!project) {
      req.flash("error", "Project not found")
      return res.redirect("/projects")
    }
    res.render("projects/show", { project })
  } catch (e) {
    req.flash("error", "Error finding project")
    res.redirect("/projects")
  }
})

// GET edit project form
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      req.flash("error", "Project not found")
      return res.redirect("/projects")
    }
    res.render("projects/edit", { project })
  } catch (e) {
    req.flash("error", "Error finding project")
    res.redirect("/projects")
  }
})

// PUT update project
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params
    // Ensure projectName is not modified
    const existingProject = await Project.findById(id)
    req.body.project.projectName = existingProject.projectName

    const project = await Project.findByIdAndUpdate(id, { ...req.body.project })
    req.flash("success", "Successfully updated project!")
    res.redirect(`/projects/${project._id}`)
  } catch (e) {
    req.flash("error", "Error updating project")
    res.redirect("/projects")
  }
})

// DELETE project
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    req.flash("success", "Successfully deleted project")
    res.redirect("/projects")
  } catch (e) {
    req.flash("error", "Error deleting project")
    res.redirect("/projects")
  }
})

module.exports = router
