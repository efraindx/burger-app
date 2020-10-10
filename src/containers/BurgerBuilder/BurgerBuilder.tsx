import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';
import { RouteChildrenProps } from 'react-router-dom';
import { RootState } from '../../store/types';
import { IngredientName, DisabledInfo } from '../../shared/types';
import { transformedKeys } from '../../shared/utility';

const BurgerBuilder: React.FC<RouteChildrenProps> = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ings = useSelector((state: RootState) => {
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector((state: RootState) => state.burgerBuilder.totalPrice);
  const error = useSelector((state: RootState) => state.burgerBuilder.error);
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);

  const onIngredientAdded = (ingName: IngredientName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName: IngredientName) => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(
    () => dispatch(actions.fetchIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path: string) =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = () => {
    let sum = 0;
    if (ings) {
      sum = transformedKeys(ings)
      .map(igKey => {
        return ings[igKey].count;
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    }
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
    onInitPurchase();
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.history.push('/checkout');
  };

  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

  const disabledInfo: DisabledInfo = {
    salad: false,
    bacon: false,
    cheese: false,
    meat: false
  };

  if (ings) {
    transformedKeys(ings).forEach(key => {
      disabledInfo[key] = ings[key].count <= 0;
    });

    burger = (
      <>
        <Burger ingredients={ings} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          purchasable={updatePurchaseState()}
          ordered={purchaseHandler}
          isAuth={isAuthenticated}
          price={price}
        />
      </>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </>
  );
};

export default withErrorHandler(BurgerBuilder, axios);