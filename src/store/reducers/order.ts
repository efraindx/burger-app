import { OrderList } from '../types';
import { createReducer } from '@reduxjs/toolkit';
import { purchaseInit, purchaseBurger, fetchOrders } from '../actions';

interface OrderState {
    orders: OrderList;
    loading: boolean;
    purchased: boolean;
};

const initialState: OrderState = {
    orders: {},
    loading: false,
    purchased: false
};

const reducer = createReducer(initialState, builder => {
    builder.addCase(purchaseInit, state => {
        state.purchased = false;
    })
    builder.addCase(purchaseBurger.pending, state => {
        state.loading = true;
    })
    builder.addCase(purchaseBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.purchased = true;
        state.orders[action.payload.key] = action.payload.order;
    })
    builder.addCase(purchaseBurger.rejected, state => {
        state.loading = false;
    })
    builder.addCase(fetchOrders.pending, state => {
        state.loading = true;
    })
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
    })
    builder.addCase(fetchOrders.rejected, state => {
        state.loading = false;
    })
});

export default reducer;