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

   ...prefix("app", [
    layout("components/panel/layout/index.tsx",[
        route("dashboard","routes/panel/dashboard.tsx"),
        route("settings","routes/panel/settings.tsx"),
        route("getHelp","routes/panel/gethelp.tsx"),
        route("search","routes/panel/search.tsx"),
        route("account","routes/panel/account.tsx"),
        route("billing","routes/panel/billing.tsx"),
        route("notifications","routes/panel/notifications.tsx"),


        route("error/401","routes/panel/errors/401.tsx"),
         route("error/403","routes/panel/errors/403.tsx"),
         route("error/500","routes/panel/errors/500.tsx"),
         route("error/503","routes/panel/errors/503.tsx"),
         route("*","routes/panel/errors/404.tsx"),
    ]),
   ])
    

] satisfies RouteConfig;
