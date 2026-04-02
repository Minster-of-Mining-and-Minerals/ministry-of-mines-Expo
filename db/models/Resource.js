const { Model } = require('objection');

module.exports = class Resource extends Model {
    static get tableName() {
        return "resources";
    }

    static get relationMappings() {
        const Property = require("./Property");
        const Application = require("./Application");
        const PublicResource = require("./PublicResource");
        return {
            public_resource: {
                relation: Model.BelongsToOneRelation,
                modelClass: PublicResource,
                join: {
                    from: 'resources.img_path',
                    to: 'public_resources.filename'
                }
            },
            properties: {
                relation: Model.HasManyRelation,
                modelClass: Property,
                join: {
                    from: 'resources.id',
                    to: 'properties.res_id'
                },
            },
            applications: {
                relation: Model.HasManyRelation,
                modelClass: Application,
                join: {
                    from: 'resources.id',
                    to: 'applications.res_id'
                },
            }
        }
    }
};