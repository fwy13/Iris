namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;

        readonly RECAPTCHA_SECRET: string;
        readonly RECAPTCHA_SECRET: string;
        
        readonly JWT_SECRET: string;

        readonly EMAIL_USER: string;
        readonly EMAIL_PASSWORD: string;
    }
}