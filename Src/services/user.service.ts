import UserModel from '../models/user.model';
import token from '../utils/token';

class UserService {
    private user = UserModel;

    public async adminLogin(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email: email });

            if (!user) {
                throw new Error('invalid credentials');
            }

            if ((await user.isValidPassword(password)) === false) {
                throw new Error('invalid credentials');
            }

            return token.createToken(user);
        } catch (error) {
            console.log(error);

            throw new Error('something went wrong');
        }
    }
}

export default UserService;
