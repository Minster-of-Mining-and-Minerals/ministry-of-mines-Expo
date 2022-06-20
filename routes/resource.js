const express = require('express');
const {v4: uuidv4} = require("uuid");
const multer = require("multer");
const {storage} = require('../db/cloudinary');
const upload = multer({storage});

const router = express.Router();

const {isLoggedIn} = require("../middleware")


// Import database Models
const Resource = require('../db/models/Resource');
const Property = require('../db/models/Property');
const Application = require('../db/models/Application');
const ZoneResource = require("../db/models/ZoneResource");
const Zone = require("../db/models/Zone");

// Add Resource
router.get('/upload', isLoggedIn, async(req,res) => {
    const return_to = req.session.returnTo;
    const zone_name = req.session.zoneName;
    console.log("req.session.returnTo:", return_to);
    console.log("req.session.zoneName:", zone_name);
    // Get all zones

    // Get all resource types

    // Render page with data
    return res.render('upload', {return_to, zone_name})
});

router.post('/upload', upload.single('res_image'),async (req,res) => {
    
    console.log("Resource added..")
    console.dir(req.body)

    const return_to = req.session.returnTo;
    console.log("req.session.returnTo:", return_to);

    // Extract resource data 
    const res_name = req.body.res_name.trim();
    const res_type = req.body.res_type.trim();
    const res_desc = req.body.res_desc.trim();
    const res_image = req.file;
    // const res_image_name = req.file.filename;
    const res_image_name = "";
    //const res_image_data = req.files.res_image.data;
    const res_origin = req.body.res_origin.trim();
    const res_prop_title = req.body.res_prop_title;
    const res_prop_desc = req.body.res_prop_desc;
    const res_app_title = req.body.res_app_title;
    const res_app_desc = req.body.res_app_desc;

    const res_id = uuidv4();
    // req.files.res_image.name = "res-img-" + res_id;
    // console.log(req.files.res_image.name)

    // const res_img_path = './uploads';
    // res_image.mv(res_img_path);
    console.log("Resource image downloaded in server..")

    console.dir(req.file)
    // Use data to insert new Resource into db
    const resource = await Resource.query().insert({
        id: res_id,
        name: res_name,
        type: res_type,
        img_path: res_image.path,
        description: res_desc,
        origin_occ: res_origin
    })
    console.log("Resource inserted into db..")
    // console.dir(resource);

    
    // Fetch zone
    const zone = await Zone.query().select('id').where('Name', req.body.zone)
    // Insert resource into zone
    const zone_res = await ZoneResource.query().insert({
        id: uuidv4(),
        zone_id: zone[0].id,
        res_id: resource.id
    })

    // if multiple properties provided
    if(Array.isArray(res_prop_title)){
        for(let i = 0; i < res_prop_title.length; i++) {
            // Create the property
            let prop = await Property.query().insert({
                id: uuidv4(),
                res_id: resource.id,
                title: res_prop_title[i],
                description: res_prop_desc[i]
            })
            console.log("Property inserted into db..")
            console.dir(prop);
        }
    }
    // if single property provided
    if ((typeof res_prop_title === 'string' && typeof res_prop_desc === 'string') || (res_prop_title instanceof String && res_prop_desc instanceof String)){
        // Insert the application
        let prop = await Property.query().insert({
            id: uuidv4(),
            res_id: resource.id,
            title: res_prop_title,
            description: res_prop_desc
        })
        console.log("Property inserted into db..")
        console.dir(prop);
    }
    
    // if multiple applications provided
    if(Array.isArray(res_app_title)){
        for(let i = 0; i < res_app_title.length; i++) {
            // Insert the application
            let app = await Application.query().insert({
                id: uuidv4(),
                res_id: resource.id,
                title: res_app_title[i],
                description: res_app_desc[i]
            });
            console.log("Application inserted into db..")
            console.dir(app);
        }
    }
    
    // if single application provided
    if ((typeof res_app_title === 'string' && typeof res_app_desc === 'string') || (res_app_title instanceof String && res_app_desc instanceof String)){
        // Insert the application
        let app = await Application.query().insert({
            id: uuidv4(),
            res_id: resource.id,
            title: res_app_title,
            description: res_app_desc
        })
        console.log("Application inserted into db..")
        console.dir(app);
    }


    return res.redirect(`..${return_to}`)
});

