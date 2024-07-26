import { useState } from 'react';
import { m } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from './../../components/iconify';
import { varHover } from '../../components/animate';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------



export default function ModeToggle() {
  const settings = useSettingsContext();
  const [mode, setMode] = useState(settings.themeMode);

  const changeMode = () => {
    const newValue = mode === 'light' ? 'dark' : 'light';
    settings.onUpdate('themeMode', newValue);
    setMode(newValue);
  }

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={changeMode}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon={mode === 'light' ? 'ic:round-mode-night' : 'fontisto:day-sunny'} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>
    </>
  );
}
