import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/coach(.*)", "/onboarding"]);

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
    if (isSignInPage(request) && convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/onboarding"); // Redirect to onboarding to check role
    }

    if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
