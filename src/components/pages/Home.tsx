import React, {useState} from "react";
import Topbar from "../library/Topbar";
import {employeesMenu} from "../../config/Menu";
import ConfirmationDialog from "../library/ConfirmDialog";
const Home: React.FC = () => {


    return <React.Fragment>
        <Topbar menu={employeesMenu}/>
        <h3>Please select required page</h3>

    </React.Fragment>
}
export default Home;
