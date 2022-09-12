/**
 * Store a value with a expiring date
 * @param ttl Minutes until it expires
 */
export function setWithExpiry(key: string, value: any, ttl: number = 5) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.setMinutes(now.getMinutes() + ttl),
    }
    localStorage.setItem(key, JSON.stringify(item))
}

export function getWithExpiry<T>(key: string, deleteOnExpired: boolean = true): { data: T, expired: boolean } {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    const expired = now.getTime() > item.expiry;
    if (deleteOnExpired && expired) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
    }
    return { data: item.value, expired };
}
