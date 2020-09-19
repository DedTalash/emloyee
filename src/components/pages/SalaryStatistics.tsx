import React, {useState, useRef, useEffect} from 'react';
import Employee from "../../models/EmployeeBase";
import {employeesMenu} from "../../config/Menu";
import Topbar from "../library/Topbar";
import Grid from "@material-ui/core/Grid";
import {Button, Container, TextField} from "@material-ui/core";
import _ from 'lodash';
import {MyTable, HeaderDescription} from "../library/MyTable";

type Props = {
    employees: Employee[];
}
const SalaryStatistic: React.FC<Props> = (props: Props) => {

    const [intervalCurrent, setIntervalCurrent] = useState<number>(1000);
    const [interval, setInterval] = useState<number>(1000);

    const headers: Map<string, HeaderDescription> = new Map([
        ['min',{displayName: 'Min salary', numeric: true}],
        ['max', {displayName: 'Max salary', numeric: true}],
        ['amount', {displayName: 'Number of Employees', numeric: true}],
    ]);

    function groupBySalary(arr:Employee[], interval: number): {min: number, max: number, amount: number}[] {
        let res = _.chain(arr).map(o => (Math.floor(o.salary / interval))).countBy().entries()
            .map(o => {
                return {
                    min: +o[0] * interval,
                    max: +o[0] * interval + interval - 1,
                    amount: o[1]
                }
            })
            .value();

        return res;
    }

    function onChange(event: any) {
        setIntervalCurrent(+event.target.value);
    }

    function onSubmit(event: any){
        setInterval(intervalCurrent);
    }

    return <React.Fragment>
        <Topbar menu={employeesMenu}/>
        <Container maxWidth="xs">
            <form onSubmit={onSubmit} >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth value={intervalCurrent} onChange={onChange} label="Interval of salary" type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"contained"} color={"primary"} type="submit">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
        <MyTable headers={headers} rows={groupBySalary(props.employees, interval)}/>
    </React.Fragment>
}

export default SalaryStatistic;
