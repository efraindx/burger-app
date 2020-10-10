import React, { useState, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { checkValidity, transformedKeys } from '../../../shared/utility';
import { FormElement } from '../../../shared/types';
import { useImmer } from 'use-immer';
import { Order, OrderData, RootState } from '../../../store/types';

interface OrderForm {
  name: FormElement;
  street: FormElement;
  zipCode: FormElement;
  country: FormElement;
  email: FormElement;
  deliveryMethod: FormElement;
}

const ContactData = () => {

  const ings = useSelector((state: RootState) => state.burgerBuilder.ingredients);
  const price = useSelector((state: RootState) => state.burgerBuilder.totalPrice);
  const loading = useSelector((state: RootState) => state.order.loading);
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const dispath = useDispatch();
  const orderBurger = (order: Order, token: string | null) => dispath(actions.purchaseBurger({order, token}));

  const [orderForm, setOrderForm] = useImmer<OrderForm>({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'ZIP Code'
      },
      value: '',
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5,
        isNumeric: true
      },
      valid: false,
      touched: false
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-Mail'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' }
        ]
      },
      value: 'fastest',
      validation: null,
      valid: true
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let formData: OrderData = {
      deliveryMethod: orderForm.deliveryMethod.value,
      email: orderForm.email.value,
      name: orderForm.name.value,
      zipCode: parseInt(orderForm.zipCode.value),
      street: orderForm.street.value,
      country: orderForm.country.value
    };

    const order: Order = {
      ingredients: ings,
      price: price,
      orderData: formData,
      userId: userId
    };

    orderBurger(order, token);
  };

  const inputChangedHandler = (value: string, inputIdentifier: keyof OrderForm) => {
    let formIsValid = true;

    setOrderForm(draft => {
      draft[inputIdentifier].value = value;
      draft[inputIdentifier].valid = checkValidity(
        value,
        orderForm[inputIdentifier].validation
      );
      draft[inputIdentifier].touched = true;

      transformedKeys(draft).forEach(value => {
        formIsValid = draft[value].valid && formIsValid;
      });

      setFormIsValid(formIsValid);
    });
  };

  let inputs: JSX.Element[] | JSX.Element = transformedKeys(orderForm).map(formElement => (
        <Input
          key={formElement}
          elementType={orderForm[formElement].elementType}
          elementConfig={orderForm[formElement].elementConfig}
          value={orderForm[formElement].value}
          invalid={!orderForm[formElement].valid}
          validation={orderForm[formElement].validation}
          touched={orderForm[formElement].touched}
          changed={event => inputChangedHandler(event.target.value, formElement)}
        />
  ));

  if (loading) {
    inputs = <Spinner />;
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      <form onSubmit={orderHandler}>
        { inputs }
        <Button btnType="Success" disabled={!formIsValid}>
          ORDER
        </Button>
      </form>
    </div>
  );
};

export default withErrorHandler(ContactData, axios);