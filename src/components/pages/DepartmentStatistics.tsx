import React from 'react';
import Employee from "../../models/EmployeeBase";
import {employeesMenu} from "../../config/Menu";
import Topbar from "../library/Topbar";
import _ from 'lodash';
import {HeaderDescription, MyTable} from "../library/MyTable";
type Props = {
    employees: Employee[];
}

const DepartmentStatistic: React.FC<Props> = (props: Props) => {
    const headers: Map<string, HeaderDescription> = new Map([
        ['department',{displayName: 'Department', numeric: false}],
        ['numOfEmpl', {displayName: 'Number of Employees', numeric: true}],
    ]);

    const stat = _.countBy(props.employees, 'department');
    const result = Object.keys(stat).map((key) => {
        return {department: key, numOfEmpl: stat[key]}
    });

    return <React.Fragment>
        <Topbar menu={employeesMenu}/>
        <MyTable headers={headers} rows={result}/>
    </React.Fragment>;
}
export default DepartmentStatistic;
