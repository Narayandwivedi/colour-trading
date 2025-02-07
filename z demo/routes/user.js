const express = require("express")
const router = express.Router();
const User = require("../models/user")

const {getAllUsers, createNewUser, getUserById , updateUserById ,  deleteUserById} = require("../controllers/user")



router.get("/", getAllUsers);

router.post("/", createNewUser);


  //**********/ crud for individual user

  // get request

  router.get("/:id", getUserById)

  // put request - update

  router.put("/:id",updateUserById)

  // delete request

  router.delete("/:id", deleteUserById);


  module.exports = router;
