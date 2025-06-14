const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserControllers");

// Example route for getting all users
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUser);

// export the router
module.exports = router;