// import * as React from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
// import { Button } from '@/components/ui/button';

export default function Navbar() {
  // const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  // const navigate = useNavigate();

  const links = [
    { name: 'App', href: '/app' },
    { name: 'News', href: '/app/news' },
    { name: 'Logout', href: '/api/logout' },
  ];

  return (
    <ul className="flex flex-row gap-2 flex-1 items-center">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.href}>
            <Button variant="outline" size="sm">
              {link.name}
            </Button>
          </Link>
        </li>
      ))}
      <Button variant="default" size="sm" className="ml-auto">
        Menu profile
      </Button>
    </ul>
  );
}
