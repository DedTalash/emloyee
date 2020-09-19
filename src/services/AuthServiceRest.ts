import {Axios} from "axios-observable";
import AuthService, {LoginData, UserData} from "./AuthService";
import {Observable, of} from "rxjs";
import {map} from 'rxjs/operators';
export const ACCESS_TOKEN ='accessToken';
function toUserData(this: any, accessToken: string): Observable<UserData> {
    const tokenBody = accessToken.split('.')[1];
    const tokenBodyObj = JSON.parse(atob(tokenBody));
    if (tokenBodyObj.exp && Date.now() / 1000 > tokenBodyObj.exp){
        this.logout();
        return of({user:'', isAdmin: false})
    }
    return of({isAdmin: true, user: tokenBodyObj.email });
}

export default class AuthServiceRest implements AuthService {
    constructor(private url: string){

    }
    getUserData(): Observable<UserData> {
        const accessToken: string|null = localStorage.getItem(ACCESS_TOKEN);
        return accessToken ? toUserData.call(this,accessToken) : of({isAdmin:false, user:''});
    }

    login(loginData: LoginData): Promise<boolean> {
        return Axios.post(this.url, loginData)
            .pipe(map(response => response.data))
            .toPromise().then(token => {
                localStorage.setItem(ACCESS_TOKEN, token.accessToken);
                return true;
            }).catch(() => false);
    }

    logout(): Promise<boolean> {
        localStorage.removeItem(ACCESS_TOKEN)
        return Promise.resolve(true);
    }

}
