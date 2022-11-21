const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name:'development',
    asset_path: './assets',
    session_cookie_key:'HhEvRf6XCP3n7a0itpWFXGE3PueHbmTe',
    db: 'codeial_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        auth:{
            user:'singhdharvi111@gmail.com',
            pass: ''
        },
        tls: {rejectUnauthorized: false}
    },
    google_client_id:"762758718970-0luebpv6nbljptnj21qjs52rj413nv7b.apps.googleusercontent.com",
    googel_client_secret:"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",
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codf1vgmS5KkgMI0lWBZnUi9spmNtWjGXLOeial',
    morgan:{
        mode:'dev',
        Options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        auth:{
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        },
        tls: {rejectUnauthorized: false}
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    googel_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        Options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);