import {Axios} from "axios-observable";
import {map, catchError} from 'rxjs/operators';
import EmployeeServiceObservable from "./EmployeeServiceObservable";
import Employee from "../models/EmployeeType";
import {Observable, of} from "rxjs";
import {ACCESS_TOKEN} from "./AuthServiceRest";
export default class EmployeesServiceRest implements EmployeeServiceObservable {
    constructor(private url:string) {
    }
    addEmployee(empl: Employee): Promise<any> {
        return Axios.post<Employee>(this.url, empl, {
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).toPromise()
    }

    getAllEmployees(): Observable<Employee[]> {
        return Axios.get<Employee[]>(this.url,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).pipe(map(response => response.data))
    }

    removeEmployee(id: number): Promise<any> {
        return Axios.delete(`${this.url}/${id}`,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).toPromise();
    }

    updateEmployee(id: number, empl: Employee): Promise<any> {
        return Axios.put(`${this.url}/${id}`, empl,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).toPromise();
    }

}
