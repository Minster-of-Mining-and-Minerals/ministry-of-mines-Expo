const {Model} = require('objection');

module.exports = class Application extends Model {
    static get tableName() {
        return "applications";
    }

    static get relationMappings(){
        const Resource = require("./Resource");
        return {
            resource: {
                relation: Model.BelongsToOneRelation,
                modelClass: Resource,
                join: {
                    from: 'applications.res_id',
                    to: 'resources.id'
                },
            }
            
        }
    }
};