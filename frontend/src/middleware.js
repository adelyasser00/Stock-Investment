import { authMiddleware } from "@clerk/nextjs";

console.log("inside middleware")
export default authMiddleware({
    // Routes that can always be accessed, and have
    // no authentication information
    ignoredRoutes: ['/no-auth-in-this-route'],
    publicRoutes:['/api/webhooks/clerk']

});

export const config = {
    // Protects all routes, including api/trpc.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};