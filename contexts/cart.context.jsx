import { createContext, useState, useEffect } from "react";

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

export const CartProvider = ({children}) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0)
    const [cartTotal, setCartTotal] = useState(0)

    useEffect(() => {
        const newCartCount = cartItems.reduce((total, cartIem) => total + cartIem.quantity, 0)
        setCartCount(newCartCount)
    }, [cartItems])

    useEffect(() => {
        const newCartTotal = cartItems.reduce((total, cartIem) => total + cartIem.quantity * cartIem.price, 0)
        setCartTotal(newCartTotal)
    }, [cartItems])

    const addItemToCart = (productToAdd) => {
        setCartItems(addCartItems(cartItems, productToAdd));
    }

    const removeItemFromCart = (cartItemToRemove) => {
        setCartItems(removeCartItems(cartItems, cartItemToRemove));
    }

    const clearItemFromCart = (cartItemToClear) => {
        setCartItems(clearCartItems(cartItems, cartItemToClear));
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