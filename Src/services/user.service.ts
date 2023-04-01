import HttpException from '../utils/exception/http.exceptions';
import IPagination from '../utils/interfaces/pagination.interface';
import UserModel from '../models/user.model';
import token from '../utils/token';
import UserDto from '../dto/UserDto';
import Localizer from '../utils/localizer';
import Result from '../dto/ResultDto';
import IResult from '../utils/interfaces/result.interface';

class UserService {
    private user = UserModel;

    public async adminLogin(email: string, password: string): Promise<IResult> {
        try {
            const result = new Result();
            const user = await this.user
                .findOne({ email: email })
                .populate('roles')
                .select('email password id status roles');

            if (!user) {
                result.status = 400;
                result.message = Localizer.get('InvalidUserOrPassword');
                return result;
            }

            if ((await user.isValidPassword(password)) === false) {
                result.status = 400;
                result.message = Localizer.get('InvalidUserOrPassword');
                return result;
            }

            result.data = token.createToken(user);

            return result;
        } catch (error) {
            console.log(error);
            throw new HttpException(500, 'Internal Server Error');
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

            const userDto = users.map((user) => UserDto.userListDto(user));

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

    public async findOne(id: string): Promise<IResult> {
        try {
            const result = new Result();
            const user = await this.user
                .findOne({ _id: id, isDeleted: false })
                .populate({ path: 'roles', model: 'Role' })
                .select('-password');

            if (!user) {
                result.status = 404;
                result.message = Localizer.get('UserNotFound');
                return result;
            }

            result.data = UserDto.mapToUserDto(user);
            return result;
        } catch (error) {
            console.log(error);
            throw new HttpException(404, 'user not found');
        }
    }
}

export default UserService;
