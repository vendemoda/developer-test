import Sequelize, { Model } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        //Fields registered by the product
        super.init({
            name: Sequelize.STRING,
            amount: Sequelize.INTEGER,
            price: Sequelize.FLOAT,
        },
        {
            sequelize,
            paranoid: true
        });

        return this;
    }

    //Relates the File table to the Product table. Save the file id inside the Product table.
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'thumb_id' });
    }
}

export default Product;
