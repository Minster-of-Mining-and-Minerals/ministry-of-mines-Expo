const express = require("express");
require('dotenv').config();

const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const path = require("path");
const server = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const multer = require("multer");
const methodOverride = require('method-override')


const {storage} = require('./db/cloudinary');
const upload = multer({storage});

const {v4: uuidv4} = require("uuid");


// Setup database
const dbSetup = require('./db/db-setup');
dbSetup();

// Import database Models
const Resource = require('./db/models/Resource');
const Property = require('./db/models/Property');
const Application = require('./db/models/Application');
const ZoneResource = require("./db/models/ZoneResource");
const Zone = require("./db/models/Zone");

// Set EJS 
server.engine('ejs', ejsMate);
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'))

server.use(express.static(path.join(__dirname, 'public')))


// On every request:
server.use(morgan('dev')); // Use request logger
server.use((req,res,next)=>{
    console.log(req.method, req.path);
    next();
})

server.use(methodOverride('_method'));

//server.use(fileUpload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

// Routes
server.get('/', async (req,res)=>{
    return res.render('index')
})

// Zone pages
server.get('/north', async (req,res)=>{
    const zone_name = "Northern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('north', {zone,  resources})
});
server.get('/north-east', async (req,res)=>{
    const zone_name = "North-Eastern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('north-east', {zone, resources})
});

const get_res = async (zone_id) => {
    
    // Get resource ids of resources in zone
    const zone_res = await ZoneResource.query()
        .select('id','res_id')
        .where('zone_id','=', zone_id);

    console.dir(zone_res);
    
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
    console.dir(resources)
    return resources;
}
server.get('/west', async (req,res)=>{
    const zone_name = "Western Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('west',{zone, resources})
});

server.get('/super-west', async (req,res)=>{
    const zone_name = "Western Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('super-west',{zone, resources})
});

server.get('/super-east', async (req,res)=>{
    const zone_name = "Eastern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('super-east',{zone, resources})
});

server.get('/super-north', async (req,res)=>{
    const zone_name = "Northern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('super-north',{zone, resources})
});

server.get('/super-north-east', async (req,res)=>{
    const zone_name = "North-Eastern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('super-north-east',{zone, resources})
});

server.get('/super-south', async (req,res)=>{
    const zone_name = "Southern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)

    return res.render('super-south',{zone, resources})
});

server.get('/east', async (req,res)=>{
    const zone_name = 'Eastern Zone';
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)


    // Get id and image for all resources in the zone

    return res.render('east', {zone, resources})
});
server.get('/south', async (req,res)=>{
    const zone_name = "Southern Zone"
    console.log(zone_name)

    // Get zone data
    const zone = await Zone.query().select('id','Name','Area', 'Status', 'Description').where('Name', '=', zone_name).first();
    console.dir(zone)
    
    // Get resources data
    const resources = await get_res(zone.id);
    console.log('Resources length:',resources.length)


    return res.render('south', {zone, resources})
});

server.get('/insert-zones', async (req,res)=>{
    const north = await Zone.query().insert({
        id: uuidv4(),
        Name: "Northern Zone",
        Area: "328.5 km2",
        Status: "Advanced Stage Exploration",
        Description: "Located in north Ethiopia, the Northern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron"
    })

    const north_east = await Zone.query().insert({
        id: uuidv4(),
        Name: "North-Eastern Zone",
        Area: "328.5 km2",
        Status: "Advanced Stage Exploration",
        Description: "Located in north-eastern Ethiopia, the North-East Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron"
    })

    const east = await Zone.query().insert({
        id: uuidv4(),
        Name: "Eastern Zone",
        Area: "328.5 km2",
        Status: "Advanced Stage Exploration",
        Description: "Located in eastern Ethiopia, the Eastern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron"
    })

    const west = await Zone.query().insert({
        id: uuidv4(),
        Name: "Western Zone",
        Area: "328.5 km2",
        Status: "Advanced Stage Exploration",
        Description: "Located in western Ethiopia, the Western Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron"
    })

    const south = await Zone.query().insert({
        id: uuidv4(),
        Name: "Southern Zone",
        Area: "328.5 km2",
        Status: "Advanced Stage Exploration",
        Description: "Located in southern Ethiopia, the Southern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron"
    })
    res.end('ok');
})

