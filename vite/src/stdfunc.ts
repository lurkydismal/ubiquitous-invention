// import { isDev } from './stdvar';
import { log } from './stdlog';
// import { user as devUser } from './testdata';
//
// interface UserCredentials {
//     id: number;
//     username: string;
// }
//
// export function storeCredentials(credentials: UserCredentials) {
//     if (isDev) {
//         log.debug('Skipping credential store in dev');
//
//         return;
//     }
//
//     log.debug(`Storing credentials for '${credentials.username}'`);
//
//     localStorage.setItem('id', String(credentials.id));
//     localStorage.setItem('username', credentials.username);
// }
//
// export function getCredentials(): UserCredentials {
//     if (isDev) {
//         log.debug(`Returning dev credentials: ${devUser}`);
//
//         return devUser;
//     }
//
//     const id = localStorage.getItem('id');
//     const username = localStorage.getItem('username');
//
//     if (!id || !username) {
//         log.error('Missing credentials');
//
//         throw new Error(`Getting credentials failed`);
//     }
//
//     return {
//         id: Number(id),
//         username,
//     };
// }

export function paginate<T>(
    items: T[],
    currentPage: number,
    perPage: number,
): T[] {
    log.trace(`Paginate page=${currentPage} size=${perPage}`);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
}
