import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Course } from "../components/UI/CourseCard";

interface CartContextType {
  cartItems: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem("unilearn_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("unilearn_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course: Course) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === course.id);
      if (exists) return prev; // Khong add trung lap
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
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
