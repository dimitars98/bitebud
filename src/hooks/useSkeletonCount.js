import { useEffect, useState } from "react";

export default function useSkeletonCount() {
  const [count, setCount] = useState(6);

  useEffect(() => {
    function updateCount() {
      const width = window.innerWidth;
      let columns = 1;

      if (width >= 1280) columns = 4; // lg
      else if (width >= 1024) columns = 3; // md
      else if (width >= 640) columns = 2; // sm

      const rows = 3;
      setCount(columns * rows);
    }

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return count;
}
