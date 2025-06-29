const isAuth = (req,res,next) =>{
    if (req.session.authenticated) {
        next()
    }else{
        res.redirect('/notloggedin')
    }
}


module.exports = isAuth;