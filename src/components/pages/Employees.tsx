import React, {useRef, useState} from 'react'
import EmployeesService from "../../services/EmployeesService";

import Topbar from "../library/Topbar";
import {employeesMenu} from "../../config/Menu";
import {HeaderDescription, MyTable} from "../library/MyTable";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmationDialog from "../library/ConfirmDialog";
import {Backdrop, Fade, Modal, Paper, Theme} from "@material-ui/core";
import EmployeeForm from "../EmployeeForm";
import {makeStyles} from "@material-ui/core/styles";
import EmployeeView from "../../models/EmployeeView";
import Employee from "../../models/EmployeeType";
import EmployeeServiceObservable from "../../services/EmployeeServiceObservable";
type Props = {
    service: EmployeeServiceObservable;
    employees: Employee[];
    refreshFn?: () => void
}
function toEmployeeFromEmployeeView(employee: EmployeeView): Employee {
    return {birthDate: new Date(employee.birthDate),
        department: employee.department,
        education: employee.education, id: employee.id,
        name: employee.name, salary: employee.salary};
}
function toEmployeeViewFromEmployee(employee: Employee): EmployeeView{
    return {birthDate: (employee.birthDate as Date).toString(),
    department: employee.department,
        education: employee.education, id: employee.id,
        name: employee.name, salary: employee.salary};
}
export function toEmployeesView(employees: Employee[]): EmployeeView[] {
    return employees.map(toEmployeeViewFromEmployee);
}
const useStyles = makeStyles((theme: Theme) =>
    ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
        },

    }));

const Employees: React.FC<Props> = (props: Props) => {
    const classes = useStyles()
    const [open, setOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<{open:boolean,
        employee:Employee|undefined}>({open:false,
        employee: undefined});
    const idRef = useRef<number>(0);
    const headers: Map<string, HeaderDescription> = new Map([
        ['id',{displayName: 'ID', numeric: false}],
        ['name', {displayName: 'Name', numeric: false}],
        ['salary', {displayName: 'Salary', numeric: true}],
        ['department', {displayName: 'Department', numeric: false}],
         ['birthDate', {displayName: 'Birth Date', numeric: true}],
    ]);

    function removeEmployee(emplObj: object) {
        idRef.current = (emplObj as Employee).id

        setOpen(true);


    }
    async function onClose(res: boolean) {
        setOpen(false);
        if (res) {
            await props.service.removeEmployee(idRef.current);
            !!props.refreshFn && props.refreshFn()
        }
    }
    function handleModalClose() {
        modal.open = false;
        setModal({...modal});
    }
    function editEmployee(obj: object) {
        const employeeView = obj as EmployeeView;

        setModal({open:true, employee: toEmployeeFromEmployeeView(employeeView)});
    }
    async function updateEmployee(employee: Employee): Promise<string> {
        const result = await props.service.updateEmployee(employee.id,
            employee);

        if (result) {
            !!props.refreshFn && props.refreshFn();
            handleModalClose();
            return '';
        }

        return `Employee with id: ${employee.id} doesn't exist`;
    }

    return <React.Fragment>
        <Topbar menu={employeesMenu}/>
        <MyTable headers={headers} rows={toEmployeesView(props.employees)} actions={[{icon: <DeleteIcon/>, actionFn: removeEmployee},
            {icon: <EditIcon/>, actionFn: editEmployee}]}/>
            <ConfirmationDialog title={'You are going remove'} open={open}
                                content={`employee with id ${idRef.current}`} onClose={onClose}/>
        <Modal
            className={classes.modal}
            open={modal.open}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={modal.open}>
                <div className={classes.paper}>
                    <EmployeeForm onSubmit={updateEmployee} employee={modal.employee} onCancel={handleModalClose}/>
                </div>

            </Fade>
        </Modal>
    </React.Fragment>
}
export default Employees;
