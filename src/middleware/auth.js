

const authUser = (req,res,next) => {

    const token = "xyz";
    const isAuthorizedUser = token === "xyz";

    console.log("authUser is checked!!");

    if(!isAuthorizedUser) {
        res.status(401).send("unauthorized request")
    }
    else{
        next();
    }
};


module.exports = {
    authUser
}