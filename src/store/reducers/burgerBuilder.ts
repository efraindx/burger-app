import { addIngredient, removeIngredient, fetchIngredients } from '../actions/burgerBuilder';
import { IngredientList } from '../../shared/types';
import { createReducer } from '@reduxjs/toolkit';

interface BurgerBuilderState {
    ingredients: IngredientList | null;
    totalPrice: number;
    error: boolean;
    building: boolean;
}

const initialState: BurgerBuilderState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
};

const reducer = createReducer(initialState, builder => {
    builder.addCase(addIngredient, (state, action) => {
        if (state.ingredients) {
            state.ingredients[action.payload].count = state.ingredients[action.payload].count + 1;
            state.totalPrice = state.totalPrice + state.ingredients[action.payload].price;
            state.building = true;
        }
    })
    builder.addCase(removeIngredient, (state, action) => {
        if (state.ingredients) {
            state.ingredients[action.payload].count = state.ingredients[action.payload].count - 1;
            state.totalPrice = state.totalPrice - state.ingredients[action.payload].price;
            state.building = true;
        }
    })
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.totalPrice = 4;
        state.error = false;
        state.building = false;
    })
    builder.addCase(fetchIngredients.rejected, state => {
        state.error = true;
    })
});

export default reducer;