// variable declarations
const { body } = require('express-validator'),
     isAuth = require('./routes/isAuth'),
     { fileLoader } = require('ejs'),
     { GoogleGenerativeAI } = require('@google/generative-ai'),
     genAI = new GoogleGenerativeAI('AIzaSyCyKI5TE59sAHUdiJaGocOCnsyHNBRW3S0'),
     express = require('express'),
     app = express(),
     dotenv = require('dotenv'),
     getRequests = require('./routes/getters'),
     multer = require('multer'),
     storage = multer.memoryStorage({}),
     upload = multer({storage}),
     bodyParser = require('body-parser'),
     session = require('express-session'),
     multe = require('multer'),
     parser = bodyParser.urlencoded({extended: false}),
     mongoose = require('mongoose'),
     schema = mongoose.Schema,
     userSchema = new schema({
        name: {type: String,required: true},
        email:{type: String, required: true},
        phone:{type: String, required: true},
        department:{type: String, required: true},
        faculty:{type: String, required: true},
        dob:{type: Date, required: true},
        gender:{type: String, required: true},
        level:{type: String, required: true},
        password:{type: String, required: true},
        profilepic_name:{type: String, required: false},
        mimetype:{type: String, required: false},
        profilepic:{type: Buffer, required: false},
        communityPosts: {type: Number, required: false}
     },{timestamps: true}),
     postSchema = new schema({
        title: {type: String,required: true},
        category: {type: String, required: true},
        content: {type: String, required: true},
        files: [{
            file: {type: Buffer,required: false},
            file_mimetype: {type:String,required: false},
        }],
        usersName: {type:String,required: false},
        userPic: {type:Buffer,required:false},
        userPic_mimetype:{type:String,required:false}
     },{timestamps:true}),
     reviewSchema = new schema({
      userName: {type: String, required: true},
      reviewContent: {type: String, required: true}
     }),
     reviews = mongoose.model('reviews', reviewSchema),
     examuser = mongoose.model('examuser',userSchema),
     poster = mongoose.model('post',postSchema)

dotenv.config()

app.use(session({

    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : 24 * 60 * 60 * 1000
    }
}))
app.use('/', getRequests)
app.set('view engine', 'ejs')

// new user sign up 
app.post('/sign_new_user', upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  // console.log(req.body);
  const { fullname, email, phone, department, faculty, gender, level, password, confirmpwd, agree, dob } = req.body;

  if (!fullname || !email || !phone || !confirmpwd || !password || !department || !faculty || !gender || !level || !dob) {
    const msg = encodeURIComponent('Please fill in all fields');
    return res.redirect(`/login-signup?errormsg=&errormsge=${msg}`);
  }

  if (agree !== 'on') {
    const msg = encodeURIComponent('Click the check box to agree with our Terms and Conditions');
    return res.redirect(`/login-signup?errormsg=&errormsge=${msg}`);
  }

  const existing = await examuser.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    const msg = encodeURIComponent('Email or phone number has already been used');
    return res.redirect(`/login-signup?errormsg=&errormsge=${msg}`);
  }

  const name = fullname;
  let profilepic_name = 'default.jpg';
  let mimetype = 'image/jpeg';
  let profilepic = Buffer.from(''); // empty buffer or you can load a default image file

  // If a profile picture was uploaded
  if (req.files && req.files.profile && req.files.profile[0]) {
    const file = req.files.profile[0];
    profilepic_name = file.originalname;
    mimetype = file.mimetype;
    profilepic = file.buffer;
  }

  const user = new examuser({
    name,
    email,
    phone,
    department,
    faculty,
    gender,
    level,
    dob,
    password,
    profilepic_name,
    mimetype,
    profilepic,
    communityPosts: 0
  });

  try {
    await user.save();

    // Auto-login: create session
    const data = profilepic.toString('base64');
    const dataurl = `data:${mimetype};base64,${data}`;

    req.session.authenticated = true;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      department: user.department,
      faculty: user.faculty,
      dob: user.dob,
      gender: user.gender,
      level: user.level,
      pic: dataurl,
      mimetype: user.mimetype,
      buffer: user.profilepic,
      pastQuestiosDownloaded: 0,
      quizzesCompleted: 0,
      communityPosts: user.communityPosts
    };

    res.redirect('/dashboard')


  } catch (error) {
    console.error(error);
    const msg = encodeURIComponent('Something went wrong. Try again.');
    return res.redirect(`/login-signup?errormsg=&errormsge=${msg}`);
  }
});


