// import * as React from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { ButtonGroup } from '../ui/button-group';
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';

export default function Navbar() {
  // const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  // const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between gap-2 w-full">
      <ButtonGroup aria-label="Button group">
        <Button variant="outline" size="icon" aria-label="Go back">
          <Link to="">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Button variant="outline" size="icon" aria-label="Go forward">
          <Link to="">
            <ArrowRightIcon />
          </Link>
        </Button>
      </ButtonGroup>

      {/* Input with button to search user */}
      <ButtonGroup className="flex w-full max-w-xl">
        <Input type="search" placeholder="Enter a name user to search..." />
        <Button variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>

      {/* Dropdown menu - menu of account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="indigo" aria-label="Open menu">
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-42" align="end">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Help</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
