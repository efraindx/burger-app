import rootReducer from './rootReducer';
import { IngredientList } from '../shared/types';

export interface OrderData {
    deliveryMethod: string;
    email: string;
    name: string;
    street: string;
    zipCode: number;
    country: string;
}

export interface Order {
    ingredients: IngredientList | null;
    orderData: OrderData;
    price: number;
    userId: string | null;
}

export interface OrderList {
    [key: string]: Order
}

export type RootState = ReturnType<typeof rootReducer>;