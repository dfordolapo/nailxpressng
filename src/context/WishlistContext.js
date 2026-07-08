"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "nailexpress_wishlist";

function loadWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function wishlistReducer(state, action) {
  let newState;

  switch (action.type) {
    case "INIT":
      return action.payload;

    case "ADD_ITEM": {
      const { product } = action.payload;
      if (state.some((item) => item.id === product.id)) return state;
      newState = [
        ...state,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0],
          category: product.category,
        },
      ];
      break;
    }

    case "REMOVE_ITEM":
      newState = state.filter((item) => item.id !== action.payload);
      break;

    case "CLEAR_WISHLIST":
      newState = [];
      break;

    default:
      return state;
  }

  saveWishlist(newState);
  return newState;
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, []);

  useEffect(() => {
    dispatch({ type: "INIT", payload: loadWishlist() });
  }, []);

  const addItem = (product) => {
    dispatch({ type: "ADD_ITEM", payload: { product } });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const toggleItem = (product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isInWishlist = (id) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
