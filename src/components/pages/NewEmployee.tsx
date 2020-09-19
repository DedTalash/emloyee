import React, {useState} from "react";
import EmployeesService from "../../services/EmployeesService";
import Employee from "../../models/EmployeeType";
import { Redirect } from "react-router-dom";
import {PATH_HOME} from "../../config/Menu";
import EmployeeForm from "../EmployeeForm";
import EmployeeServiceObservable from "../../services/EmployeeServiceObservable";
type Props = {
    service: EmployeeServiceObservable,
    employees: Employee[],
    refreshFn?: () => void,
    backPath?: string
}
const NewEmployee: React.FC<Props> = (props: Props) => {
    const [backFl, setBackFl] = useState<boolean>(false);
    async function onSubmit(empl: Employee):Promise<string> {
        const res = await props.service.addEmployee(empl);
        if (res) {
            setBackFl(true);
            !!props.refreshFn && props.refreshFn();
            return '';
        }
        return `employee with id ${empl.id} already exists`
    }
    return <React.Fragment>
        <EmployeeForm employees={props.employees} onSubmit={onSubmit}/>
        {backFl && <Redirect to={props.backPath || PATH_HOME}/>}
    </React.Fragment>
}
export default NewEmployee;
