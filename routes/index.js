const express = require('express');
const {v4: uuidv4} = require("uuid");

const router = express.Router();

const AdminUser = require("../db/models/AdminUser");
const StaffUser = require("../db/models/StaffUser");
const GalleryUser = require("../db/models/GalleryUser");

const get_user_type = async (user_id) => {
    const admin = await AdminUser.query()
        .select('id', 'user_id')
        .where('user_id', user_id)
        .first();
    
    const staff = await StaffUser.query()
        .select('id', 'user_id')
        .where('user_id', user_id)
        .first();

    const gallery = await GalleryUser.query()
        .select('id', 'user_id')
        .where('user_id', user_id)
        .first();

    if (admin) {
        return "Admin"
    } else if(staff) {
        return "Staff"
    } else if(gallery) {
        return "Gallery"
    }

    return "NA"
    
}

router.get('/', async (req,res)=>{
    
    if(req.user) {
        const user_type = await (await get_user_type(req.user.id)).trim();

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        console.dir(display_role)
        if (display_role.role === "North") {
            return res.redirect('/north');
        } else if(display_role.role === "North-East") {
            return res.redirect('/north-east');
        } else if(display_role.role === "East") {
            return res.redirect('/east');
        } else if(display_role.role === "West") {
            return res.redirect('/west');
        } else if(display_role.role === "South") {
            return res.redirect('/south');
        }
    }
    }
    
    return res.render('index')
});

module.exports = router;