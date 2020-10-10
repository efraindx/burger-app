import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import { IngredientList } from '../../shared/types';
import { transformedKeys } from '../../shared/utility';

interface BurgerProps {
    ingredients: IngredientList;
}

const Burger: React.FC<BurgerProps> = props => {
    let transformedIngredients: JSX.Element[] | JSX.Element = transformedKeys( props.ingredients )
        .map( igKey => {
            return [...Array( props.ingredients[igKey].count )].map( ( _, i ) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default Burger;