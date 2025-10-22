import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Jual Gas' },
    { name: 'description', content: 'Welcome to Jual Gas!' },
  ];
}

export default function Home() {
  return <div>Helo World!</div>;
}
