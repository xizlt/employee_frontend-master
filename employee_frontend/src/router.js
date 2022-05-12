import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {TableSimple} from "./components/TableSimple";
import {LoginForm} from "./pages/LoginForm";
import {TableSpecial} from "./components/TableSpecial";
import {Basket} from "./pages/CSV";
import {Position} from "./pages/add_on/Position";
import {Status} from "./pages/add_on/Status";
import {Filial} from "./pages/add_on/Filial";
import {AccountType} from "./pages/add_on/AccountType";


export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/accounts_regular" component={TableSimple} exact/>
                <Route path="/accounts_specific" component={TableSpecial}/>
                <Route path="/csv" component={Basket}/>
                <Route path="/position" component={Position}/>
                <Route path="/status" component={Status}/>
                <Route path="/filial" component={Filial}/>
                <Route path="/account_type" component={AccountType}/>
                <Redirect to={"/accounts_regular"}/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <LoginForm />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
