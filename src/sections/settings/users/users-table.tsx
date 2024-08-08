import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import * as React from "react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {CustomerInvitation} from "../../../utils/dto/CustomerInvitation.ts";
import {useSelectedWorkspaceContext} from "../../../layouts/dashboard/context/workspace-context.tsx";

type TableSortValues = {
    name: {
        esc: boolean
    },
    email: {
        esc: boolean
    },
    role: {
        esc: boolean
    },
    status: {
        esc: boolean
    }
}

const tableSortDefault = {
    name: {
        esc: true
    },
    email: {
        esc: true
    },
    role: {
        esc: true
    },
    status: {
        esc: true
    }
}

type Props = {
    invitations: CustomerInvitation[];
    setInvitations: React.Dispatch<React.SetStateAction<CustomerInvitation[]>>;
    setSelectedInvitationForDelete: React.Dispatch<React.SetStateAction<CustomerInvitation | undefined>>;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UsersTable({invitations, setInvitations, setSelectedInvitationForDelete, setIsDialogOpen}: Props) {
    const [tableSortValues, setTableSortValues] = useState<TableSortValues>(tableSortDefault);
    const {t} = useTranslation();
    const workspaceContext = useSelectedWorkspaceContext();

    const handleSort = (field: string) => {
        if (field === 'name'){
            const esc = tableSortValues.name.esc;
            setTableSortValues(prevState => {return {...prevState, name: {esc: !esc}}})
            setInvitations(prevState => prevState.sort((a, b) => {
                return esc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }));
        } else if (field === 'email'){
            const esc = tableSortValues.email.esc;
            setTableSortValues(prevState => {return {...prevState, email: {esc: !esc}}})
            setInvitations(prevState => prevState.sort((a, b) => {
                return esc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
            }));
        } else if (field === 'role'){
            const esc = tableSortValues.role.esc;
            setTableSortValues(prevState => {return {...prevState, role: {esc: !esc}}})
            setInvitations(prevState => prevState.sort((a, b) => {
                return esc ? a.role - b.role : b.role - a.role;
            }));
        } else if (field === 'status'){
            const esc = tableSortValues.status.esc;
            setTableSortValues(prevState => {return {...prevState, status: {esc: !esc}}})
            setInvitations(prevState => prevState.sort((a) => {
                return esc ? (a.pending ? 1 : -1) : (!a.pending ? 1 : -1);
            }));
        }
    }

    const handleDeleteClick = (index: number) => {
        const invitation = invitations[index];
        invitation.workspace = workspaceContext.selectedWorkspace!;
        setSelectedInvitationForDelete(invitation);
        setIsDialogOpen(true);
    }

    const getRoleName = (role: number): string => {
        if (role === 2) return t('labels.roles.admin');
        else if (role === 3) return t('labels.roles.user');
        else return t('labels.roles.unknown');
    }

    return (
        <TableContainer className={'w-full'} component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell onClick={() => handleSort('email')}
                                   className={'cursor-pointer'}>{(
                            <div className={'inline-flex gap-1'}>
                                <span>{t('email')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"/>
                                </svg>
                            </div>)}</TableCell>
                        <TableCell onClick={() => handleSort('name')}
                                   className={'cursor-pointer'} align="center">{(
                            <div className={'gap-1 inline-flex'}>
                                <span>{t('name')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"/>
                                </svg>
                            </div>)}</TableCell>
                        <TableCell onClick={() => handleSort('role')}
                                   className={'cursor-pointer'} align="center">{(
                            <div className={'gap-1 inline-flex'}>
                                <span>{t('labels.role')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"/>
                                </svg>
                            </div>)}</TableCell>
                        <TableCell onClick={() => handleSort('status')}
                                   className={'cursor-pointer'} align="center">{(
                            <div className={'gap-1 inline-flex'}>
                                <span>{t('labels.status')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"/>
                                </svg>
                            </div>)}</TableCell>
                        <TableCell align="center">{t('buttons.edit')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invitations.map((invitation, index) => (
                        <TableRow
                            key={index}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {invitation.email}
                            </TableCell>
                            <TableCell align="center">{invitation.name}</TableCell>
                            <TableCell align="center">{getRoleName(invitation.role)}</TableCell>
                            <TableCell
                                align="center">{invitation.pending ? (<span
                                className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                            {t('labels.statuses.pending')}</span>) : (<span
                                className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                        {t('labels.statuses.approved')}</span>)}</TableCell>
                            <TableCell align="center">
                                <Button onClick={() => handleDeleteClick(index)} variant={'contained'}
                                        color={'error'} size={'small'}>{t('buttons.delete')}</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
