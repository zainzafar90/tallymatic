import { RegionCountryDTO } from '@medusajs/types';

import { countries as COUNTRIES } from '../../../../../lib/countries';
import { ListSummary } from '../../../../common/list-summary';
import { PlaceholderCell } from '../../common/placeholder-cell';

type CountriesCellProps = {
  countries?: RegionCountryDTO[] | null;
};

export const CountriesCell = ({ countries }: CountriesCellProps) => {
  if (!countries || countries.length === 0) {
    return <PlaceholderCell />;
  }

  return (
    <div className="flex size-full items-center overflow-hidden">
      <ListSummary list={countries.map((country) => COUNTRIES.find((c) => c.iso_2 === country.iso_2)!.display_name)} />
    </div>
  );
};

export const CountriesHeader = () => {
  return (
    <div className="flex size-full items-center">
      <span>Countries</span>
    </div>
  );
};
