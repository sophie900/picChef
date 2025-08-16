// import { useState } from 'react';
import NavItem from "./NavItem";

const NavBar = () => {
  // const [activePage, setActivePage] = useState<String>('');

  return (
    <nav className="absolute top-0 flex justify-between gap-8 px-2 py-4 mt-6">
      <NavItem route="/" name="Home"/>
      <NavItem route="/saved" name="Saved Recipes"/>
    </nav>
  )
}


export default NavBar;
