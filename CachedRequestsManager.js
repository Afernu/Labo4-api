import * as utilities from "./utilities.js";
import * as serverVariables from "./serverVariables.js";
import { log } from "./log.js";
let repositoryCachesExpirationTime = serverVariables.get("main.repository.CacheExpirationTime");

globalThis.repositoryCaches = [];

export default class CachedRequestsManager {
    static add(url, content, ETag = "") {
        cache.push({
            url,
            content,
            ETag,
        });
        console.log("Ajout dans la cache avec l'url associé: " + url);
    }

    static find(url) {
        return cache.find((entry) => entry.url === url);
    }

    static clear(url) {
        const indexToDelete = [];
        for (let endpoint of CachedRequests) {
            // target all entries related to the same APIendpoint url base
            if (endpoint.url.toLowerCase().indexOf(url.toLowerCase()) > -1)
                indexToDelete.push(index);
            index++;
        }

        for (const index of indexToDelete.reverse()) {
            cache.splice(index, 1);
        }
    }

    static flushExpired() {
        const now = Date.now() / 1000;
        const expiredCaches = cache.filter((entry) => entry.Expire_Time < now);

        for (const entry of expiredCaches) {
            console.log("Retrait de cache expirée avec l'URL associé: " + entry.url);
            const index = cache.indexOf(entry);
            if (index !== -1) {
                cache.splice(index, 1);
            }
        }
    }

    static get(HttpContext) {
        const url = HttpContext.request.url;
        const cacheEntry = CachedRequestsManager.find(url);

        if (cacheEntry) {
            // Cache trouvé, renvoyer la réponse avec les données de la cache
            HttpContext.response.JSON(cacheEntry.content, cacheEntry.ETag, true /* from cache */);
        } else {
            // Cache non trouvé, effectuer la requête normalement
            // ...
        }
    }
}