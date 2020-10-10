import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';
import { IngredientName, DisabledInfo } from '../../../shared/types';

interface Control {
    label: string;
    type: IngredientName;
}

const controls: Control[] = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' }
];

interface BuildControlsProps {
    price: number;
    ingredientAdded: ((ingredientName: IngredientName) => void);
    ingredientRemoved: ((ingredientName: IngredientName) => void);
    disabled: DisabledInfo;
    purchasable: boolean;
    ordered: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
    isAuth: boolean;
}

const BuildControls: React.FC<BuildControlsProps> = props => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed( 2 )}</strong></p>
        {controls.map( ctrl => (
            <BuildControl
                key={ctrl.label}
                label={ctrl.label}
                added={() => props.ingredientAdded( ctrl.type )}
                removed={() => props.ingredientRemoved( ctrl.type )}
                disabled={props.disabled[ctrl.type]} />
        ) )}
        <button
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>{props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}</button>
    </div>
);

export default BuildControls;