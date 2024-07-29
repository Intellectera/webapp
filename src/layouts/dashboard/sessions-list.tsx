import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {alpha} from "@mui/material/styles";

export default function SessionsList() {
    return (
        <List className={'overflow-y-scroll'} sx={{ width: '100%', maxWidth: 360, bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1) }}>
            <ListItem className={'cursor-pointer'} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="B" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary="Brunch this weekend?"
                    secondary={
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            2024/12/11
                        </Typography>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </List>
    );
}
