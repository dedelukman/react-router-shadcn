import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [

     route("login","routes/login.tsx"),
     route("signup","routes/signup.tsx"),

    layout("components/website/layout.tsx",[
         index("routes/website/index.tsx"),


         route("error/401","routes/website/errors/401.tsx"),
         route("error/403","routes/website/errors/403.tsx"),
         route("error/500","routes/website/errors/500.tsx"),
         route("error/503","routes/website/errors/503.tsx"),
         route("*","routes/website/errors/404.tsx"),
        ]),

   ...prefix("dashboard", [
    layout("components/dashboard/layout/index.tsx",[
        index("routes/dashboard/index.tsx"),
        route("settings","routes/dashboard/settings.tsx"),
        route("getHelp","routes/dashboard/gethelp.tsx"),
        route("search","routes/dashboard/search.tsx"),
        route("account","routes/dashboard/account.tsx"),
        route("billing","routes/dashboard/billing.tsx"),
        route("notifications","routes/dashboard/notifications.tsx"),


        route("error/401","routes/dashboard/errors/401.tsx"),
         route("error/403","routes/dashboard/errors/403.tsx"),
         route("error/500","routes/dashboard/errors/500.tsx"),
         route("error/503","routes/dashboard/errors/503.tsx"),
         route("*","routes/dashboard/errors/404.tsx"),
    ]),
   ])
    

] satisfies RouteConfig;
