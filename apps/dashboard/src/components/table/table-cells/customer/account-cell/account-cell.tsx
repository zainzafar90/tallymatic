import { StatusCell } from '../../common/status-cell';

type AccountCellProps = {
  hasAccount: boolean;
};

export const AccountCell = ({ hasAccount }: AccountCellProps) => {
  const color = hasAccount ? 'green' : ('orange' as const);
  const text = hasAccount ? 'Registered' : 'Guest';

  return <StatusCell color={color}>{text}</StatusCell>;
};

export const AccountHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">Account</span>
    </div>
  );
};
