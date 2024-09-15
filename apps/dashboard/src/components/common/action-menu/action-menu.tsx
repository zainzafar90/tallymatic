import { ReactNode } from 'react';

import { MoreHorizontal } from 'lucide-react';

import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/ui/dropdown';

type Action = {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
} & (
  | {
      to: string;
      onClick?: never;
    }
  | {
      onClick: () => void;
      to?: never;
    }
);

type ActionGroup = {
  actions: Action[];
};

export const ActionMenu = ({ actions }: ActionGroup) => {
  return (
    <Dropdown>
      <DropdownButton outline aria-label="More Options" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-6 w-6" />
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        {actions.map((action, actionIndex) => {
          if (action.to) {
            return (
              <DropdownItem key={actionIndex} disabled={action.disabled} href={action.to}>
                <DropdownLabel className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </DropdownLabel>
              </DropdownItem>
            );
          }

          return (
            <DropdownItem
              key={actionIndex}
              disabled={action.disabled}
              destructive={action.label === 'Delete'}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                action.onClick?.();
              }}
            >
              <DropdownLabel className="flex items-center gap-2">
                {action.icon}
                <span>{action.label}</span>
              </DropdownLabel>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};