// login 

app.post('/user_logged_in', parser, async (req, res) => {
  const { emaile, passwordw } = req.body;
  // console.log(req.body)

  try {
    const result = await examuser.find({ email: emaile , password: passwordw });
    // console.log(result)

    
if (result.length === 0) {
  const msg = encodeURIComponent('No Match was found. Check the email or password');
  return res.redirect(`/?errormsg=${msg}&errormsge=`);
}


    const user = result[0];
    // console.log(user)
    const { id, name, email, phone, department, faculty, gender, dob, level, password, mimetype, profilepic, communityPosts } = user;

    const data = profilepic.toString('base64');
    const dataurl = `data:${mimetype};base64,${data}`;
   req.session.authenticated = true;
    req.session.user = {
      id,
      name,
      email,
      phone,
      password,
      department,
      faculty,
      dob,
      gender,
      level,
      pic : dataurl,
      mimetype,
      buffer:profilepic,
      communityPosts
    };

    // Use render or redirect as needed
    res.redirect('/dashboard')


  } 
  catch (err) {
    console.error(err);
    return res.redirect(`/?errormsg=${encodeURIComponent('An error occurred while logging in.')}`);
  }
});


// post to  write a review 

app.post('/reviews', parser, async (req,res) =>{
  // console.log(req.body)
  const {userName, reviewContent} = req.body

  if(userName === "" || reviewContent === ""){
   return res.render('writeReview.ejs', {errormsg: 'please fill in all fields'})
  }

  const review = new reviews({
    userName,reviewContent
  })


  try {
    await review.save()
    res.redirect('/reviews')
  } catch (error) {
    if (error) {
      return console.log(error)
    }
  }
})


app.get('/allreviews', (req,res) =>{
  const find = reviews.find().then(result => {
    res.send(result)
  })
})

app.get('/allUsers', (req,res) =>{
  const find = examuser.find().then(result =>{
   
  res.send(result);
  })
})


app.post('/chatBot', upload.array('images[]'), async (req, res) => {
  const message = req.body.message || '';
  const history = JSON.parse(req.body.history || '[]');
  const files = req.files || [];

  try {
    const contents = [...history];

    // Build parts from user message and images
    const userParts = [];

    if (message) {
      userParts.push({ text: message });
    }

    for (const file of files) {
      const base64Image = file.buffer.toString('base64');
      userParts.push({
        inlineData: {
          mimeType: file.mimetype,
          data: base64Image,
        },
      });
    }

    // Push user input into the conversation
    contents.push({ role: 'user', parts: userParts });

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const stream = await model.generateContentStream({ contents });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      if (text) res.write(text);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Streaming error.');
  }
});



app.post('/passwordchange', isAuth, parser, async(req,res) =>{
  const {password} = req.body
// console.log(password)
  const user =  await examuser.findOne({_id: req.session.user.id})
  if (user) {
    user.password = password
    await user.save()
  }

  res.redirect('/profile')
    
  
})



app.post('/change_dp',isAuth, upload.single('uploadedFile'), async(req,res) =>{
    


    const file = req.file
    
    const profilepic_name = file.originalname,
    mimetype = file.mimetype,
    profilepic = file.buffer
    
   

       const condition = {_id: req.session.user.id}

    try {
        const update = await examuser.updateOne(condition,{profilepic_name,mimetype,profilepic}).then((err,result) =>{

            const data = profilepic.toString('base64')
            const pic = `data:${mimetype};base64,${data}`
        
            req.session.user.pic = pic
        
            res.redirect('/profile')
        
        
    
        })
    } catch (error) {
        console.log(error)
    }
   
   
})





app.use(express.static(__dirname + '/node_modules/bootstrap-icons/font'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static('public'))
app.listen(8080, async(err) =>{
  try{
    const cont = await mongoose.connect('mongodb+srv://abuka:ashlocksgrey@examassistcls.bxvxt.mongodb.net/examusers?retryWrites=true&w=majority&appName=examassistcls').then((result) =>{console.log('database connected')}).catch((err) => {throw err}) 

  }catch(err){
    if(err){
      throw err
    }
  }
    console.log('server is live')

})