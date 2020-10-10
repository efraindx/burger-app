export interface FormValidation {
    required: boolean;
    isEmail?: boolean;
    minLength?: number;
    maxLength?: number;
    isNumeric?: boolean;
}

interface FormElementSelectOption {
    value: string;
    displayValue: string;
}

export interface FormElementConfig {
    type?: string;
    placeholder?: string;
    options?: FormElementSelectOption[];
}

export interface FormElement {
    elementType: string;
    elementConfig: FormElementConfig;
    value: string;
    validation: FormValidation | null;
    valid: boolean;
    touched?: boolean;
}

export type IngredientName = 'salad' | 'bacon' | 'cheese' | 'meat';

export type DisabledInfo = {
    [key in IngredientName]: boolean;
}

export interface Ingredient {
    count: number;
    price: number;
}

export type IngredientList = {
    [key in IngredientName]: Ingredient;
}