import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

export const msalConfig: Configuration = {
    auth: {
        clientId: environment.clientId,
        authority: `https://login.microsoftonline.com/${environment.tenantId}`,
        redirectUri: '/',
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false
        }
    }
}

export const protectedResources = {
    linkApi: {
        endpoint: environment.elfApiBaseUrl + "/api/link",
        scopes: [`${environment.applicationIdUri}/access_as_user`]
    },
    reportApi: {
        endpoint: environment.elfApiBaseUrl + "/api/report",
        scopes: [`${environment.applicationIdUri}/access_as_user`]
    }
}

export const loginRequest = {
    scopes: []
};