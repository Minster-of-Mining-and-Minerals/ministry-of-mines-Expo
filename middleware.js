module.exports.isLoggedIn = (req,res,next) => {
    console.log("Req.user:", req.user);
    console.log("Req.originalUrl:", req.originalUrl);
    console.log(req.isAuthenticated())
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        // req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next();
}

module.exports.saveURL = (req,res,next) => {
    console.log("Saving current URL..")
    console.log("req.originalUrl:",req.originalUrl);
    console.log("req.session.returnTo:",req.session.returnTo);
    req.session.returnTo = req.originalUrl;
    // req.flash('error', 'You must be signed in first!')
    
    
    next();
}