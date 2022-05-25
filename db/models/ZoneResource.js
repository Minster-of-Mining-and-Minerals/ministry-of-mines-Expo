const {Model} = require('objection');

module.exports = class ZoneResource extends Model {
    static get tableName() {
        return "zone_resources";
    }

    static get relationMappings(){
        const Resource = require("./Resource");
        const Zone = require("./Zone");
        return {
            resource: {
                relation: Model.BelongsToOneRelation,
                modelClass: Resource,
                join: {
                    from: 'zone_resources.res_id',
                    to: 'resources.id'
                },
            },
            zone: {
                relation: Model.BelongsToOneRelation,
                modelClass: Zone,
                join: {
                    from: 'zone_resources.zone_id',
                    to: 'zones.id'
                },
            },
        }
    }
};