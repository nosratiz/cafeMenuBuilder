import HttpException from '../utils/exception/http.exceptions';
import IPagination from '../utils/interfaces/pagination.interface';
import UserModel from '../models/user.model';
import token from '../utils/token';
import UserDto, { IUserDto } from '../dto/UserDto';

class UserService {
    private user = UserModel;

    public async adminLogin(
        email: string,
        password: string
    ): Promise<string | HttpException> {
        try {
            const user = await this.user
            .findOne({ email: email })
            .populate('roles')
            .select('email password id status roles');

            if (!user) {
                throw new HttpException(400,'invalid credentials');
            }

            if ((await user.isValidPassword(password)) === false) {
                throw new HttpException(400,'invalid credentials');
            }

            return token.createToken(user);
        } catch (error) {
            console.log(error);

            throw new Error('something went wrong');
        }
    }

    public async findAll(page: number, limit: number): Promise<IPagination> {
        try {
            const [users, count] = await Promise.all([
                this.user
                    .find({ isDeleted: false })
                    .select(
                        '-password -isDeleted -birthday -confirmCode -confirmCodeExpire'
                    )
                    .skip((page - 1) * limit)
                    .limit(limit),
                this.user.countDocuments({ isDeleted: false }),
            ]);

            const userDto = users.map((user) =>
                new UserDto().userListDto(user)
            );

            console.log(userDto);

            const userPaginationDto: IPagination = {
                page: page,
                limit: limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                data: userDto,
            };

            return userPaginationDto;
        } catch (error) {
            console.log(error);

            throw new Error('something went wrong');
        }
    }

    public async findOne(id: string): Promise<IUserDto  | HttpException> {
        console.log(id);
        try {
            const user = await this.user
                .findOne({ _id: id, isDeleted: false })
                .populate({ path: 'roles', model: 'Role' })
                .select('-password');

            

            if (!user) {
               return new HttpException(404, 'user not found');
            }

            return new UserDto().mapToUserDto(user);
        } catch (error) {
            console.log(error);
            throw new HttpException(404, 'user not found');
        }
    }
}

export default UserService;
