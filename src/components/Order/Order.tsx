import React from 'react';
import classes from './Order.module.css';
import { IngredientList } from '../../shared/types';
import { transformedKeys } from '../../shared/utility';

interface OrderProps {
    ingredients: IngredientList | null;
    price: number;
    id: string;
}

const Order: React.FC<OrderProps> = props => {
    let ingredientOutput = null;

    if (props.ingredients) {
        const ingredients = props.ingredients;
        ingredientOutput = transformedKeys(ingredients).map(ingredientName => {
            return <span 
                style={{
                    textTransform: 'capitalize',
                    display: 'inline-block',
                    margin: '0 8px',
                    border: '1px solid #ccc',
                    padding: '5px'
                    }}
                key={ingredientName}>{ingredientName} ({ingredients[ingredientName].count})</span>;
        });
    }

    return (
        <div className={classes.Order}>
            <p>Order Number: {props.id}</p>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {props.price.toFixed( 2 )}</strong></p>
        </div>
    );
};

export default Order;