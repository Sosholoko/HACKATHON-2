console.log("OK");
const exp = require('express');
const env = require('dotenv');
const app = exp()
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const reload = require('livereload');

const initializePassport = require('./passport-config');
initializePassport(passport, 
    uname => users.find(user => user.uname === uname),
    id => users.find(user => user.id === id)
)

const users = [];

env.config();

app.set('view engine', 'ejs');
app.use(exp.urlencoded({extended: false}))
app.use('/', exp.static(__dirname + '/public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res)=>{
    res.render('index.ejs');
})
app.get('/home', (req,res)=>{
    res.render('home.ejs', {name: req.user.uname})
})
app.get('/login', (req, res)=>{
    res.render('login.ejs')
})
app.get('/register', (req, res)=>{
    res.render('register.ejs')
})
app.post('/register', async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            lname: req.body.lname,
            email: req.body.email,
            uname: req.body.uname,
            password: hashedPassword
        })
        res.redirect('/login')
    }
    catch{
        res.redirect('/register')
    }
    console.log(users)
})
app.post('/login', passport.authenticate('local', {
    successRedirect : '/home',
    failureRedirect: '/login',
    failureFlash: true
}))
app.listen(process.env.PORT, ()=>{console.log('Listening on port 4000')})
