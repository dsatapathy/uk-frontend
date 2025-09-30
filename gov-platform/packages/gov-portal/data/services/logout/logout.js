import { http } from "../bootstrap";

/**
 * Logs out the current user by calling the backend API, clearing storage, and redirecting to login.
 */
export async function handleLogoutService() {
    const token = http().getAccessToken();

    try {
        await http().request({
            url: "v1/auth/logout", // Use full URL if needed
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert("You have been logged out successfully !!!");
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    } catch (err) {
        alert("Error while logging out.");
        console.error("Logout error:", err);
        
    }
}