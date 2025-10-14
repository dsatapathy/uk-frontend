import { http } from "../bootstrap";

/**
 * Logs out the current user by calling the backend API, clearing storage, and redirecting to login.
 */
export async function handleLogoutService() {
    const token = http().getAccessToken();

    try {
        const response = await http().request({
            url: "v1/auth/logout", // Use full URL if needed
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Logout Data", response);
        if (response.status === 200) {
            return true;
        } else {
            throw new Error("Logout failed");
        }
    } catch (err) {
        console.error("Logout error:", err);
        
    }
}