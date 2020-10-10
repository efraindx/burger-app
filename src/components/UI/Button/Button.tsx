import React from 'react';
import classes from './Button.module.css';

interface ButtonProps {
    disabled?: boolean;
    btnType: string;
    clicked?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

const Button: React.FC<ButtonProps> = props => (
    <button
        disabled={props.disabled}
        className={[classes.Button, classes[props.btnType]].join(' ')}
        onClick={props.clicked}>{props.children}</button>
);

export default Button;