server.get('/upload', async(req,res) => {
    // Get all zones

    // Get all resource types

    // Render page with data
    return res.render('upload')
})

server.post('/upload', upload.single('res_image'),async (req,res) => {
    
    console.log("Resource added..")
    console.dir(req.body)

    // Extract resource data 
    const res_name = req.body.res_name.trim();
    const res_type = req.body.res_type.trim();
    const res_desc = req.body.res_desc.trim();
    const res_image = req.file
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
        img_name: res_image_name,
        img_path: req.file.path,
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


    return res.redirect('../super-north')
})

server.delete('/delete/:id', async(req,res) => {
    const res_id = req.params.id;

    const removed_res = await Resource.query().deleteById(res_id);

    // Todo - Ideally redirect to the previous page
    return res.redirect('../super-north');
});

server.get('/edit/:id', async(req,res) => {
    const res_id = req.params.id;

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
    return res.render('edit', {zone, resource})
})

server.post('/edit/:id', upload.single('res_image'),async (req,res) => {
    
    console.log("Request body..")
    console.dir(req.body)

    let filepath = "";
    // Extract resource data 
    const res_id = req.params.id;
    console.log(res_id);

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
        const fetch_img_path = await Resource.query()
            .select('img_path')
            .where('id', '=', res_id)
            .first()
        filepath = fetch_img_path.img_path;
    }
    
    // Use data to insert new Resource into db
    const resource = await Resource.query().findById(res_id).patch({
        name: res_name,
        type: res_type,
        img_name: res_image_name,
        img_path: filepath,
        description: res_desc,
        origin_occ: res_origin
    })
    console.log("Resource updated..")

    /** =============== ZONE ===================== */
    // Fetch current zone of resource
    console.log("Fetching current zone id..")
    const fetch_current_zone_id = await ZoneResource.query().select('zone_id').where('res_id','=', res_id).first();
    console.dir(fetch_current_zone_id)
    console.log("Fetching current zone..")
    const current_zone = await Zone.query().findById(fetch_current_zone_id.zone_id)
    console.dir(current_zone)

    // Check if zone has been modified
    if(res_zone != current_zone.Name) {
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
                console.log("Property inserted into db..")
                console.dir(prop);
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
                console.dir(prop);
            }
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
            const new_app_len = res_prop_title.length;
            // Check if more properties added
            if( cur_app_len < new_app_len){
                // Insert new properties
                console.log('Inserting new applications..')
                for(let i = cur_app_len; i < new_app_len; i++) {
                    // Create the Application
                    let app = await Application.query().insert({
                        id: uuidv4(),
                        res_id: res_id,
                        title: res_app_title[i],
                        description: res_app_desc[i]
                    })
                    console.log("Application inserted into db..")
                    console.dir(app);
                }
                // Update existing ones
                for(let i = 0; i < cur_app_len; i++) {
                    // Create the property
                    console.log('Updating new applications..')
                    let app = await Application.query()
                        .patch({
                            title: res_app_title[i],
                            description: res_app_desc[i]
                        })
                        .where('res_id', '=', res_id)
    
                    console.log("Application updated..")
                    console.dir(app);
                }
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
            console.dir(app);
        }


    return res.redirect('/super-north')
})

server.get('/edit-zone/:id', async(req,res) => {
    const zone_id = req.params.id;

    // Get zone info
    const zone = await Zone.query()
        .select()
        .where('id', '=', zone_id)
        .first();

    // Render page with data
    return res.render('edit-zone', {zone})
})

server.post('/edit-zone/:id', async(req,res) => {
    console.log("Request body..")
    console.dir(req.body)

    // Extract zone data 
    const zone_id = req.params.id;

    const zone_name = req.body.zone_name.trim();
    const zone_area = req.body.zone_area.trim();
    const zone_status = req.body.zone_status.trim();
    const zone_desc = req.body.zone_desc.trim()
    //const zone_image = req.file;
    
    // Use data to insert new Resource into db
    const zone = await Zone.query().findById(zone_id).patch({
        Name: zone_name,
        Area: zone_area,
        Status: zone_status,
        Description: zone_desc,
    })
    console.log("Resource updated..")



    return res.redirect('../super-north')
})




server.use((req,res)=>{
    res.status(404).send("404");
})

server.listen(3000, ()=>{
    console.log("Listening on port 3000")
})