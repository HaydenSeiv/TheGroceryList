export function isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if it's a valid JWT structure (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
        // Check if the payload can be decoded (doesn't verify signature)
        const payload = JSON.parse(atob(parts[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Clean up expired token
            return false;
        }
        
        return true;
    } catch {
        localStorage.removeItem('token'); // Clean up invalid token
        return false;
    }
}   