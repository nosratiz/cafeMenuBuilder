import userModel from '../models/user.model';
import roleModel from '../models/role.model';
import restaurantModel from '../models/restaurant.model';
import menuModel from '../models/menu.model';

class SeedData {
    public async seed() {
        await this.seedRole();
        await this.seedUser();
        await this.seedRestaurant();
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

    private async seedRestaurant() {
        if ((await restaurantModel.countDocuments()) == 0) {
            var userId = await userModel.findOne().select('_id');
            await restaurantModel.create({
                name: 'KFC',
                description: 'KFC',
                logo: 'logo',
                location: {
                    type: 'Point',
                    coordinates: [51.389, 35.6892],
                },
                address: {
                    city: 'Tehran',
                    state: 'Tehran',
                    street: 'jordan',
                    phone: '021-12345678',
                },
                userId: userId,
            });
        }
    }

    private async seedMenu() {
        if ((await menuModel.countDocuments()) == 0) {
            var restaurantId = await restaurantModel.findOne().select('_id');
            await menuModel.create({
               title:'pizza',
                description:'pizza',
                price:10000,
                image:'image',
                restaurantId:restaurantId
             
            });
        }
    }
    
}

export default SeedData;
