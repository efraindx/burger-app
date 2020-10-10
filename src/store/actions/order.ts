import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { OrderList, Order } from '../types';
import axios from '../../axios-orders';

export const purchaseInit = createAction('PURCHASE_INIT');

interface FetchOrdersActionType {
    token: string | null,
    userId: string | null
}

export const fetchOrders = createAsyncThunk<OrderList, FetchOrdersActionType>(
    'orders/fechOrders',
    async args => {
        const queryParams = '?auth=' + args.token + '&orderBy="userId"&equalTo="' + args.userId + '"';
        const response = await axios.get<OrderList>( '/orders.json' + queryParams);
        return response.data;
    }
);

interface PurchaseBurgerActionType {
    order: Order,
    token: string | null
}

interface PurchaseBurgerActionResponseType {
    key: string,
    order: Order
}

interface PurchaseBurgerResponseType {
    name: string
}

export const purchaseBurger = createAsyncThunk<PurchaseBurgerActionResponseType, PurchaseBurgerActionType>(
    'orders/purchaseBurger',
    async args => {
        const response = await axios.post<PurchaseBurgerResponseType>( '/orders.json?auth=' + args.token, args.order );
        const order: PurchaseBurgerActionResponseType = { order: args.order, key: response.data.name };

        return order;
    }
);