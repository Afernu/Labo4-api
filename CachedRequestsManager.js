import * as utilities from "./utilities.js";
import * as serverVariables from "./serverVariables.js";
import { log } from "./log.js";

let cachedCachesExpirationTime = serverVariables.get("main.repository.CacheExpirationTime");

// Repository file data models cache
globalThis.cachedRepositoryCaches = [];

export default class CachedRequestsManager {
    static add(url, content, ETag = "") {
        console.log("Ajout dans la cache avec l'URL associé :", url);
        globalThis.cachedRepositoryCaches.push({
            url,
            content,
            ETag,
            expireTime: utilities.nowInSeconds() + cachedCachesExpirationTime
        });
    }

    static find(url) {
        console.log("Extraction de la cache avec l'URL associé :", url);
        const cache = globalThis.cachedRepositoryCaches.find(item => item.url === url);
        return cache ? cache : null;
    }

    static clear(url) {
        console.log("Retrait de cache expirée avec l'URL associé :", url);
        globalThis.cachedRepositoryCaches = globalThis.cachedRepositoryCaches.filter(item => item.url !== url);
    }

    static flushExpired() {
        console.log("Flushing expired caches...");
        const currentTime = utilities.nowInSeconds();
        globalThis.cachedRepositoryCaches = globalThis.cachedRepositoryCaches.filter(item => item.expireTime > currentTime);
    }

    static get(HttpContext) {
        const url = HttpContext.req.url;
        const cachedData = CachedRequestsManager.find(url);
        if (cachedData) {
            const { content, ETag } = cachedData;
            console.log("Données extraites de la cache pour l'URL :", url);
         
            HttpContext.response.JSON(content, ETag, true /* from cache */);
        }
    }
}
// periodic cleaning of expired cached repository data
setInterval(CachedRequestsManager.flushExpired, cachedCachesExpirationTime * 1000);
log(BgWhite, FgBlack, "Periodic cached caches cleaning process started...v2");
