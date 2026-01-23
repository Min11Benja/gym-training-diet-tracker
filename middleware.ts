import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/auth", "/login"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/coach(.*)", "/onboarding"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    console.log("Middleware executing for:", request.nextUrl.pathname);
    if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/onboarding"); // Redirect to onboarding to check role
    }

    if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/login");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
