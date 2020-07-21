import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize) {
        //Fields registered by the files
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
        },
        {
            sequelize,
        });
        return this;
    }
}

export default File;
