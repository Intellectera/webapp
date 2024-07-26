import TextField from "@mui/material/TextField";
import { Autocomplete } from '@mui/material'
import Typography from "@mui/material/Typography";

const top100Films = [
    {label: 'The Shawshank Redemption', year: 1994},
    {label: 'The Godfather', year: 1972},
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SearchableDropdown() {
    return (
        <div>
            <Typography variant="subtitle2" noWrap>
                Selected Agent
            </Typography>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                className={'w-100 mt-3'}
                renderInput={(params) => <TextField {...params} label={top100Films[0].label}/>}
            />
        </div>
    );
}
