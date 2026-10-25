import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { items, setIsOpen } = useCart();

  useEffect(() => {
    if (items.length > 0) {
      router.replace("/checkout");
    } else {
      setIsOpen?.(true);
      router.replace("/");
    }
  }, [items, router, setIsOpen]);

  return null;
}
