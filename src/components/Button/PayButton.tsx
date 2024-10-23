import InternalCurrency from '../../assets/InternalCurrency';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps } from '../../types';
import { Button } from './Button';

interface PayButton extends GenericProps {
  currency: number;
  tonCurrency: number;
}

export function PayButton({ currency, tonCurrency }: PayButton) {
  return (
    <Button>
      <div>{currency}</div>
      <InternalCurrency />
      <>/</>
      <div>{tonCurrency}</div>
      <TonCurrency />
    </Button>
  );
}
