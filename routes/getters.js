const express = require('express')
const router = express()
const isAuth = require('./isAuth')


router.get('/', (req,res) =>{
    req.session.destroy((err) =>{
        if (err) {
            console.log(err)
        }
        res.clearCookie('connect.sid')
    res.render('index.ejs')

    })
})


router.get('/dev',  (req, res) =>{
    // const {id,name,phone,password,department} = req.session.user
    res.render('aboutdev.ejs')
})

router.get('/login-signup', (req,res) =>{
    res.render('loginsignup.ejs', {msg: ''})
})


router.get('/chatbot',isAuth, (req,res)=>{
    const username = req.session.user.name
    res.render('chatbot.ejs',{username})
})


// router.get('/contribute', (req,res)=>{
//     res.render('contribute.ejs')
// })

router.get('/dashboard',isAuth, (req,res)=>{
    const username = req.session.user.name
    res.render('dashboard.ejs',{username})
})

router.get('/profile',isAuth, (req,res)=>{
    const {name,email,phone,department,faculty,gender,dob,level,pic,mimetype,buffer} = req.session.user
    const DateObj = new Date(dob)
    const formattedDate = DateObj.toISOString().slice(0, 10)
    res.render('editprofile.ejs',{name,email,phone,department,faculty,gender,level,dob: formattedDate,pic,mimetype,buffer})
})

router.get('/pastquestions', isAuth, (req,res)=>{
    res.render('pastquestions.ejs')
})




router.get('/quiz', isAuth, (req,res)=>{
    const name = req.session.user.name
    res.render('quiz.ejs',{name})
})


router.get('/reviews', isAuth, (req,res) =>{
    res.render('review.ejs')
})

router.get('/writeReview',isAuth, (req,res) =>{
    res.render('writeReview.ejs')
})

router.get('/userList', isAuth, (req,res) =>{
    res.redirect('/u_dev')
})


router.get('/notloggedin', (req,res) =>{
    res.render('notloggedin.ejs')
})

router.get('/u_dev', isAuth, (req,res) =>{
    res.render('u_dev.ejs')
})









// router.get('/logout', (req,res) =>{
//     req.session.destroy((err) =>{
//         if (err) {
//             return err
//         }
//         res.clearCookie('connect.sid')

//         res.redirect('/')
//     })
// })

// authentication needed
 
// router.get('/userprofile',isAuth ,(req,res) =>{
//     const {id,name,email,phone,password,department,faculty,gender,level,pic} = req.session.user

//     res.render('userprofile.ejs',{name,email,phone,password,department,faculty,gender,level,pic,errormsg: null})
// })

// router.get('/edit', isAuth,  (req, res)=>{
//     const {name,faculty,department,level,gender,pic,email} = req.session.user
//     res.render('editinfo.ejs',{errormsg: '',name,faculty,department,level,gender,pic,email})
// })
// router.get('/profile_pic_view', isAuth,  (req, res)=>{
//     const {name,email,pic} = req.session.user
//     res.render('profilepicview.ejs',{errormsg: '',name,email,pic})
// })
// router.get('/profile_pic_edit', isAuth,  (req, res)=>{
//     const {name,email} = req.session.user
//     res.render('profilepicedit.ejs',{errormsg: '',name,email})
// })


module.exports = router