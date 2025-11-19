export function getItem(key) { try {
    return localStorage.getItem(key);
}
catch {
    return null;
} }
export function setItem(key, v) { try {
    localStorage.setItem(key, v);
}
catch { } }
export function removeItem(key) { try {
    localStorage.removeItem(key);
}
catch { } }
