// import { useState } from 'react';
import NavItem from "./NavItem";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

const { data: { user } } = await supabase.auth.getUser()
const user_email = user ? user.email : null

const NavBar = () => {
  // const [activePage, setActivePage] = useState<String>('');

  return (
    <nav className="absolute top-0 flex justify-between gap-8 px-2 py-4 mt-6">
      <NavItem route="/" name="Home"/>
      <NavItem route="/saved" name="Saved Recipes"/>
      
      { // Display contents of login widget
        !user_email ? <NavItem route="/login" name="Log In"/> : <NavItem route="/login" name={user_email}/>
      }
    </nav>
  )
}


export default NavBar;
