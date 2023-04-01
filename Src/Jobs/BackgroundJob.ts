import userModel from '../models/user.model';
class BackgroundJob {
    public static async SendEmail() {
        var users = await userModel.find();

        users.forEach((user) => {
            console.log(user.email);
        });
        console.log('Sending email...');
    }
}

export default BackgroundJob;
