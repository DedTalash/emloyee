import {Observable} from "rxjs";

export interface LoginData {
    email: string,
    password: string
}
export interface UserData {
    user: string;
    isAdmin: boolean;
}
export default interface AuthService {
    login(loginData: LoginData): Promise<boolean>;
    logout():Promise<boolean>;
    getUserData(): Observable<UserData>;
}
