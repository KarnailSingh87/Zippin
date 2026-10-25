import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Store Facility management page has been removed as the platform operates
 * on a single central fulfillment facility: Zippin Hamirpur Hub #501.
 * Dynamic delivery surge pricing multiplier and operational controls are handled centrally.
 */
export default function StoreFacilityRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/orders");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
        Redirecting to Operations & Dispatch...
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        Store operations and fulfillment pipeline are managed directly through Customer Orders and Fleet Dispatch.
      </p>
    </div>
  );
}
