import User from '../models/User';
import *  as Yup from 'yup';

class UserController {
    async store(req, res) {
        //Checks if the fields have been filled correctly
        const schema = Yup.object().shape({
            name: Yup.string()
                .required('Este campo é obrigatório.'),
            email: Yup.string()
                .email()
                .required('Este campo é obrigatório.'),
            password: Yup.string()
                .required('Este campo é obrigatório.')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
                  )
        });

        //Checks if the befored password have all characters of the rule
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'A validação falhou.' });
        }

        //Checks if the email already exists
        const userExists = await User.findOne({ where: { email: req.body.email } });
        if(userExists) {
            return res.status(400).json({error: 'User alredy exists.'});
        }

        //Abstraction of fields
        const { id, name, email } = await User.create(req.body);

        //If everything is correct, the information will be registered and returned.
        return res.json({
            id,
            name,
            email
        });
    }

    async update(req, res) {
        //Checks if the user wants to change the password, and if the fields were filled in correctly
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
                  ),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    'Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
                )
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                    password ? field.required().oneOf([Yup.ref('password')]) : field
            )
        });

        //Checks if the befored password have all characters of the rule
        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.' });
        }

        //Abstraction of fields
        const { email, oldPassword } = req.body;

        //Search the user for the primary key
        const user = await User.findByPk(req.userId);

        //Checks if the user wants to change the email, and if the fields were filled in correctly
        if(email != user.email) {
            const userExists = await User.findOne({ where: { email: email } });
            if(userExists) {
                return res.status(400).json({error: 'O usuário já existe.'});
            }
        }

        //Checks if the existing old password
        if(oldPassword && !(await user.checkPassword(oldPassword))) {
            res.status(401).json({ error: 'A senha não corresponde.' });
        }

        //Abstraction of fields
        const { id, name } = await user.update(req.body);

        //If everything is correct, it will return the new information abstracted from the user.
        return res.json({
            id,
            name,
            email
        });
    }

    async destroy(req, res) {
        //Search the user for the primary key
        const user = await User.findByPk(req.userId);

        //If found, will delete the user according to the id
        if(user) {
            await user.destroy();
            return res.json({ ok: true });
        }
    }
}

export default new UserController();
