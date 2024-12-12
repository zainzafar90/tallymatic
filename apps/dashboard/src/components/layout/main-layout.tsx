import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  ArrowRightStartOnRectangleIcon,
  BuildingLibraryIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  CurrencyDollarIcon,
  HomeIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Square2StackIcon,
  TruckIcon,
  UserCircleIcon,
  UsersIcon,
  WalletIcon,
} from '@heroicons/react/16/solid';

import { Avatar } from '@/components/ui/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/ui/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/ui/sidebar';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { useLogout } from '@/hooks/api/auth.hooks';
import { useMe } from '@/hooks/api/users.hooks';
import { API_TOKEN_KEY } from '@/utils/common.utils';
import { getInitials } from '@/utils/string.utils';

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  const navigate = useNavigate();
  const { mutateAsync: logoutMutation } = useLogout();

  const handleLogout = async () => {
    const token = localStorage.getItem(API_TOKEN_KEY) || '';
    await logoutMutation(
      { token },
      {
        onSettled: () => {
          navigate('/login');
        },
      }
    );
  };

  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleLogout}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export const MainLayout = () => {
  const { pathname } = useLocation();
  const { data: user } = useMe();

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/users/5.svg" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar slot="icon" initials={getInitials(user?.organization?.name)} className="bg-blue-600 text-white" />
                <SidebarLabel>{user?.organization?.name}</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders" current={pathname.startsWith('/orders')}>
                <ShoppingBagIcon />
                <SidebarLabel>Sale</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/products" current={pathname.startsWith('/products')}>
                <Square2StackIcon />
                <SidebarLabel>Products</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/categories" current={pathname.startsWith('/categories')}>
                <WalletIcon />
                <SidebarLabel>Categories</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/inventory" current={pathname.startsWith('/inventory')}>
                <BuildingLibraryIcon />
                <SidebarLabel>Inventory</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/purchases" current={pathname.startsWith('/purchases')}>
                <CurrencyDollarIcon />
                <SidebarLabel>Purchases</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/customers" current={pathname.startsWith('/customers')}>
                <UsersIcon />
                <SidebarLabel>Customers</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/suppliers" current={pathname.startsWith('/suppliers')}>
                <TruckIcon />
                <SidebarLabel>Suppliers</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarLabel className="mb-1 px-2 text-[10px]/4 font-medium text-zinc-500 dark:text-zinc-400">
                No upcoming payments
              </SidebarLabel>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/users/5.svg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{user?.name}</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Outlet />
    </SidebarLayout>
  );
};
