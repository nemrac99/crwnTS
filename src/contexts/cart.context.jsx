import { createContext, useState, useEffect, useReducer } from 'react';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
  isCartOpen: true,
  setIsCartOpen: () => true,
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

const INITIAL_STATE  = {
  isCartOpen: true,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
}


/*
A reducer is a function that specifies how the state gets updated based on an action. 
An action is an object that describes what happened (type) and, optionally, carries some data (payload)
*/
const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'CLEAR_CART_ITEMS':
      //nada here yet but I assume to clear the entire cart in one fell swoop
    case 'some_other_action_type':
    case 'SET_CART_ITEMS':
      return {
        ...state,
        ...payload,
      };
    default: 
      throw new Error(`cart.context.cartReducer: Unhandled type of ${type}`)
  }
}

export const CartProvider = ({ children }) => {
  const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch] = 
    useReducer(cartReducer, INITIAL_STATE);

  const updateCartItemReducer = (newCartItems) => {
      /* generate newCarTotal */
      const newCartTotal = newCartItems.reduce(
        (total, cartItem) => total + cartItem.quantity * cartItem.price,
        0
      );
      /* generate newCartCount*/
      const newCartCount = newCartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
      );

      /*
      dispatch new acton with payload = {
        newCartItems,
        newCartTotal,
        newCartCount
      }
      */
      dispatch({type: 'SET_CART_ITEMS', payload: {cartItems: newCartItems, cartTotal: newCartTotal, cartCount: newCartCount} });
  };

  const addItemToCart = (productToAdd) => {
    const newCartItems = addCartItem(cartItems, productToAdd);
    updateCartItemReducer(newCartItems);
  };

  const removeItemToCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemReducer(newCartItems);
  };

  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCartItem(cartItems, cartItemToClear);
    updateCartItemReducer(newCartItems);
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
