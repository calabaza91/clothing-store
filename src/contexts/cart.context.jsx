import { createContext, useReducer } from "react";

import { createAction } from "../utils/reducers/reduders.utils";

const addCartItems = (cartItems, productToAdd) => {
    // find if cartItems contains productToAdd
    const existingCartItems = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
    )

    // if found, increment quantity
    if(existingCartItems){
        return cartItems.map((cartItem => 
            cartItem.id === productToAdd.id
                ? {...cartItem, quantity: cartItem.quantity + 1}
                : cartItem
        ))
    } 

    // Return new array with modified cartItems / new cart items
    return [...cartItems, {...productToAdd, quantity: 1}]
}

const removeCartItems = (cartItems, cartItemToRemove) => {
    //find cart item to remove
    const existingCartItems = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    ) 

    //check if quantity === 1. If true, remove item from cart
    if(existingCartItems.quantity === 1){
        return cartItems.filter(cartIem => cartIem.id !== cartItemToRemove.id)
    }

    //return cart items with matching cart item with reduced quantity
    return cartItems.map((cartItem => 
        cartItem.id === cartItemToRemove.id
            ? {...cartItem, quantity: cartItem.quantity - 1}
            : cartItem
    ))
}

const clearCartItems = (cartItems, cartItemToClear) => {
    return cartItems.filter(cartIem => cartIem.id !== cartItemToClear.id)
}

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0
})

const INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0
}

const CART_ACTION_TYPES = {
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN'
}

const cartReducer = (state, action) => {
    const {type, payload} = action;

    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload
            };

        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload,
            };
    
        default:
            throw new Error(`unhandled type of ${type} in cartReducer`);
    }
}

export const CartProvider = ({children}) => {

    const [{ cartCount, cartItems, cartTotal, isCartOpen}, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  
    const updateCartItemsReducer = (newCartItems) => {

        const newCartCount = newCartItems.reduce((total, cartIem) => total + cartIem.quantity, 0)

        const newCartTotal = newCartItems.reduce((total, cartIem) => total + cartIem.quantity * cartIem.price, 0)

        dispatch(
            createAction(
                CART_ACTION_TYPES.SET_CART_ITEMS, 
                { 
                    cartItems: newCartItems,
                    cartTotal: newCartTotal, 
                    cartCount: newCartCount 
                }
            )
        )
    }

    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItems(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    }

    const removeItemFromCart = (cartItemToRemove) => {
        const newCartItems = removeCartItems(cartItems, cartItemToRemove);
        updateCartItemsReducer(newCartItems);

    }

    const clearItemFromCart = (cartItemToClear) => {
        const newCartItems = clearCartItems(cartItems, cartItemToClear);
        updateCartItemsReducer(newCartItems);

    }

    const setIsCartOpen = (bool) => {
        dispatch(
            createAction(
                CART_ACTION_TYPES.SET_IS_CART_OPEN, 
                bool
            )
        )
    }

    const value = {
        isCartOpen,
        setIsCartOpen,
        addItemToCart,
        removeItemFromCart,
        clearItemFromCart,
        cartItems,
        cartCount,
        cartTotal
    };
    
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}