const localStrategy = require('passport-local');
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUname, getUserById){
    const authenticateUser = async (uname, password, done)=>{
        const user =  getUserByUname(uname)
        if(user == null){
            return done(null, false, {message: 'No user with this username'})
        }
        
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
            return done(null, false, {message: 'Password incorrect'})
            }
        }catch(e){
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'uname'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
};

module.exports = initialize