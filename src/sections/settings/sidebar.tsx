import {useTranslation} from "react-i18next";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {useSettingsContext} from "../../components/settings";
import Divider from "@mui/material/Divider";
import {SetStateAction} from "react";
import * as React from "react";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    currentNav: string,
    setCurrentNav: React.Dispatch<SetStateAction<string>>
}

export const settingsNavIds = {
    general: 'general',
    editAgent: 'edit_agent',
    users: 'users',
    knowledge: 'knowledge',
    newAgent: 'new_agent'
}

export default function SettingsSidebar({ currentNav, setCurrentNav}: Props) {
    const {t } = useTranslation();
    const settings = useSettingsContext();
    const navigation = [
        {id: settingsNavIds.newAgent, name: t('titles.new_agent'), href: '#' },
        {id: settingsNavIds.editAgent, name: t('titles.manage_agents'), href: '#' },
        {id: settingsNavIds.users, name: t('titles.users'), href: '#' },
        // {id: settingsNavIds.knowledge, name: t('titles.knowledge'), href: '#' },
    ]

    return (
        <Disclosure as="nav" className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800')}>
            {({ open }) => (
                <>
                    <div className={'h-[10%] w-[100%] flex justify-between'}>
                        {/* Mobile menu button*/}
                        <DisclosureButton
                            className="relative mx-3 sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5"/>
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                            )}
                        </DisclosureButton>

                    </div>


                    <div className="hidden sm:block max-w-7xl mx-auto px-2">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex w-[100%] items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden w-[100%] sm:block">
                                    <div className="flex w-[100%] justify-center space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setCurrentNav(item.id)}
                                                className={classNames(
                                                    item.id === currentNav ? 'bg-gray-500 text-white' :
                                                        (settings.themeMode === 'light' ? 'hover:bg-gray-200 hover:text-black' : 'hover:bg-gray-700 hover:text-white'),
                                                    'rounded-md px-4 py-3 text-sm font-medium'
                                                )}
                                                aria-current={item.id === currentNav ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider className={''} sx={{ borderStyle: 'dashed', borderWidth: '1px' }} />

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    onClick={() => setCurrentNav(item.id)}
                                    className={classNames(
                                        item.id === currentNav ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.id === currentNav ? 'page' : undefined}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}
