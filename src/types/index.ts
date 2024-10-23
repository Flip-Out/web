import { ReactElement } from 'react';

export interface GenericProps {
  children?: ReactElement | ReactElement[];
}

export interface Subscription {
  id: number;
  power: number;
  crystals: number;
  details: string;
  frequency: string;
  currency: number;
  tonCurrency: number;
}

export interface Good {
  id: number;
  description: string;
  image: string;
  currency: number;
  tonCurrency: number;
}
