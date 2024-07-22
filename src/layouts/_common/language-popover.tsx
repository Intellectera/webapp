import { useCallback, useState } from 'react';
import { m } from 'framer-motion';
// @mui
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from './../../components/iconify';
import { varHover } from './../../components/animate';
import CustomPopover, { usePopover } from './../../components/custom-popover';
import { useTranslation } from "react-i18next";
import { useSettingsContext } from './../../components/settings';
import { localStorageGetItem, localStorageSetItem } from '../../utils/storage-available';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    icon: 'flagpack:gb-nir',
  },
  {
    label: 'Persian',
    value: 'fa',
    icon: 'flagpack:ir',
  },
];

export const localStorageLngKey = 'i18nextLng';

const findLanguageObj = (lang: string) => {
  return allLangs.find((obj) => obj.value === lang)!
}

export default function LanguagePopover() {
  const popover = usePopover();
  const settings = useSettingsContext();
  const {t, i18n: { changeLanguage, language} } = useTranslation();
  const [currentLang, setCurrentLang] = useState(findLanguageObj(localStorageGetItem(localStorageLngKey, 'en')))

  console.log(language);
  

  const handleChangeLang = useCallback((lang: { label: string; value: string; icon: string; }) => {
    changeLanguage(lang.value);
    setCurrentLang(lang)
    settings.onChangeDirectionByLang(lang.value)
    localStorageSetItem(localStorageLngKey, lang.value)
    popover.onClose();
  }, [popover]);

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
