import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("components/layout-home.tsx",[
         index("routes/home.tsx"),
        ]),

   ...prefix("dashboard", [
    layout("components/layout.tsx",[
        index("routes/dashboard.tsx"),
        route("product","routes/product.tsx"),
    ]),
   ])
    

] satisfies RouteConfig;
