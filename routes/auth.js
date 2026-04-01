const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const User = require('../db/models/User');
const StaffUser = require('../db/models/StaffUser');

const {v4: uuidv4} = require("uuid");
const bcrypt = require("bcrypt");

const authRouter = express.Router();
const {isLoggedIn, saveURL} = require("../middleware");
const GalleryUser = require('../db/models/GalleryUser');
const AdminUser = require('../db/models/AdminUser');


const getUser = async (username) => {
    const user = await User.query()
    .select()
    .where('username', username)
    .first()
    .catch((err) => {
        console.dir(err);
        throw err;
    });

    if(!user) {
        console.log(`User ${username} does not exist!`)
        throw new Error("User does not exist")
    }
    console.dir(user)
    return user;
}
const addUser = async (username, password) => {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.query().insertAndFetch({
        id: uuidv4(),
        username: username,
        hash: hash,
        is_admin: false,
        is_staff: false,
    }).catch((err) => {
        console.dir(err);
        return err;
    })
    return user;
}
const addStaffUser = async (user, first_name, last_name, email, role, organization) => {
    const staff = await StaffUser.query().insertAndFetch({
        id: uuidv4(),
        user_id: user.id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        role: role,
        organization: organization
    }).catch((err) => {
        console.dir(err);
        return err;
    })
    return staff;

}
const addGalleryUser = async (user, role) => {
    const galleryUser = await GalleryUser.query().insertAndFetch({
        id: uuidv4(),
        user_id: user.id,
        role: role,
    }).catch((err) => {
        console.dir(err);
        return err;
    })
    return galleryUser;

}
const validatePass = async (password, hash) => {
    const validPass = await bcrypt
        .compare(password, hash)
        .catch((err)=>{
            console.dir(err);
            throw err;
        })
    return validPass;
}

passport.use('local',new LocalStrategy(function verify(username, password, cb) {

    process.nextTick(async function(){
        const user = await getUser(username)
            .catch((err)=>{
                console.log("Here")
                console.dir(err)
                return cb(null, false, {message: 'Incorrect username or password.'})
            });

        console.log('User:',user)
    
        if(user){
            const validPass = await validatePass(password, user.hash).catch((err)=>{return cb(err)});
            if(!validPass) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return (cb(null, user))
        }else{
            return cb(null, false, {message: 'Incorrect username or password.'})
        }
    })
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});


authRouter.get('/login', function(req, res, next) {
    console.log("req.session.returnTo:",req.session.returnTo);
  res.render('login');
});

authRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
    // failureFlash: true
}),  (req, res, next) => {
    // console.log("req.session.returnTo:",req.session.returnTo);
    // console.dir(req.session)

    const redirectURL = req.session.returnTo || '/';
    // console.log("Redirect URL:", redirectURL)
    delete req.session.returnTo;
    return res.redirect(redirectURL)
});

authRouter.get('/logout', isLoggedIn,function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
});

authRouter.post('/logout', isLoggedIn,function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
});

authRouter.get('/signup', function(req, res, next) {
    return res.render('signup');
});
  
authRouter.post('/signup', async function(req, res, next) {

    const {first_name,
            last_name, 
            email, 
            username, 
            password, 
            organization, 
            role
        } = req.body;

    const inserted_user = await addUser(username, password)
    .catch((err) => {
        console.dir(err);
        return next(err);
    })

    const inserter_staff = await addStaffUser(inserted_user, first_name, last_name, email,role, organization)
    .catch((err) => {
        console.dir(err);
        return next(err);
    })
    console.dir(inserted_user);

    res.locals.currentUserType = 'Staff';
    req.session.currentUserType = 'Staff'
    const user = {
        id: inserted_user.id,
        username: inserted_user.username,
    }
    console.dir(user);

    req.login(user, function(err) {
        if (err) {return next(err);}
        return res.redirect('/')
    });

    console.dir(req.user)

    // return res.status(500).send("Could not register user!")
});

authRouter.get('/register/gallery-user', isLoggedIn, async function (req, res, next) {
    const return_to = req.session.returnTo;
    const zone_name = req.session.zoneName;

    console.log("req.session.returnTo:", return_to);
    console.log("-----------------------------------------------");
    return res.render('add-gallery-user',{return_to, zone_name})
});

authRouter.post('/register/gallery-user', isLoggedIn, async function (req, res, next) {
    const { username, role, password} = req.body;
    console.dir(req.body)
    const created_user = await addUser(username, password);
    const gallery_user = await addGalleryUser(created_user, role);

    const redirectURL = req.session.returnTo || '/';
    console.log("Redirect URL:", redirectURL);
    console.log("-----------------------------------------------");
    return res.redirect(redirectURL)
});


authRouter.get('/profile', isLoggedIn, async function (req, res, next) {
    const currentUser = await User.query().findById(req.user.id);
    let allUsers = null;

    if (currentUser.is_admin) {
        allUsers = await User.query().select('id', 'username', 'is_admin', 'is_staff').where('is_admin', false).orderBy('username');
    }

    res.render('update-profile', { user: currentUser, message: null, error: null, isAdminEditing: false, allUsers });
});

authRouter.post('/profile', isLoggedIn, async function (req, res, next) {
    const { username, password, c_password, userId } = req.body;
    const currentUser = await User.query().findById(req.user.id);
    let targetId = req.user.id;
    let isAdminEditing = false;
    let allUsers = null;

    if (currentUser.is_admin) {
        allUsers = await User.query().select('id', 'username', 'is_admin', 'is_staff').where('is_admin', false).orderBy('username');
    }

    if (currentUser.is_admin && userId) {
        targetId = userId;
        isAdminEditing = true;
    }

    let targetUser = await User.query().findById(targetId);

    if (password && password !== c_password) {
        return res.render('update-profile', { 
            user: targetUser, 
            message: null, 
            error: 'Passwords do not match', 
            isAdminEditing,
            allUsers
        });
    }

    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (password) {
            updateData.hash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length > 0) {
            await User.query().patchAndFetchById(targetId, updateData);
        }

        targetUser = await User.query().findById(targetId);
        res.render('update-profile', { 
            user: targetUser, 
            message: 'Profile updated successfully!', 
            error: null, 
            isAdminEditing,
            allUsers
        });
    } catch (err) {
        console.error(err);
        res.render('update-profile', { 
            user: targetUser, 
            message: null, 
            error: 'An error occurred while updating profile.', 
            isAdminEditing,
            allUsers
        });
    }
});

authRouter.post('/profile/delete-user', isLoggedIn, async function (req, res, next) {
    const { userId } = req.body;
    const currentUser = await User.query().findById(req.user.id);

    if (!currentUser.is_admin) {
        return res.status(403).send('Forbidden');
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
        const allUsers = await User.query().select('id', 'username', 'is_admin', 'is_staff').orderBy('username');
        return res.render('update-profile', {
            user: currentUser,
            message: null,
            error: 'You cannot delete your own account.',
            isAdminEditing: false,
            allUsers
        });
    }

    try {
        const knex = User.knex();
        // Delete related records first
        await knex('staff_users').where('user_id', userId).del();
        await knex('admin_user').where('user_id', userId).del();
        await knex('gallery_users').where('user_id', userId).del();
        // Delete user
        await User.query().deleteById(userId);
        return res.redirect('/profile');
    } catch (err) {
        console.error(err);
        const allUsers = await User.query().select('id', 'username', 'is_admin', 'is_staff').orderBy('username');
        return res.render('update-profile', {
            user: currentUser,
            message: null,
            error: 'Failed to delete user.',
            isAdminEditing: false,
            allUsers
        });
    }
});

module.exports = {authRouter, passport};