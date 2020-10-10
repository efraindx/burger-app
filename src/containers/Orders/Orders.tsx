import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { } from '../../store/types';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { RootState } from '../../store/types';

const Orders = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const loading = useSelector((state: RootState) => state.order.loading);
  const orders = useSelector((state: RootState) => state.order.orders);

  const dispatch = useDispatch();
  const onFetchOrders = useCallback(() => dispatch(actions.fetchOrders({token, userId})), [dispatch, token, userId]);

  useEffect(() => {
    onFetchOrders();
  }, [onFetchOrders]);

  let ordersElement: JSX.Element[] | JSX.Element = <Spinner />;
  if (!loading) {
    ordersElement = Object.keys(orders).map(orderKey => (
      <Order
        key={orderKey}
        id={orderKey}
        ingredients={orders[orderKey].ingredients}
        price={orders[orderKey].price}
      />
    ));
  }
  return <div>{ordersElement}</div>;
};

export default withErrorHandler(Orders, axios);
