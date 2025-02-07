const Url = require("../models/url")
const shortid = require("shortid")

async function generateShortUrl(req,res) {
    const redirectURL = req.body.redirectURL;
    if(!redirectURL){
       return res.status(400).json({error:"oops url is required"})
    }
    const shortId = shortid();
     await Url.create({
        shortId : shortId,
        redirectURL :redirectURL,
        VisitHistory : [],
        owner: req.user._id
     })
     return res.render("home",{id:shortId})
}


async function getUrlById(req,res) {
   try{
      let id = req.params.id
    let tempurl = await Url.findOneAndUpdate({shortId:id} ,{$push:{timestamp:Date.now()}})
    res.redirect(`${tempurl.redirectURL}`)
    }
    catch{
      res.send("oops error occured")
    }
   
}


async function deleteUrl(req,res) {
   
    res.send("deleted success")
}

module.exports = {generateShortUrl,deleteUrl,getUrlById}