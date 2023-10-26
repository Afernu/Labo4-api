import * as utilities from "./utilities.js";
import * as serverVariables from "./serverVariables.js";
import { log } from "./log.js";
let repositoryCachesExpirationTime = serverVariables.get("main.repository.CacheExpirationTime");

// Repository file data models cache
globalThis.repositoryCaches = [];

export default class CachedRequestsManager {
    static add(url, content, ETag = "") {
        /* mise en cache */ 
    }
    static find(url) {
        /* retourne la cache associée à l'url */ 
    }
    static clear(url) {
        /* efface la cache associée à l’url */ 
    }
    static flushExpired(url) {
        /* efface les caches expirées */ 
    }
    static get(HttpContext) {
        /*
        Chercher la cache correspondant à l'url de la requête. Si trouvé,
        Envoyer la réponse avec 
        HttpContext.response.JSON( paylod, ETag, true /* from cache */
    }
}