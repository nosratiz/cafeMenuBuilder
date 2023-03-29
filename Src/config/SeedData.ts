import userModel from '../models/user.model';
import roleModel from '../models/role.model';

class SeedData {
    public async seed() {
        await this.seedRole();
        await this.seedUser();
    }

    private async seedRole() {
        if ((await roleModel.countDocuments()) == 0) {
            await roleModel.create({
                name: 'admin',
            });
            await roleModel.create({
                name: 'user',
            });
        }
    }

    private async seedUser() {
        if ((await userModel.countDocuments()) == 0) {

            var roleId = await roleModel.findOne().select('_id');
            await userModel.create({
                email: 'nimanosrati93@gmail.com',
                name: 'Nima',
                family: 'Nosrati',
                mobile: '09107602786',
                password: 'nima1234!',
                status: 'active',
                confirmEmail: true,
                confirmMobile: true,
                roles: [roleId],
            });
        }
    }
}

export default SeedData;
