const express = require("express");
const router = express.Router();
const Url = require("../models/url")
const {checkLoggedIn} = require("../middleware/auth");

const {generateShortUrl,deleteUrl,getUrlById} = require("../controllers/url")

router.get("/",checkLoggedIn,async(req,res)=>{
  //   let allUrl = await Url.find({owner:req.user._id})
  // res.render("home.ejs",{Urls:allUrl})
  res.send("url route is under manitenence")
})

router.get("/:id",getUrlById)
router.post("/",generateShortUrl)
router.delete("/",deleteUrl)

module.exports = router