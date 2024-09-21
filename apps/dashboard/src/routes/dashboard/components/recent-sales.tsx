import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const salesData = [
  {
    initials: 'OM',
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+₨ 1,999',
  },
  {
    initials: 'JL',
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+₨ 39',
  },
  {
    initials: 'IN',
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+₨ 299',
  },
  {
    initials: 'WK',
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+₨ 99',
  },
  {
    initials: 'SD',
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+₨ 39',
  },
  {
    initials: 'EM',
    name: 'Ethan Miller',
    email: 'ethan.miller@email.com',
    amount: '+₨ 499',
  },
];

export function RecentSales() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {salesData.map((sale, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar
              slot="icon"
              src="https://ui.shadcn.com/avatars/02.png"
              initials={sale.initials}
              className="size-8 bg-blue-900 text-white"
            />
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">{sale.amount}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
