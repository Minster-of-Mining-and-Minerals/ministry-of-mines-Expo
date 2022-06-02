const {Model} = require('objection');

module.exports = class User extends Model {
    static get tableName() {
        return "users";
    }

    static get relationMappings(){
        const StaffUser = require("./StaffUser");
        const GalleryUser = require("./GalleryUser");
        const AdminUser = require("./AdminUser");

        return {
            gallery: {
                relation: Model.HasOneRelation,
                modelClass: GalleryUser,
                join: {
                    from: 'users.id',
                    to: 'gallery_users.user_id'
                },
            },
            staff: {
                relation: Model.HasOneRelation,
                modelClass: StaffUser,
                join: {
                    from: 'users.id',
                    to: 'staff_users.user_id'
                },
            },
            admin: {
                relation: Model.HasOneRelation,
                modelClass: AdminUser,
                join: {
                    from: 'users.id',
                    to: 'admin_user.user_id'
                },
            },
        }
    }

    // Optional JSON schema. This is not the database schema!
    // No tables or columns are generated based on this. This is only
    // used for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // See http://json-schema.org/ for more info.
    // static get jsonSchema() {
    //     return {
    //         type: 'object',
    //         required: ['username', 'password', 'is_admin', 'is_staff'],

    //         properties: {
    //             id: { type: 'string', minLength: 1, maxLength: 37 },

    //             first_name: { type: 'string', minLength: 1, maxLength: 45 },
    //             parentId: { type: ['integer', 'null'] },
    //             first_name: { type: 'string', minLength: 1, maxLength: 45 },
    //             last_name: { type: 'string', minLength: 1, maxLength: 45 },
    //             is_admin: { type: 'boolean' },
    //             is_staff: { type: 'boolean' },
    //         }
    //     };
    // }
    fullName(){
        return this.first_name + ' ' + this.lastName;
    }
};