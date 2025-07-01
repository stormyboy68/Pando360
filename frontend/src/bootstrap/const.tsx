export const APP_NAME = "Pando360";
export const VersionRoute = "/v1";
export const VersionRoute_CRYPTO = "/v1";
export const VersionRoute_AUTH = "/v1";
export const VersionRoute_USER = "/v1";
export const VersionRoute_ADMIN = "/v1";
export const VersionRoute_SUBSCRIPTION = "/v1";
export const VersionRoute_TYPE = "/v1";

export const BASE_URL = process.env.NODE_ENV === "production"
    ?  process.env.YOUR_DOMAIN+":3000" 
    : "http://localhost";

export const SERVER_URL = process.env.YOUR_DOMAIN+":8000/api";


export const API = BASE_URL + "/api" + VersionRoute;

export const REMEMBER_ME = 30
export const DELAY_NEXT_RESEND_SMS = 10