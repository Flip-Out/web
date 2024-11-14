import InternalCurrency from '../../assets/InternalCurrency';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps } from '../../types';
import { Button } from './Button';

interface PayButton extends GenericProps {
  currency: number;
  tonCurrency: number;
  handleClick: () => void;
}

export function PayButton({ currency, tonCurrency, handleClick }: PayButton) {
  return (
    <Button handleClick={handleClick}>
      <div>{currency}</div>
      <InternalCurrency />
      <>/</>
      <div>{tonCurrency}</div>
      <TonCurrency />
    </Button>
  );
}