// Edit Resource
router.get('/edit/:id', isLoggedIn, async(req,res) => {
    const res_id = req.params.id;
    
    const return_to = req.session.returnTo;
    console.log("req.session.returnTo:", return_to);

    // Get zone of resource
    const zone_res = await ZoneResource.query()
        .select('zone_id')
        .where('res_id', '=', res_id)
        .first()
        .withGraphFetched('zone')

    console.dir(zone_res)

    const zone = zone_res.zone;

    console.dir(zone)
    // Get resource info
    const resource = await Resource.query()
        .select('id', 'name', 'type', 'img_path', 'description', 'origin_occ')
        .where('id', '=', res_id)
        .first()
        .withGraphFetched('[properties, applications]')


    console.dir(resource)
    // Render page with data
    return res.render('edit', {return_to, zone, resource})
})

router.post('/edit/:id', isLoggedIn, upload.single('res_image'),async (req,res) => {
    
    // console.log("Request body..")
    // console.dir(req.body)

    const return_to = req.session.returnTo;
    console.log("req.session.returnTo:", return_to);

    console.dir(req.body)
    let filepath = "";

    // Extract resource data 
    const res_id = req.params.id;
    const res_name = req.body.res_name.trim();
    const res_type = req.body.res_type.trim();
    const res_desc = req.body.res_desc.trim();
    const res_image = req.file;
    const res_image_name = "";
    //const res_image_data = req.files.res_image.data;
    const res_zone = req.body.zone.trim();
    const res_origin = req.body.res_origin.trim();
    const res_prop_title = req.body.res_prop_title;
    const res_prop_desc = req.body.res_prop_desc;
    const res_app_title = req.body.res_app_title;
    const res_app_desc = req.body.res_app_desc;

    /** =============== Resource ===================== */

    // Check if new image has been uploaded
    if (res_image){
        filepath = res_image.path 
    }else {
        // Get the original url.
        const fetch_img_path = await Resource.query()
            .select('img_path')
            .where('id', '=', res_id)
            .first()
        filepath = fetch_img_path.img_path;
    }
    
    // Use data to insert new Resource into db
    const resource = await Resource.query()
        .findById(res_id)
        .patch({
            name: res_name,
            type: res_type,
            img_path: filepath,
            description: res_desc,
            origin_occ: res_origin
        });

    console.log("Resource updated..")

    /** =============== ZONE ===================== */
    // Fetch current zone of resource
    console.log("Fetching current zone id..")
    const fetch_current_zone_id = await ZoneResource.query().select('zone_id').where('res_id','=', res_id).first();
    console.log("Zone id:",fetch_current_zone_id)
    console.log("Fetching current zone..")
    const current_zone = await Zone.query().findById(fetch_current_zone_id.zone_id)
    // console.dir(current_zone)

    console.log("res_zone:", res_zone);
    console.log("current_zone.Name:",current_zone.Name)

    // Check if zone has been modified
    if(res_zone != current_zone.Name) {
        console.log("TRUEEEEEEEe")
        console.log("res_zone:", res_zone);
        // Find id of new zone
        console.log("Fetching new zone id..")
        const fetch_new_zone_id = await Zone.query().select('id').where('Name','=',res_zone)
        console.log('Updating resource zone..')
        const new_zone = await ZoneResource.query()
            .patch({
                'zone_id': fetch_new_zone_id.id
            })
            .where('res_id', '=', res_id)
    }
    
    /** =============== Properties ===================== */

    // Fetch current properties of resource
    const current_properties = await Property.query().select('id').where('res_id', '=', res_id)
    console.log('Current properties: ')
    console.dir(current_properties)
    // if multiple properties provided
    if(Array.isArray(res_prop_title)){
        const cur_prop_len = current_properties.length;
        const new_prop_len = res_prop_title.length;
        // Check if more properties added
        if( cur_prop_len < new_prop_len){
            // Insert new properties
            console.log('Inserting new properties..')
            for(let i = cur_prop_len; i < new_prop_len; i++) {
                // Create the property
                let prop = await Property.query().insert({
                    id: uuidv4(),
                    res_id: res_id,
                    title: res_prop_title[i],
                    description: res_prop_desc[i]
                })
                console.log("Property inserted..")
                // console.dir(prop);
            }
        }
        // Update existing ones
        for(let i = 0; i < cur_prop_len; i++) {
            // Create the property
            console.log('Updating new properties..')
            let prop = await Property.query()
                .patch({
                    title: res_prop_title[i],
                    description: res_prop_desc[i]
                })
                .where('id', '=', current_properties[i].id)

            console.log("Property updated..")
            // console.dir(prop);
        }

    }
    // if single property provided
    if ((typeof res_prop_title === 'string' && typeof res_prop_desc === 'string') || (res_prop_title instanceof String && res_prop_desc instanceof String)){
        // Insert the property
        console.log('Updating property..')
        let prop = await Property.query()
            .patch({
                title: res_prop_title,
                description: res_prop_desc
            })
            .where('res_id', '=', res_id);
        console.log("Property updated..")
        console.dir(prop);
    }
    
    /** =============== Applications ===================== */

        // Fetch current properties of resource
        const current_applications = await Application.query().select('id').where('res_id', '=', res_id)

        // if multiple properties provided
        if(Array.isArray(res_app_title)){
            const cur_app_len = current_applications.length;
            const new_app_len = res_app_title.length;
            
            console.log("cur_app_len:", cur_app_len)
            console.log("new_app_len:", new_app_len)

            // Check if more properties added
            if( new_app_len > cur_app_len){
                // Insert new properties
                console.log('Inserting new applications..')
                for(let i = cur_app_len; i < new_app_len; i++) {
                    console.log(`res_app_title[${i}]:`, res_app_title[i])
                    console.log(`res_app_desc[${i}]:`, res_app_desc[i])
                    // Create the Application
                    let app = await Application.query()
                        .insert({
                            id: uuidv4(),
                            res_id: res_id,
                            title: res_app_title[i],
                            description: res_app_desc[i]
                        })
                    console.log("Application inserted into db..")
                    console.dir(app);
                }
            }

            console.log('Updating current applications..')
            // Update existing ones
            for(let i = 0; i < cur_app_len; i++) {
                console.log("current_applications[i].id:",current_applications[i].id)
                console.log("res_app_title[i]:",res_app_title[i]);

                // Create the property
                let app = await Application.query()
                    .patch({
                        title: res_app_title[i],
                        description: res_app_desc[i]
                    })
                    .where('id', '=', current_applications[i].id)

                console.log("Application updated..")
                console.dir(app);
            }
    
    
        }

        // if single application provided
        if ((typeof res_app_title === 'string' && typeof res_app_desc === 'string') || (res_app_title instanceof String && res_app_desc instanceof String)){
            // Insert the property
            console.log('Updating application..')
            let app = await Application.query()
                .patch({
                    title: res_app_title,
                    description: res_app_desc
                })
                .where('res_id', '=', res_id);
            console.log("Application updated..")
            // console.dir(app);
        }


    return res.redirect(`..${return_to}`)
})

router.delete('/delete/:id', async(req,res) => {
    const res_id = req.params.id;
    console.log("req.session.returnTo:", req.session.returnTo);
    const return_to = req.session.returnTo;

    const removed_res = await Resource.query().deleteById(res_id);

    // Redirect to the previous page
    return res.redirect(`..${return_to}`)
});

module.exports = router;