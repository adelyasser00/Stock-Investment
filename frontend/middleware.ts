import { authMiddleware } from "@clerk/nextjs";

console.log("inside middleware")
export default authMiddleware({
    publicRoutes:['/api/webhooks/clerk','/api/webhooks/test']

});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};