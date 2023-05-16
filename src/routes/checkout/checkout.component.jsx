import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

import './checkout.styles.scss';

const Checkout = () => {
    const {cartItems, addItemToCart} = useContext(CartContext);

    return (
        <div>
            <h1>Checkout Page!</h1>
            <div>
                {
                    cartItems.map((cartItem) => {
                        const {name, id, quantity} = cartItem;
                        return <div key={id}>
                            <h1>{name}</h1>
                            <span>{quantity}</span>
                            <br />
                            <span>decrement</span>
                            <br />
                            <span onClick={() => addItemToCart(cartItem)}>increment</span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Checkout;