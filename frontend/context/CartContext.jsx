import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext({});
const MAX_QTY = 10; // Maximum quantity allowed per item (TC-3.5.02)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blinkit_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("blinkit_cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + (i.qty || i.quantity || 0), 0);
  const totalPrice = items.reduce((s, i) => s + i.price * (i.qty || i.quantity || 0), 0);
  const totalSavings = items.reduce(
    (s, i) => s + Math.max(0, (i.mrp || i.price) - i.price) * (i.qty || i.quantity || 0),
    0
  );

  function addItem(product) {
    const id = product._id || product.productId || (product.product && product.product._id);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === id);
      if (existing) {
        if (existing.qty >= 10 || existing.qty >= MAX_QTY) {
          alert("Maximum quantity limit (10 units) reached for this product.");
          return prev;
        }
        return prev.map((i) =>
          i.productId === id
            ? {
                ...i,
                qty: Math.min(MAX_QTY, i.qty + 1),
                quantity: Math.min(MAX_QTY, i.qty + 1),
              }
            : i
        );
      }
      const newItem = {
        productId: id,
        product: {
          _id: id,
          title: product.title || product.name,
          name: product.title || product.name,
          price: product.price,
          mrp: product.mrp || product.price,
          images: product.images || [{ url: product.image || "" }],
        },
        name: product.title || product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit || "",
        image: product.images?.[0]?.url || product.image || "",
        qty: 1,
        quantity: 1,
      };
      return [...prev, newItem];
    });
  }

  function removeItem(productId) {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (item && (item.qty > 1 || item.quantity > 1)) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, qty: i.qty - 1, quantity: i.qty - 1 }
            : i
        );
      }
      return prev.filter((i) => i.productId !== productId);
    });
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      const capped = Math.min(MAX_QTY, qty);
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? { ...i, qty: capped, quantity: capped }
            : i
        )
      );
    }
  }

  function clearCart() {
    setItems([]);
  }

  // Batch re-order with dynamic price recalculation & stock verification
  async function reorder(orderItems) {
    if (!orderItems || !orderItems.length) return;
    const newItems = [];
    let outOfStockCount = 0;

    for (const item of orderItems) {
      const prodId = item.productId?._id || item.productId || item.product?._id;
      let livePrice = item.price;

      try {
        const res = await fetch(`/api/products/${prodId}`);
        if (res.ok) {
          const liveProd = await res.json();
          // Stock Availability Check (TC-5.3.01)
          if (liveProd.stock === 0 || liveProd.isAvailable === false) {
            outOfStockCount++;
            continue;
          }
          // Dynamic Price Recalculation (TC-5.4.01)
          livePrice = liveProd.price;
        }
      } catch (e) {}

      const cleanItem = {
        productId: prodId,
        product: {
          _id: prodId,
          title: item.name || item.title,
          name: item.name || item.title,
          price: livePrice,
          mrp: item.mrp || livePrice,
          images: [{ url: item.image || "" }],
        },
        name: item.name || item.title,
        price: livePrice,
        mrp: item.mrp || livePrice,
        unit: item.unit || "",
        image: item.image || "",
        qty: Math.min(item.qty || item.quantity || 1, MAX_QTY),
        quantity: Math.min(item.qty || item.quantity || 1, MAX_QTY),
      };
      newItems.push(cleanItem);
    }

    if (outOfStockCount > 0) {
      alert(`${outOfStockCount} item(s) from your previous order were out of stock and skipped.`);
    }

    setItems((prev) => {
      const combined = [...prev];
      for (const ni of newItems) {
        const idx = combined.findIndex((c) => c.productId === ni.productId);
        if (idx >= 0) {
          combined[idx].qty = Math.min(MAX_QTY, combined[idx].qty + ni.qty);
          combined[idx].quantity = combined[idx].qty;
        } else {
          combined.push(ni);
        }
      }
      return combined;
    });
    setIsOpen(true);
  }

  const getQty = useCallback(
    (productId) => {
      return items.find((i) => i.productId === productId)?.qty || 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        totalSavings,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        getQty,
        isOpen,
        setIsOpen,
        reorder,
        addMultiple: reorder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
