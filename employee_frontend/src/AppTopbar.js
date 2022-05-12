import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import classNames from 'classnames';
import {AuthContext} from "./context/AuthContext";

export const AppTopbar = (props) => {

    const history = useHistory()
    const auth = useContext(AuthContext)


    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/login')
    }

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                {/*<img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo"/>*/}
                <span>Сотрудники</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <li>
                        <div className="p-link layout-topbar-button" onClick={logoutHandler}>
                            <i className="pi pi-sign-in"/>
                            <span>Выйти</span>
                        </div>
                    </li>
                </ul>
        </div>
    );
}
