import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [

     route("login","routes/login.tsx"),
     route("signup","routes/signup.tsx"),

    layout("routes/home/layout.tsx",[
         index("routes/home/index.tsx"),


         route("error/401","routes/home/errors/401.tsx"),
         route("error/403","routes/home/errors/403.tsx"),
         route("error/500","routes/home/errors/500.tsx"),
         route("error/503","routes/home/errors/503.tsx"),
         route("*","routes/home/errors/404.tsx"),
        ]),

   ...prefix("dashboard", [
    layout("routes/dashboard/layout.tsx",[
        index("routes/dashboard/index.tsx"),
        route("settings","routes/dashboard/pages/settings/index.tsx"),
        route("getHelp","routes/dashboard/pages/gethelp.tsx"),
        route("search","routes/dashboard/pages/search.tsx"),
        route("account","routes/dashboard/pages/account.tsx"),
        route("billing","routes/dashboard/pages/billing.tsx"),
        route("notifications","routes/dashboard/pages/notifications.tsx"),


        route("error/401","routes/dashboard/errors/401.tsx"),
         route("error/403","routes/dashboard/errors/403.tsx"),
         route("error/500","routes/dashboard/errors/500.tsx"),
         route("error/503","routes/dashboard/errors/503.tsx"),
         route("*","routes/dashboard/errors/404.tsx"),
    ]),
   ])
    

] satisfies RouteConfig;
