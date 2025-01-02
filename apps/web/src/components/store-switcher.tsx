import { useEffect } from 'react';

import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/16/solid';

import { useMe } from '@/hooks/api/users.hooks';
import { getInitials } from '@/utils/string.utils';
import { useAuth } from '@/providers/auth/auth-context';

import { LetterBox } from './common/letter-box/letter-box';
import { Avatar } from './ui/avatar';
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from './ui/dropdown';
import { SidebarItem, SidebarLabel } from './ui/sidebar';

export const StoreSwitcher = () => {
  const { data: user } = useMe();
  const { currentStore, setCurrentStore } = useAuth();

  const stores = user?.stores || [];

  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  if (!stores?.length) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <Avatar
          slot="icon"
          initials={getInitials(currentStore?.name || 'Select store')}
          className="bg-blue-600 text-white"
        />
        <SidebarLabel>{currentStore?.name || 'Select store'}</SidebarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
        {stores.map((store) => (
          <DropdownItem key={store.id} onClick={() => setCurrentStore(store)} className="flex items-center gap-2">
            <LetterBox text={store.name} size="xs" />
            <DropdownLabel>{store.name}</DropdownLabel>
          </DropdownItem>
        ))}

        <DropdownDivider />

        <DropdownItem href="/settings">
          <Cog8ToothIcon />
          <DropdownLabel>Settings</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
