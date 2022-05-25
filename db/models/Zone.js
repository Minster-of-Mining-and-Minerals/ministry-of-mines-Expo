const {Model} = require('objection');

module.exports = class Zone extends Model {
    static get tableName() {
        return "zones";
    }

    static get relationMappings(){
        const Resource = require("./Resource")
        return {
            resources: {
                relation: Model.ManyToManyRelation,
                modelClass: Resource,
                join: {
                    from: 'zones.id',
                    through: {
                        from: 'zone_resources.zone_id',
                        to: 'zone_resources.res_id'
                    },
                    to: 'resources.id'
                },
            },
        }
    }
};