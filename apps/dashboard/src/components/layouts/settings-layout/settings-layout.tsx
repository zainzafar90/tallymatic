import { ArrowUturnLeft, MinusMini } from '@medusajs/icons';
import { IconButton, Text } from '@medusajs/ui';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Divider } from '../../common/divider';
import { NavItem, NavItemProps } from '../nav-item';
import { Shell } from '../shell';

export const SettingsLayout = () => {
  return (
    <Shell>
      <SettingsSidebar />
    </Shell>
  );
};

const useSettingRoutes = (): NavItemProps[] => {
  return useMemo(
    () => [
      {
        label: 'Profile',
        to: '/settings/profile',
      },
      {
        label: 'Store',
        to: '/settings/store',
      },
      {
        label: 'Users',
        to: '/settings/users',
      },
      {
        label: 'Regions',
        to: '/settings/regions',
      },
      {
        label: 'Taxes',
        to: '/settings/taxes',
      },
    ],
    []
  );
};

/**
 * Ensure that the `from` prop is not another settings route, to avoid
 * the user getting stuck in a navigation loop.
 */
const getSafeFromValue = (from: string) => {
  if (from.startsWith('/settings')) {
    return '/dashboard';
  }

  return from;
};

const SettingsSidebar = () => {
  const routes = useSettingRoutes();

  const location = useLocation();
  const [from, setFrom] = useState('/dashboard');

  useEffect(() => {
    if (location.state?.from) {
      setFrom(getSafeFromValue(location.state.from));
    }
  }, [location]);

  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="p-3">
        <div className="flex items-center gap-x-3 px-2 py-1.5">
          <IconButton size="2xsmall" variant="transparent" asChild>
            <Link
              to={from}
              replace
              className="flex items-center justify-center"
            >
              <ArrowUturnLeft />
            </Link>
          </IconButton>
          <Text leading="compact" weight="plus" size="small">
            Settings
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-center px-3">
        <Divider variant="dashed" />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Collapsible.Root defaultOpen className="py-3">
          <div className="px-3">
            <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
              <Text size="small" leading="compact">
                General
              </Text>
              <Collapsible.Trigger asChild>
                <IconButton size="2xsmall" variant="transparent">
                  <MinusMini className="text-ui-fg-muted" />
                </IconButton>
              </Collapsible.Trigger>
            </div>
          </div>
          <Collapsible.Content>
            <div className="pt-0.5">
              <nav className="flex flex-col gap-y-1">
                {routes.map((setting) => (
                  <NavItem key={setting.to} {...setting} />
                ))}
              </nav>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <div className="flex items-center justify-center px-3">
          <Divider variant="dashed" />
        </div>
        <Collapsible.Root defaultOpen className="py-3">
          <div className="px-3">
            <div className="text-ui-fg-muted flex h-7 items-center justify-between px-2">
              <Text size="small" leading="compact">
                Developer
              </Text>
              <Collapsible.Trigger asChild>
                <IconButton size="2xsmall" variant="transparent">
                  <MinusMini className="text-ui-fg-muted" />
                </IconButton>
              </Collapsible.Trigger>
            </div>
          </div>
        </Collapsible.Root>
      </div>
    </aside>
  );
};
