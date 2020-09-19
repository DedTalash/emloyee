import React, {useState} from 'react';
import {withRouter, Link, RouteComponentProps} from 'react-router-dom';
import {Tabs, Tab} from "@material-ui/core";
type Props = {
    menu: {path: string, label: string}[]
}

const Topbar:React.FC<RouteComponentProps&Props> = (props: RouteComponentProps&Props) => {
    const menu = props.menu;
    function current(path: string): number {

        const index = menu.findIndex(item => item.path === path);
        return index;
    }
const [value, setValue] = useState<number>(current(props.location.pathname));
const handleChange = (event: any, tabValue: number) => {
 setValue(tabValue);
}
return <React.Fragment>
<Tabs onChange={handleChange} value={value} >
    {menu.map(item => <Tab key={item.path}
    component={Link} to={item.path} label={item.label}>

    </Tab>)}
</Tabs>
</React.Fragment>
}
export default withRouter(Topbar);
