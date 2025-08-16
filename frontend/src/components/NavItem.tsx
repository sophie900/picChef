interface NavItemProps {
    route: string,
    name: string
}

const NavItem = ( { route, name } : NavItemProps ) => {
    return (
        <a href={route} className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-white/5 hover:text-gray-100">
            {name}
        </a>
    )
}

export default NavItem;
