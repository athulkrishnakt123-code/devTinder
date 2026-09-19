const authAdmin = (req,res,next) => {

    const token = "xyz";
    const isAuthorizedAdmin = token === "xyz";

    console.log("authAdmin is checked!!");

    if(!isAuthorizedAdmin) {
        res.status(401).send("unauthorized request")
    }
    else{
        next();
    }
};

module.exports = {
    authAdmin
}