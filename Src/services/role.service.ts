import roleModel from '../models/role.model';
import RedisExtensions from '../utils/redis';

class RoleService {
    public async getRole() {
        const redis = new RedisExtensions();
        const roles= await roleModel.find().exec();
        await redis.set('roles', JSON.stringify(roles), 3600);

        return roles;
    }
}

export default RoleService;
