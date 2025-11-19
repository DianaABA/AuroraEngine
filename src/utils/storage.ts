export function getItem(key:string){ try { return localStorage.getItem(key) } catch { return null } }
export function setItem(key:string,v:string){ try { localStorage.setItem(key,v) } catch {} }
export function removeItem(key:string){ try { localStorage.removeItem(key) } catch {} }
