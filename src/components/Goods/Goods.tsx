import { GenericProps, Good } from '../../types';
import { PayButton } from '../Button/PayButton';
import { Card } from '../Card/Card';
import styles from './Goods.module.css';

interface GoodsProps extends GenericProps {
  goods: Array<Good>;
}

export function Goods({ goods }: GoodsProps) {
  console.log(goods);

  return goods.map((good, index) => (
    <Card className={styles.good} key={index}>
      <div className={styles.goodnWrapper}>
        <div>{good.description}</div>
        <img src={good.image || 'good-placeholder.png'} alt="good" />
        <PayButton tonCurrency={good.tonCurrency} currency={good.currency} />
      </div>
    </Card>
  ));
}
