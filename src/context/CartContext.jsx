"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "nailexpress_cart";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function cartReducer(state, action) {
  let newState;

  switch (action.type) {
    case "INIT":
      return action.payload;

    case "ADD_ITEM": {
      const { product, quantity = 1, selectedSize, selectedLength } = action.payload;
      const existingIndex = state.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedLength === selectedLength
      );

      if (existingIndex > -1) {
        newState = state.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newState = [
          ...state,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            category: product.category,
            selectedSize,
            selectedLength,
            quantity,
          },
        ];
      }
      break;
    }

    case "REMOVE_ITEM": {
      const { id, selectedSize, selectedLength } = action.payload;
      newState = state.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedLength === selectedLength
          )
      );
      break;
    }

    case "UPDATE_QUANTITY": {
      const { id, selectedSize, selectedLength, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter(
          (item) =>
            !(
              item.id === id &&
              item.selectedSize === selectedSize &&
              item.selectedLength === selectedLength
            )
        );
      } else {
        newState = state.map((item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedLength === selectedLength
            ? { ...item, quantity }
            : item
        );
      }
      break;
    }

    case "UPDATE_ITEM_OPTIONS": {
      const { id, oldSize, oldLength, newSize, newLength } = action.payload;
      if (oldSize === newSize && oldLength === newLength) return state;

      const targetIndex = state.findIndex(
        (item) =>
          item.id === id &&
          item.selectedSize === oldSize &&
          item.selectedLength === oldLength
      );
      if (targetIndex === -1) return state;

      const targetItem = state[targetIndex];

      const existingNewIndex = state.findIndex(
        (item) =>
          item.id === id &&
          item.selectedSize === newSize &&
          item.selectedLength === newLength
      );

      if (existingNewIndex > -1 && existingNewIndex !== targetIndex) {
        newState = state
          .map((item, i) =>
            i === existingNewIndex
              ? { ...item, quantity: item.quantity + targetItem.quantity }
              : item
          )
          .filter((_, i) => i !== targetIndex);
      } else {
        newState = state.map((item, i) =>
          i === targetIndex
            ? { ...item, selectedSize: newSize, selectedLength: newLength }
            : item
        );
      }
      break;
    }

    case "CLEAR_CART":
      newState = [];
      break;

    default:
      return state;
  }

  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    dispatch({ type: "INIT", payload: loadCart() });
  }, []);

  const addItem = (product, quantity = 1, selectedSize = "M", selectedLength = "medium") => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedSize, selectedLength } });
  };

  const removeItem = (id, selectedSize, selectedLength) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, selectedSize, selectedLength } });
  };

  const updateQuantity = (id, selectedSize, selectedLength, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, selectedSize, selectedLength, quantity } });
  };

  const updateItemOptions = (id, oldSize, oldLength, newSize, newLength) => {
    dispatch({
      type: "UPDATE_ITEM_OPTIONS",
      payload: { id, oldSize, oldLength, newSize, newLength },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemOptions,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
