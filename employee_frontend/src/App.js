import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';

import {AppTopbar} from './AppTopbar';

import {AppMenu} from './AppMenu';
import {AppConfig} from './AppConfig';


import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';
import {AuthContext} from './context/AuthContext'
import {useAuth} from "./hook/auth.hook";
import {Loader} from "./components/Loader";
import {useRoutes} from "./router";

export const TYPE = {
    'email': 1,
    'phone': 2,
    'account': 3,
    'mobile': 4,
    'special': 5,
}

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        // {
        //     label: 'Главная',
        //     items: [{
        //         label: 'Доска', icon: 'pi pi-fw pi-home', to: '/'
        //     }]
        // },
        {
            label: 'Работники', icon: 'pi pi-fw pi-sitemap',
            items: [
                {label: 'Обычные', icon: 'pi pi-fw pi-id-card', to: '/accounts_regular'},
                {label: 'Специальные', icon: 'pi pi-fw pi-check-square', to: '/accounts_specific'},
            ]
        },
        {
            label: 'Оборудование', icon: 'pi pi-fw pi-sitemap',
            items: [
                {label: 'Сервера', icon: 'pi pi-fw pi-id-card', to: '/accounts_regular'},
            ]
        },
        {
            label: 'Настройка',
            items: [
                {label: 'Позиции', icon: 'pi pi-fw pi-home', to: '/position'},
                {label: 'Филиалы', icon: 'pi pi-fw pi-home', to: '/filial'},
                {label: 'Статусы', icon: 'pi pi-fw pi-home', to: '/status'},
                {label: 'Акаунты', icon: 'pi pi-fw pi-home', to: '/account_type'},
            ]
        },

        {
            label: 'Страницы', icon: 'pi pi-fw pi-clone',
            items: [
                {label: 'Форма входа', icon: 'pi pi-fw pi-circle-off', to: '/login'},
                {label: 'CSV', icon: 'pi pi-fw pi-circle-off', to: '/csv'}
            ]
        },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    const {accessToken, login, logout, ready} = useAuth()
    const isAuthenticated = !!accessToken
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader/>
    }

    // const isAuthPage = (isAuthenticated) => {
    //   if(isAuthenticated){
    //       return (<>
    //               <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
    //                          mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>
    //               <div className="layout-sidebar" onClick={onSidebarClick}>
    //                   <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
    //               </div>
    //               <div className="layout-main-container">
    //                   <div className="layout-main">
    //                       <Route path="/" component={TableSimple} exact/>
    //                       <Route path="/login" component={LoginForm}/>
    //                       <Route path="/accounts_regular" component={TableSimple}/>
    //                       <Route path="/accounts_specific" component={TableSpecial}/>
    //                       <Route path="/csv" component={Basket}/>
    //                       <Route path="/position" component={Position}/>
    //                       <Route path="/status" component={Status}/>
    //                       <Route path="/filial" component={Filial}/>
    //                       <Route path="/account_type" component={AccountType}/>
    //                       <Route path="/logout" component={Logout}/>
    //                       <Redirect to={"/accounts_regular"} />
    //                   </div>
    //               </div>
    //           </>
    //       )
    //   }else {
    //       return (
    //           <div className="layout-main-container">
    //               <div className="layout-main">
    //               <Route path="/login" component={LoginForm} exact/>
    //               <Redirect to={"/login"} />
    //           </div>
    //       </div>)
    //   }
    // }

    const isAuthenticated_mod = (val) =>{
         if (val){
            return <>{mainMenu()}
                    <div className="layout-main-container" style={{height: 'calc(100vh - 9px)'}}>
                                    <div className="layout-main">
                                        {routes}
                                    </div>
                                </div>
                                </>
         }
                    
            return <div className="layout-main-container" style={{marginLeft: '0px'}}>
                        <div className="layout-main">
                            {routes}
                        </div>
                    </div>
    

    }
    const mainMenu = () => {
        return (<><AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                             mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>
            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
            </div>
        </>)
    }
    return (
        <AuthContext.Provider value={{
            accessToken, login, logout, isAuthenticated
        }}>
            <div className={wrapperClass} onClick={onWrapperClick}>
                
                {isAuthenticated_mod(isAuthenticated)}
                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                           layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}/>
                <CSSTransition classNames="layout-mask" timeout={{enter: 200, exit: 200}} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"/>
                </CSSTransition>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
