import isEqual from 'lodash/isEqual';
import {useCallback, useEffect, useMemo, useState} from 'react';
// hooks
import {useLocalStorage} from './../../../hooks/use-local-storage';
// utils
import {localStorageGetItem} from './../../../utils/storage-available';
//
import {SettingsValueProps} from './../types';
import {SettingsContext} from './settings-context';
import { localStorageLngKey } from '../../../layouts/_common/language-popover';

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultSettings: SettingsValueProps;
};

export function SettingsProvider({ children, defaultSettings }: SettingsProviderProps) {
  const [openSettings, setOpenSettings] = useState(false);

  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  const isArabic = localStorageGetItem(localStorageLngKey) === 'fa';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('fa');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  const onUpdate = useCallback(
    (name: string, value: string | boolean) => {
      setSettings((prevState: SettingsValueProps) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setSettings]
  );

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang: string) => {
      onUpdate('themeDirection', lang === 'fa' ? 'rtl' : 'ltr');
    },
    [onUpdate]
  );

  // Reset
  const onReset = useCallback(() => {
    setSettings(defaultSettings);
  }, [defaultSettings, setSettings]);

  // Drawer
  const onOpenSettings = useCallback(() => {
    setOpenSettings(true);
  }, []);

  const onCloseSettings = useCallback(() => {
    setOpenSettings(false);
  }, []);

  const canReset = !isEqual(settings, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...settings,
      onUpdate,
      // Direction
      onChangeDirectionByLang,
      // Reset
      canReset,
      onReset,
      // Drawer
      open: openSettings,
      onOpen: onOpenSettings,
      onClose: onCloseSettings,
    }),
    [
      onReset,
      onUpdate,
      settings,
      canReset,
      onOpenSettings,
      onCloseSettings,
      onOpenSettings,
      onChangeDirectionByLang,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
