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

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartCount: [],
    addItemToCart: () => {},
    cartCount: 0,
})

export const CartProvider = ({children}) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const newCartCount = cartItems.reduce((total, cartIem) => total + cartIem.quantity, 0)
        setCartCount(newCartCount)
    }, [cartItems])

    const addItemToCart = (productToAdd) => {
        setCartItems(addCartItems(cartItems, productToAdd));
    }

    const value = {isCartOpen, setIsCartOpen, addItemToCart, cartItems, cartCount};
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}