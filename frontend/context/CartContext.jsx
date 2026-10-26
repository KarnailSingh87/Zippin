import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext({});
const MAX_QTY = 10; // Maximum quantity allowed per item (TC-3.5.02)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const toastCtx = useToast();
  const showToast = toastCtx?.showToast;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zippin_cart") || localStorage.getItem("blinkit_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("zippin_cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + (i.qty || i.quantity || 0), 0);
  const totalPrice = items.reduce((s, i) => s + i.price * (i.qty || i.quantity || 0), 0);
  const totalSavings = items.reduce(
    (s, i) => s + Math.max(0, (i.mrp || i.price) - i.price) * (i.qty || i.quantity || 0),
    0
  );

  function addItem(product) {
    const id = product._id || product.productId || (product.product && product.product._id);
    const availableStock =
      typeof product.stock === "number"
        ? product.stock
        : product.product && typeof product.product.stock === "number"
        ? product.product.stock
        : 999;

    // Check if out of stock or unavailable
    if (product.isAvailable === false || availableStock <= 0) {
      const msg = "This item is currently out of stock / coming soon!";
      if (showToast) showToast(msg, { type: "error" });
      else if (typeof alert !== "undefined") alert(msg);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === id);
      if (existing) {
        const currentQty = existing.qty || existing.quantity || 1;
        if (currentQty >= availableStock) {
          const msg = `Only ${availableStock} item(s) available in stock. You have reached the limit.`;
          if (showToast) showToast(msg, { type: "warning" });
          else if (typeof alert !== "undefined") alert(msg);
          return prev;
        }
        if (currentQty >= 10 || currentQty >= MAX_QTY) {
          const msg = "Maximum quantity limit (10 units) reached for this product.";
          if (showToast) showToast(msg, { type: "warning" });
          else if (typeof alert !== "undefined") alert(msg);
          return prev;
        }

        const nextQty = Math.min(MAX_QTY, availableStock, currentQty + 1);

        // Low stock urgency notification when <= 3 items
        if (availableStock <= 3) {
          const remaining = availableStock - nextQty;
          const msg =
            remaining === 0
              ? `⚠️ You've added all ${availableStock} units in stock!`
              : `⚠️ Hurry! Only ${remaining} more item(s) left in stock.`;
          if (showToast) showToast(msg, { type: "warning" });
        }

        return prev.map((i) =>
          i.productId === id
            ? {
                ...i,
                qty: nextQty,
                quantity: nextQty,
                stock: availableStock,
              }
            : i
        );
      }

      // First unit added: if <= 3 items in stock, alert user
      if (availableStock <= 3) {
        const msg =
          availableStock === 1
            ? "⚠️ Hurry! Only 1 item left in stock!"
            : `⚠️ Hurry! Only ${availableStock} items left in stock. Order before it sells out!`;
        if (showToast) showToast(msg, { type: "warning" });
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
          stock: availableStock,
        },
        name: product.title || product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit || "",
        image: product.images?.[0]?.url || product.image || "",
        stock: availableStock,
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
      setItems((prev) =>
        prev.map((i) => {
          if (i.productId !== productId) return i;
          const limit = Math.min(MAX_QTY, i.stock || MAX_QTY);
          const capped = Math.min(limit, qty);
          return { ...i, qty: capped, quantity: capped };
        })
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
