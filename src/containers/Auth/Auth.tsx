import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../../store/types';
import { useImmer } from 'use-immer';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { checkValidity, transformedKeys } from '../../shared/utility';
import { FormElement } from '../../shared/types';

interface AuthForm {
  email: FormElement,
  password: FormElement
}

const Auth = () => {

  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);
  const buildingBurger = useSelector((state: RootState) => state.burgerBuilder.building);
  const authRedirectPath = useSelector((state: RootState) => state.auth.authRedirectPath);

  const dispath = useDispatch();
  const authenticate = (email: string, password: string, isSignUp: boolean) => dispath(actions.authenticate({ email, password, isSignUp }));
  const setAuthRedirectPath = useCallback((path: string) => dispath(actions.setAuthRedirectPath(path)), [dispath]);

  const [authForm, setAuthForm] = useImmer<AuthForm>({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Mail Address'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });
  const [isSignUp, setIsSignUp] = useState(true);

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      setAuthRedirectPath('/');
    }
  }, [buildingBurger, authRedirectPath, setAuthRedirectPath]);

  const inputChangedHandler = (value: string, elementName: keyof AuthForm) => {
    setAuthForm(draft => {
      draft[elementName].value = value;
      draft[elementName].valid = checkValidity(
        value,
        draft[elementName].validation
      );
      draft[elementName].touched = true;
    })
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authenticate(authForm.email.value, authForm.password.value, isSignUp);
  };

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  };

  let inputs: JSX.Element[] | JSX.Element = transformedKeys(authForm).map(inputName => (
    <Input
      key={inputName}
      elementType={authForm[inputName].elementType}
      elementConfig={authForm[inputName].elementConfig}
      value={authForm[inputName].value}
      invalid={!authForm[inputName].valid}
      validation={authForm[inputName].validation}
      touched={authForm[inputName].touched}
      changed={event => inputChangedHandler(event.target.value, inputName)}
    />
  ));

  if (loading) {
    inputs = <Spinner />;
  }

  let errorMessage = null;

  if (error) {
    errorMessage = <p>{error}</p>;
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={authRedirectPath} />;
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {inputs}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button clicked={switchAuthModeHandler} btnType="Danger">
        SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}
      </Button>
    </div>
  );
};

export default Auth;