const { Model } = require('objection');

module.exports = class PublicResource extends Model {
    static get tableName() {
        return "public_resources";
    }

    /**
     * Returns the public URL path for this resource file
     */
    get publicPath() {
        return `/resource/${this.filename}`;
    }
};
