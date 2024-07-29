import TextField from "@mui/material/TextField";
import { Autocomplete } from '@mui/material'
import Typography from "@mui/material/Typography";
import {SyntheticEvent, useState} from "react";

export default function SearchableDropdown({list, displayKey, uniqueKey, handleSelect, title}: {list: Array<any>, displayKey: string, uniqueKey: string, handleSelect: any, title: string}) {
    const [label, setLabel] = useState<string>((list && list.length > 0) ? list[0][displayKey] : "");

    return (
        <div>
            <Typography variant="subtitle2" noWrap>
                {title}
            </Typography>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={list as any[]}
                getOptionKey={(option) => option[uniqueKey]}
                getOptionLabel={(option) => option[displayKey] ?? option}
                className={'w-100 mt-3'}
                isOptionEqualToValue={(option, value) => option[uniqueKey] === value[uniqueKey]}
                onChange={(_: SyntheticEvent, value: any, reason: string) => {
                    setLabel('');
                    if (reason === 'selectOption') {
                        handleSelect(value)
                    }
                }}
                renderInput={(params) => <TextField {...params} label={label}/>}
            />
        </div>
    );
}
