const express = require('express');
const {v4: uuidv4} = require("uuid");

const router = express.Router();

// Import database Models
const Resource = require('../db/models/Resource');
const Property = require('../db/models/Property');
const Application = require('../db/models/Application');
const ZoneResource = require("../db/models/ZoneResource");
const Zone = require("../db/models/Zone");
const AdminUser = require("../db/models/AdminUser");
const StaffUser = require("../db/models/StaffUser");
const User = require("../db/models/User");
const GalleryUser = require("../db/models/GalleryUser");


const {isLoggedIn, saveURL} = require("../middleware")

const get_res = async (zone_id) => {
    // Get resource ids of resources in zone
    const zone_res = await ZoneResource.query()
        .select('id','res_id')
        .where('zone_id','=', zone_id);

    // console.dir(zone_res);
    
    let resources = [];
    
    if(zone_res.length > 0){
        let res = Resource.query()
            .select('id','name','type','description', 'origin_occ', 'img_path')
            .where('id', zone_res[0].res_id)
            .withGraphFetched('[properties, applications]')

        for (let i = 1; i < zone_res.length; i++){
            res = res.orWhere('id', zone_res[i].res_id)
    
        }

        resources = await res;
    }
    // console.dir(resources)
    return resources;
}

const get_zone = async (zone_name) => {
    const zone = await Zone.query()
        .select('id','Name','Area', 'Status', 'Description')
        .where('Name', '=', zone_name)
        .first();
    
    return zone;
}

const get_user_type = async (user_id) => {
    if (!user_id) return "Public";
    
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

    return "Public"
    
}

const get_common_res_type = async (zone_id) => {
    const knex = ZoneResource.knex();

    function count(colName) {
        return knex.raw('count(??)', [colName]);
    }

    const commonResources = await ZoneResource.query()
        .select('resources.type')
        .join('resources','res_id', 'resources.id')
        .where('zone_id', zone_id)
        .groupBy('resources.type')
        .orderBy(count('resources.type'), 'DESC')
        .limit(5);
    
    return commonResources;
}
router.get('/north', saveURL, async (req,res)=>{
    const zone_name = "Northern Zone"
    console.log(zone_name)

    const zone_img_path = 'images/geo_maps/northern-zone.png';

    const user_type = await get_user_type(req.user ? req.user.id : null);

    // Get zone data
    const zone = await get_zone(zone_name);
    
    // Get resources data
    const resources = await get_res(zone.id);

    // Get common resources
    const common_res_types = await get_common_res_type(zone.id)

    // Remember current url (For breadcrumb)
    req.session.returnTo = req.originalUrl;
    req.session.zoneName = zone_name;

    if (user_type === "Admin" || user_type === "Staff"){
        return res.render('super-zone', {user_type, zone, zone_img_path, resources, common_res_types})
    }

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        if (display_role.role === "Instructor") {
            return res.render('gallery-zone', {zone, zone_img_path,  resources, common_res_types})
        } else if(display_role.role === "North") {
            return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
        }
    }
    
    if (user_type === "Public") {
        return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
    }
    
    return res.redirect('/')
});

router.get('/north-east', async (req,res)=>{
    const zone_name = "North-Eastern Zone";
    const zone_img_path = 'images/geo_maps/north-eastern-zone.png';

    const user_type = await get_user_type(req.user ? req.user.id : null);

    const zone = await get_zone(zone_name);
    const resources = await get_res(zone.id);
    const common_res_types = await get_common_res_type(zone.id)

    req.session.returnTo = req.originalUrl;
    req.session.zoneName = zone_name;

    if (user_type === "Admin" || user_type === "Staff"){
        return res.render('super-zone', {user_type, zone, zone_img_path, resources, common_res_types})
    }

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        if (display_role.role === "Instructor") {
            return res.render('gallery-zone', {zone, zone_img_path,  resources, common_res_types})
        } else if(display_role.role === "North-East") {
            return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
        }
    }
    
    if (user_type === "Public") {
        return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
    }
    
    return res.redirect('/')
});

router.get('/west', async (req,res)=>{
    const zone_name = "Western Zone"
    const zone_img_path = 'images/geo_maps/western-zone.png';

    const user_type = await get_user_type(req.user ? req.user.id : null);

    const zone = await get_zone(zone_name);
    const resources = await get_res(zone.id);
    const common_res_types = await get_common_res_type(zone.id)

    req.session.returnTo = req.originalUrl;
    req.session.zoneName = zone_name;

    if (user_type === "Admin" || user_type === "Staff"){
        return res.render('super-zone', {user_type, zone, zone_img_path, resources, common_res_types})
    }

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        if (display_role.role === "Instructor") {
            return res.render('gallery-zone', {zone, zone_img_path,  resources, common_res_types})
        } else if(display_role.role === "West") {
            return res.render('zone', {zone, zone_img_path, resources,common_res_types})
        }
    }
    
    if (user_type === "Public") {
        return res.render('zone', {zone, zone_img_path, resources,common_res_types})
    }
    
    return res.redirect('/')
});

