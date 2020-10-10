import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios-orders';
import { IngredientList } from '../../shared/types';
import { IngredientName } from '../../shared/types';

export const addIngredient = createAction<IngredientName>('ADD_INGREDIENT');

export const removeIngredient = createAction<IngredientName>('REMOVE_INGREDIENT');

export const fetchIngredients = createAsyncThunk<IngredientList>(
    'burgerBuilder/fetchIngredients',
    async () => {
        const response = await axios.get<IngredientList>( '/ingredients.json' );
        return response.data;
    }
);