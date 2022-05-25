const {Model} = require('objection');

module.exports = class Property extends Model {
    static get tableName() {
        return "properties";
    }

    static get relationMappings(){
        const Resource = require("./Resource");
        return {
            resource: {
                relation: Model.BelongsToOneRelation,
                modelClass: Resource,
                join: {
                    from: 'properties.res_id',
                    to: 'resources.id'
                },
            }
            
        }
    }
};