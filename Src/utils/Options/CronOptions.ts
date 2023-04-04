export class Options {
    static readonly every2Minutes = '*/2 * * * * *';
    
    static readonly production = 'production';
    static readonly development = 'development';


}

export class Limiter {
    static readonly max = 100;
    static readonly windowMs = 15 * 60 * 1000;
    static readonly message = 'Too many requests, please try again later.';
}