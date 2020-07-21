import Product from '../models/Product';
import File from '../models/File';
import *  as Yup from 'yup';
import { response } from 'express';

class ProductController {

    async index(req, res) {
        try {
            //Setting the default page value
            const { page = 1 } = req.query;

            //Pagination: Listing 5 products
            const products = await Product.findAll({
                where: { deleted_at: null },
                include: [File],
                limit: 5,
                offset: (page - 1) * 5
            });

            return res.json(products);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Não foi possível listar os produtos.' });
        }
    }


    async show(req, res) {
        try {
            //Comparing the params id with the database id
            const product = await Product.findOne({
                where: {
                    id: req.params.productId
                },
                include: [File]
            });
            
            //If the id does not exist in the database...
            if(!product){
                return res.status(400).json({ error: 'Esse produto não existe.' });
            }

            return res.json(product);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Erro. ' });
        }
    }


    async store(req, res) {
        try {
            //Checks if the fields have been filled correctly
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required(),
                amount: Yup.string()
                    .required(),
                price: Yup.string()
                    .required()
            });

            //Checks if the befored informations have all fields filled
            if(!(await schema.isValid(req.body))) {
                console.log(req.body);
                return res.status(400).json({ error: 'Todos os campos precisam ser preenchidos.' });
            }

            //Abstraction of fields
            const { name, amount, price } = await Product.create(req.body);


            //If everything is correct, the information will be registered and returned.
            return res.json({
                name,
                amount,
                price,
            });
        }
        catch (err) {
            console.log("Error: " + err);
            return res.status(400).json({error: 'Não foi possível efetuar o cadastro.'});
        }
    }


    async update(req, res) {
        try {
            //Comparing the params id with the database id
            const product = await Product.findOne({
                where: {
                    id: req.params.productId
                }
            });

            //If the id does not exist in the database...
            if(!product){
                return res.status(400).json({ error: 'Esse produto não existe.' });
            }

            const { name, amount, price, thumb_id } = req.body;

            //Updating information
            const productUpdate = await Product.update({
                name,
                amount,
                price,
                thumb_id
            },
            {
                where: { id: req.params.productId }
            });

            //Return new data
            if(productUpdate) {
                const productUpdated = await Product.findOne({
                    where: {
                        id: req.params.productId
                    }
                });

                return res.json(productUpdated);
            }
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: 'Erro:  ' + err });
        }
    }


    async delete(req, res) {
        try {
            //Capturing params id
            const { productId } = req.params;

            //Soft delete
            await Product.destroy({ where: { id: productId } });
            return res.json({ ok: true });
        }
        catch (err) {
            console.log("Error: " + err);
            res.status(400).json({error: 'Não foi possível deletar esse produto.'});
        }
    }


    async destroy(req, res) {
        try {
            //Capturing params id
            const { productId } = req.params;

            //Force delete
                await Product.destroy({ where: { id: productId }, force: true });
                return res.json({ ok: true });
        }
        catch (err) {
            console.log("Error: " + err);
            res.status(400).json({error: 'Não foi possível deletar esse produto.'});
        }
    }


    async restore(req, res) {
        try {
            //Capturing params id
            const { productId } = req.params;

            //Restores the deleted product (just soft deleted)
            await Product.restore({ where: { id: productId }});
            return res.json({ ok: true });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({error: 'Não foi possível restaurar esse produto.'});
        }
    }

}

export default new ProductController();
