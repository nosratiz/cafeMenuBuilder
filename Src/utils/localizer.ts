import path from 'path';
import fs from '@supercharge/fs';

class Localizer {

    public get(key: string): string {

        console.log(key);
       const allMessages= fs.readJsonSync(
            path.join(__dirname, `../../ResponseMessage.json`),
            'utf8'
        );

        console.log(allMessages.Data);
        var responseMessage= allMessages.Data.find((item: any) => item.Key === key);
        console.log(responseMessage.Template);

        return responseMessage.Template ?? "undefined";
    }
}

export default new Localizer();
