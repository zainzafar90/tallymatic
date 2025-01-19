import { Link, useNavigate, useParams } from 'react-router-dom';

import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/react/16/solid';

import { useMe } from '@/hooks/api/users.hooks';
import { SELECTED_STORE_KEY } from '@/utils/common.utils';
import { getInitials } from '@/utils/string.utils';

import { LetterBox } from './common/letter-box/letter-box';
import { Avatar } from './ui/avatar';
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from './ui/dropdown';
import { SidebarItem, SidebarLabel } from './ui/sidebar';

export const StoreSwitcher = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { data: user } = useMe();

  const stores = user?.stores || [];
  const currentStore = stores.find((store) => store.id === storeId);

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem(SELECTED_STORE_KEY, storeId);
    navigate(`/stores/${storeId}/dashboard`);
  };

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
          <DropdownItem key={store.id} className="flex items-center gap-2" onClick={() => handleStoreSelect(store.id)}>
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
