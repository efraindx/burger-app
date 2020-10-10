import React from 'react';
import Button from '../../UI/Button/Button';
import { IngredientList } from '../../../shared/types';
import { transformedKeys } from '../../../shared/utility';

interface OrderSummaryProps {
    ingredients: IngredientList;
    price: number;
    purchaseCancelled: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
    purchaseContinued: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

const OrderSummary: React.FC<OrderSummaryProps> = props => {
  const ingredientSummary = transformedKeys(props.ingredients).map(igKey => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
        {props.ingredients[igKey].count}
      </li>
    );
  });

  return (
    <>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total Price: {props.price.toFixed(2)}</strong>
      </p>
      <p>Continue to Checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCancelled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>
        CONTINUE
      </Button>
    </>
  );
};

export default OrderSummary;