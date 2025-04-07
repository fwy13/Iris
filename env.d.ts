namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;
        readonly TURNSTILE_SECRET: string;
        readonly JWT_SECRET: string;
        readonly EMAIL_USER: string;
        readonly EMAIL_PASSWORD: string;
    }
}