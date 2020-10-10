import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';
import { IngredientList } from '../../../shared/types';

interface CheckoutSummaryProps {
    ingredients: IngredientList;
    checkoutCancelled: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
    checkoutContinued: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = props => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>We hope it tastes well!</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button 
                btnType="Danger"
                clicked={props.checkoutCancelled}>CANCEL</Button>
            <Button 
                btnType="Success"
                clicked={props.checkoutContinued}>CONTINUE</Button>
        </div>
    );
}

export default CheckoutSummary;