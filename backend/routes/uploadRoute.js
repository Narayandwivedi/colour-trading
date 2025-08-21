const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")

const upload = require("../config/multer")

const { handleChatFileUpload } = require("../controllers/uploadController")

// User authenticated routes
router.post("/chat", auth, upload.single("chatFile"), handleChatFileUpload)

module.exports = router