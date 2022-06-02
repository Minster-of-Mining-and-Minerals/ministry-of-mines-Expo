const {Model} = require('objection');

module.exports = class StaffUser extends Model {
    static get tableName() {
        return "staff_users";
    }

    static get relationMappings(){
        const User = require("./User");
        
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'staff_users.id',
                    to: 'users.id'
                },
            },
        }
    }
};