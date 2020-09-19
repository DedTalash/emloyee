import React, {useEffect, useState} from 'react';
import EmployeesService from "./services/EmployeesService";
import EmployeesServiceMapImpl from "./services/EmployeesServiceMapImpl";
import Employee from "./models/EmployeeType";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {
    employeesMenu,
    PATH_ADD_EMPLOYEE, PATH_DEPARTMENT_STATISTICS,
    PATH_EMPLOYEES,
    PATH_GENERATION,
    PATH_HOME, PATH_LOGIN,
    PATH_SALARY_STATISTICS, PATH_SEARCH
} from "./config/Menu";
import Home from "./components/pages/Home";
import Employees from "./components/pages/Employees";
import NewEmployee from "./components/pages/NewEmployee";
import EmployeesGeneration from "./components/pages/EmployeesGeneration";
import SalaryStatistics from "./components/pages/SalaryStatistics";
import DepartmentStatistics from "./components/pages/DepartmentStatistics";
import EmployeesSearch from "./components/pages/EmployeesSearch";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import EmployeeServiceObservable from "./services/EmployeeServiceObservable";
import EmployeesServiceRest from "./services/EmployeesServiceRest";
import {AUTH_SERVER_URL, SERVER_URL} from "./config/server-config";

import usePoller from "./util/poller";
import {POLLING_INTERVAL} from "./config/consts";
import AuthService, {UserData} from "./services/AuthService";
import AuthServiceRest from "./services/AuthServiceRest";
import Login from "./components/pages/Login";

const service: EmployeeServiceObservable = new EmployeesServiceRest(SERVER_URL);
const authService: AuthService = new AuthServiceRest(AUTH_SERVER_URL);

function App(): JSX.Element {
  const [employees] = usePoller<Employee[]>(service, service.getAllEmployees,[], POLLING_INTERVAL)
    const [userData] = usePoller<UserData>(authService,  authService.getUserData,
        {isAdmin: false,user: ''})
    const theme: Theme = createMuiTheme({
        spacing: 8
    })
    return <ThemeProvider theme={theme}>
        <HashRouter>
            <Redirect to={!!userData.user ? PATH_HOME : PATH_LOGIN}/>
            <Switch>
                <Route path={PATH_HOME} exact component={Home}/>
                <Route path={PATH_LOGIN} exact render={() => {
                    return <Login authService={authService}/>
                }}/>
                <Route path={PATH_EMPLOYEES} exact render={() =>
                    <Employees service={service} employees={employees}/>}/>
                <Route path={PATH_ADD_EMPLOYEE} exact render={() =>
                    <NewEmployee service={service}
                                 employees={employees as Employee[]}
                                 backPath={PATH_EMPLOYEES}/>}/>
                <Route path={PATH_GENERATION} exact render={() => <EmployeesGeneration
                    service={service}/>}/>
                <Route path={PATH_SALARY_STATISTICS} exact render={
                    () => <SalaryStatistics employees={employees}
                    />}/>
                <Route path={PATH_DEPARTMENT_STATISTICS} exact render={
                    () => <DepartmentStatistics employees={employees}
                    />}/>
                <Route path={PATH_SEARCH} exact render={
                    () => <EmployeesSearch employees={employees}
                    />}/>
            </Switch>
        </HashRouter>
    </ThemeProvider>

}

export default App;
