import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("components/layout-home.tsx",[
         index("routes/home.tsx"),
         route("error/401","errors/401.tsx"),
         route("error/403","errors/403.tsx"),
         route("error/500","errors/500.tsx"),
         route("error/503","errors/503.tsx"),
         route("*","errors/404.tsx"),
        ]),

   ...prefix("dashboard", [
    layout("components/layout.tsx",[
        index("routes/dashboard.tsx"),
        route("product","routes/product.tsx"),
        route("error/401","errors/dashboard/401.tsx"),
         route("error/403","errors/dashboard/403.tsx"),
         route("error/500","errors/dashboard/500.tsx"),
         route("error/503","errors/dashboard/503.tsx"),
         route("*","errors/dashboard/404.tsx"),
    ]),
   ])
    

] satisfies RouteConfig;