router.get('/east', async (req,res)=>{
    const zone_name = 'Eastern Zone';
    const zone_img_path = 'images/geo_maps/eastern-zone.png';

    const user_type = await get_user_type(req.user ? req.user.id : null);

    const zone = await get_zone(zone_name);
    const resources = await get_res(zone.id);
    const common_res_types = await get_common_res_type(zone.id)

    req.session.returnTo = req.originalUrl;
    req.session.zoneName = zone_name;

    if (user_type === "Admin" || user_type === "Staff"){
        return res.render('super-zone', {user_type, zone, zone_img_path, resources, common_res_types})
    }

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        if (display_role.role === "Instructor") {
            return res.render('gallery-zone', {zone, zone_img_path,  resources, common_res_types})
        } else if(display_role.role === "East") {
            return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
        }
    }
    
    if (user_type === "Public") {
        return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
    }
    
    return res.redirect('/')
});

router.get('/south', async (req,res)=>{
    const zone_name = "Southern Zone"
    const zone_img_path = 'images/geo_maps/southern-zone.png';

    const user_type = await get_user_type(req.user ? req.user.id : null);

    const zone = await get_zone(zone_name);
    const resources = await get_res(zone.id);
    const common_res_types = await get_common_res_type(zone.id);

    req.session.returnTo = req.originalUrl;
    req.session.zoneName = zone_name;

    if (user_type === "Admin" || user_type === "Staff"){
        return res.render('super-zone', {user_type, zone, zone_img_path, resources, common_res_types})
    }

    if (user_type === "Gallery") {
        const display_role = await GalleryUser.query()
            .select('role')
            .where('user_id', req.user.id).first();
        
        if (display_role.role === "Instructor") {
            return res.render('gallery-zone', {zone, zone_img_path,  resources, common_res_types})
        } else if(display_role.role === "South") {
            return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
        }
    }
    
    if (user_type === "Public") {
        return res.render('zone', {zone, zone_img_path,  resources, common_res_types})
    }
    
    return res.redirect('/')
});

router.get('/add-zone', async(req,res)=>{
    console.log("req.session.returnTo:", req.session.returnTo);
    return res.render('add-zone')
})

router.post('/add-zone', async(req,res)=>{
    console.log("Request body..")
    console.dir(req.body)

    console.log("req.session.returnTo:", req.session.returnTo);

    // Extract zone data 
    const zone_id = uuidv4();
    const zone_name = req.body.zone_name.trim();
    const zone_area = req.body.zone_area.trim();
    const zone_status = req.body.zone_status.trim();
    const zone_desc = req.body.zone_desc.trim()
    //const zone_image = req.file;
    
    // Use data to insert new Resource into db
    const zone = await Zone.query().insert({
        id: zone_id,
        Name: zone_name,
        Area: zone_area,
        Status: zone_status,
        Description: zone_desc,
    })
    console.log("Zone added..")
    
    return res.redirect('../')
})

router.get('/edit-zone/:id', isLoggedIn, async(req,res) => {
    const zone_id = req.params.id;

    console.log("req.session.returnTo:", req.session.returnTo);
    const return_to = req.session.returnTo;

    // Get zone info
    const zone = await Zone.query()
        .select()
        .where('id', '=', zone_id)
        .first();

    // Render page with data
    return res.render('edit-zone', {zone, return_to})
})

router.post('/edit-zone/:id', isLoggedIn, async(req,res) => {
    console.log("Request body..")
    console.dir(req.body)

    console.log("req.session.returnTo:", req.session.returnTo);
    const return_to = req.session.returnTo;
    
    // Extract zone data 
    const zone_id = req.params.id;
    // const zone_name = req.body.zone_name.trim();
    const zone_area = req.body.zone_area.trim();
    const zone_status = req.body.zone_status.trim();
    const zone_desc = req.body.zone_desc.trim()
    //const zone_image = req.file;
    
    // Use data to insert new Resource into db
    const zone = await Zone.query().findById(zone_id).patch({
        Area: zone_area,
        Status: zone_status,
        Description: zone_desc,
    })
    console.log("Resource updated..")


    return res.redirect(`..${return_to}`)

})


module.exports = router;