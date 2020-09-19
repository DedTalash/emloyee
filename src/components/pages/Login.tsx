import React from "react";
import AuthService from "../../services/AuthService";
import LoginForm from "../library/LoginForm";
type Props = {
    authService: AuthService
    backPath?: string
}
const Login: React.FC<Props> = (props: Props) => {
    const onSubmit = (loginData: { username:string, password: string }):Promise<boolean> => {
        return props.authService.login({email: loginData.username,
        password: loginData.password})
    }
    const validatePasswordLength = (password: string) :string =>{
        return password.length < 6 ? "password can't be less than 6 symbols" :''
    }
   return <React.Fragment>
       <LoginForm onSubmit={onSubmit} passwordErrorMessage={validatePasswordLength}/>
   </React.Fragment>

}
export default Login;
