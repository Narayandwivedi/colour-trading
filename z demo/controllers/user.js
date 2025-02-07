const User = require("../models/user")



//  get all user

async function getAllUsers(req,res){
    
    const allUsers = await User.find();
    res.send(allUsers)

}


// create user


async function createNewUser(req,res) {

    try{
        const user = new User(req.body);
       const savedUser =  await user.save();
       return res.status(201).send(savedUser)
      }
      catch(err){
        res.send(`got a error sorry ${err}`)
        console.log("oops got a error ", err);
      }
}



// get individual user

async function getUserById(req,res){
    try{
        let {id} = req.params
      const user = await User.findById(id)
      res.send(
        `
            <ul style = " list-style: none;">
            <li> ${user.first_name} ${user.last_name} </li>
            <li> ${user.gender}  </li>
            <li> ${user.Job_title}  </li>
            
            </ul>
            `
      );
      }
      catch{
        return res.send("oops got a error")
      }
}


//  update user


async function updateUserById(req,res) {
    const {id} = req.params
    const body = req.body
    const updatedUser = await User.findByIdAndUpdate(id,{name:body.name})
}


// delete user

async function deleteUserById(req,res) {

    id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id)
    console.log(deletedUser);
    
    res.send("user deleted successfully")
    
}

module.exports = {getAllUsers ,createNewUser, getUserById , updateUserById , deleteUserById}