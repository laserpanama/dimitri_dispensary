export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  try {
    // Use environment variables or sensible defaults
    const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3001";
    const appId = import.meta.env.VITE_APP_ID || "dimitri-dispensary";
    
    // Basic validation
    if (!oauthPortalUrl || !appId) {
      console.warn("OAuth configuration missing");
      return "/login";
    }

    // Construct redirect URI
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    // Build auth endpoint URL safely
    const baseUrl = oauthPortalUrl;
    const authPath = "/app-auth";
    const separator = baseUrl.endsWith("/") ? "" : "/";
    const fullUrl = `${baseUrl}${separator}${authPath}`;
    
    const url = new URL(fullUrl);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to construct login URL:", error);
    return "/login";
  }
};
