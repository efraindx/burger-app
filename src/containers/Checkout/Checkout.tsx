import React from 'react';
import { Route, Redirect, RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { RootState } from '../../store/types';

const Checkout: React.FC<RouteChildrenProps> = props => {
  const ings = useSelector((state: RootState) => state.burgerBuilder.ingredients);
  const purchased = useSelector((state: RootState) => state.order.purchased);

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };

  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  };

  let summary = <Redirect to="/" />;
  if (ings) {
    const purchasedRedirect = purchased ? <Redirect to="/" /> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route
          path={props.match?.path + '/contact-data'}
          component={ContactData}
        />
      </div>
    );
  }
  return summary;
};

export default Checkout;