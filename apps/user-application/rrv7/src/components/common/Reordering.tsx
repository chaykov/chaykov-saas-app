import { useEffect, useState } from "react";
import { type Transition } from "motion/react";
import * as motion from "motion/react-client";

export default function Reordering() {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const timeout = setTimeout(() => setOrder(shuffle(order)), 3000);
    return () => clearTimeout(timeout);
  }, [order]);

  return (
    <ul style={container}>
      {order.map((backgroundColor) => (
        <motion.li
          key={backgroundColor}
          layout
          transition={spring}
          style={{ ...item, backgroundColor }}
        />
      ))}
    </ul>
  );
}

const initialOrder = ["#758bff", "#432dd8", "#758bfd", "#432dd7"];

/**
 * ==============   Utils   ================
 */
function shuffle([...array]: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * ==============   Styles   ================
 */

const spring: Transition = {
  type: "spring",
  damping: 50,
  stiffness: 900,
};

const container: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  position: "relative",
  display: "flex",
  flexWrap: "wrap",
  gap: 2,
  width: 40,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
};

const item: React.CSSProperties = {
  width: 15,
  height: 15,
  borderRadius: "0px",
};