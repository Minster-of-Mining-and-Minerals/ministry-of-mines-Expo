const {Model} = require('objection');

module.exports = class GalleryUser extends Model {
    static get tableName() {
        return "gallery_users";
    }

    static get relationMappings(){
        const User = require("./User");
        
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'gallery_users.id',
                    to: 'users.id'
                },
            },
        }
    }
};