import React, {FC, ReactNode, useEffect} from 'react';

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableFooter,
    TablePagination, IconButton, Paper, Theme,

} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
export type HeaderDescription = {
    displayName: string;
    numeric: boolean;
    width?: string
}
type Props = {
    headers: Map<string, HeaderDescription>
    rows: object[],
    defaultRowsPerPage?: number;
   actions?: {icon: JSX.Element, actionFn: (obj: object) => any}[

   ]
}
const useStyles = makeStyles((theme: Theme) =>({
    table: {
        minWidth: 650

    },
    container: {
        width: '90%',
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(8)
    },
    header: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        fontStyle: 'italic'
    }

}));

export const MyTable: FC<Props> = (props: Props) => {
   const defaultRowsPerPage = props.defaultRowsPerPage || 5;
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
    const [page, setPage] = React.useState(0);
    const classes = useStyles();

    if (rowsPerPage > 0 && props.rows.length / rowsPerPage < page) {
        setPage(0)
    }
    useEffect(()=>setPage(0),[props.rows, rowsPerPage])
function getHeaders(): JSX.Element[] {
 const cells: any[] = [];

    props.headers.forEach((value,key) => {
        cells.push(<TableCell className={classes.header}
                              align={value.numeric ? 'right':'left'}
                              key={key}>{value.displayName}</TableCell>)
    })
    if (props.actions) {
        for (let i = 0; i < props.actions.length; i++)
        {
            cells.push(<TableCell key={Math.random()}/>)
        }
    }

    return cells;

}
function getRows(): JSX.Element[] {

    const keys: string[] = [];

    props.headers.forEach((value, key) => {
        keys.push(key);
    })
    const rowsRes = rowsPerPage > 0 ?
        props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [...props.rows];
    return rowsRes.map((row, index) => getRow(row, index, keys));

}
function getRow(row: object, index: number, keys: string[]) : JSX.Element {
    return <TableRow key={index}>
        {getDataCells(row, keys)}
    </TableRow>
}

    function getActionButtons(row: object): JSX.Element[] {
   let res: JSX.Element[] = [];
   if (props.actions) {
       res = props.actions.map(a => <TableCell  key={Math.random()} style={{"width": "5%"}}>
           <IconButton onClick={()=>{
               a.actionFn(row)}
           }>
               {a.icon}
           </IconButton>
       </TableCell>)
   }
   return res;

    }

    function getDataCells(row: object, keys: string[]): JSX.Element[]{
    const res =  keys.map(k => <TableCell key={k} align={props.headers.get(k)?.numeric ? 'right': 'left'}
                                          style={!!props.headers.get(k)?.width ? {'width': props.headers.get(k)?.width}:undefined}>
        {row[k]}</TableCell>)

    return props.actions ? res.concat(getActionButtons(row)): res;
}

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(+event.target.value);

    };

    return <TableContainer component={Paper} elevation={3} className={classes.container}>
            <Table className={classes.table} size="small">
                <TableHead >
                    <TableRow>
                        {getHeaders()}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getRows()}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[defaultRowsPerPage, defaultRowsPerPage * 2, defaultRowsPerPage * 3, { label: 'All', value: -1 }]}

                            count={props.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}

                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}

                        />
                    </TableRow>
                </TableFooter>
            </Table>
    </TableContainer>
}
