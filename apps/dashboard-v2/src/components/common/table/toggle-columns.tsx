import { ChevronDown } from 'lucide-react';
import { Table } from '@tanstack/react-table';

import {
  Dropdown,
  DropdownButton,
  DropdownHeading,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownSection,
} from '@/components/ui/dropdown';

interface ToggleColumnsProps<T> {
  table: Table<T>;
}

export function ToggleColumns<T>({ table }: ToggleColumnsProps<T>) {
  return (
    <Dropdown>
      <DropdownButton outline aria-label="More options">
        Columns <ChevronDown className="ml-2 h-4 w-4" />
      </DropdownButton>
      <DropdownMenu anchor="top end">
        <DropdownSection>
          <DropdownHeading>Toggle Columns</DropdownHeading>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
