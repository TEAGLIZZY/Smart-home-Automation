import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/alarms" activeStyle>
                        Alarms
                    </NavLink>
                    <NavLink to="/heating" activeStyle>
                        Heating
                    </NavLink>
                    <NavLink to="/lights" activeStyle>
                        Lights
                    </NavLink>
                    <NavLink to="/water" activeStyle>
                        Water
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;