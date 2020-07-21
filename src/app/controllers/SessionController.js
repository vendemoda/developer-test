import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as Yup from 'yup';

class SessionController {
    //Checks if the fields have been filled
    async store(req, res) {
        //Checks if the fields have been filled correctly
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required('Este campo é obrigatório.'),
            password: Yup.string()
                .required('Este campo é obrigatório.')
        });

        //Checks if the befored password have all characters of the rule
        if(!(await schema.isValid(req.body))) {
            console.log(req.body);
            return res.status(400).json({ error: 'A validação falhou.' });
        }

        //Abstraction of fields
        const { email, password } = req.body;

        //Checks for a user based on email
        const user = await User.findOne({where: { email } });

        //Checks if the befored email of user is correct
        if(!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        //Checks if the befored password of user is correct
        if(!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        //Abstraction of fields
        const { id, name } = user;

        //If everything is correct, it returns the user's abstracted information, and the token.
        return res.json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign(
                { id },
                authConfig.secret,
                { expiresIn: authConfig.expiresIn }
            ),
        })
    }
}

export default new SessionController();
