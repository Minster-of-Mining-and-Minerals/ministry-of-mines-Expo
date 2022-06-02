const {Model} = require('objection');

module.exports = class AdminUser extends Model {
    static get tableName() {
        return "admin_user";
    }

    static get relationMappings(){
        const User = require("./User");
        
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'admin_user.id',
                    to: 'users.id'
                },
            },
        }
    }
};