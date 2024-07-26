import {useState} from 'react'
import {MdSmartToy} from "react-icons/md";
import SearchableDropdown from "../../components/_common/searchable-dropdown.tsx";
import Iconify from "../../components/iconify";


const pages = {
    agents: 'agents'
}

const navigations = [
    {name: 'Agents', href: '#', icon: MdSmartToy, current: true, page: pages.agents},
]

type NavigationType = {
    name: string,
    href: string,
    icon: any,
    current: boolean,
    page: string
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SettingsSidebar({handleClose}: {handleClose: any}) {
    const [navigation, setNavigation] = useState<Array<NavigationType>>(navigations)
    const [current, setCurrent] = useState<NavigationType>(navigation[0]);

    const handleOnSectionClick = (index: number): void => {
        setCurrent(navigation[index]);
        for (let i = 0; i < navigation.length; i++) {
            navigation[i].current = false;
        }
        navigation[index].current = true;
        setNavigation(navigation);
    }

    return (
        <>
            <div>
                {/* Static sidebar for desktop */}
                <div className="hidden rounded-l-xl md:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex rounded-l-xl grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                        <nav className="flex flex-1 mt-5 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item, index) => (
                                            <li onClick={() => handleOnSectionClick(index)} key={item.name}>
                                                <a  href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div
                    className="sticky rounded-t-xl top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <div className="max-w-7xl sm:px-4 lg:px-8">
                        <div
                            className="relative flex h-12  items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
                            <div className="flex items-start justify-start px-2 lg:px-0">
                                <nav className="flex rounded-t-2xl flex-1 flex-col">
                                    <ul role="list" className="flex flex-1  flex-col items-start gap-y-7">
                                        <li>
                                            <ul role="list" className="space-y-1">
                                                {navigation.map((item, index) => (
                                                    <li onClick={() => handleOnSectionClick(index)} key={item.name}>
                                                        <a href={item.href}
                                                           className={classNames(
                                                               item.current
                                                                   ? 'bg-gray-800 text-white'
                                                                   : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                               'group flex gap-x-3 items-center justify-around rounded-md p-2 text-sm leading-6 font-semibold'
                                                           )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                    <div onClick={handleClose} className={'w-100 hover:cursor-pointer relative flex items-center justify-end mt-5 mr-5'}>
                        <Iconify icon="gridicons:cross" width={24} />
                    </div>

                <main className="py-5 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-8">


                        {current.page === 'agents' && (
                            <SearchableDropdown></SearchableDropdown>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}
