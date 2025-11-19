import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const update = ({ window }: { window: { width: number } }) => {
      setIsMobile(window.width < MOBILE_BREAKPOINT);
    };

    // inicializar
    const { width } = Dimensions.get("window");
    setIsMobile(width < MOBILE_BREAKPOINT);

    // suscribirse a cambios
    const subscription = Dimensions.addEventListener("change", update);

    return () => {
      subscription.remove();
    };
  }, []);

  return isMobile;
}
