import { useRef, useEffect, useState } from "react";

import { ReactComponent as InfoIcon } from "../../assets/tooltip.svg";
import classes from "./GenadropTooltip.module.css";

const GenadropToolTip = ({ content }) => {
  const cardRef = useRef(null);
  const [mouseOver, setMouseOver] = useState(false);
  const [dim, setDim] = useState({
    width: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (!cardRef.current) return;
      const { left, right, width } = cardRef.current.getBoundingClientRect();
      setDim({ left, right, width });
    });
  }, []);

  useEffect(() => {
    const { left, width, right } = dim;
    setTimeout(() => {
      if (left <= 32) {
        cardRef.current.style.transform = `translateX(${width / 3}px) translateY(-100%)`;
      }
      if (window.innerWidth - right <= 32) {
        cardRef.current.style.transform = `translateX(${-width / 3}px) translateY(-100%)`;
      }
      if (window.innerWidth - right > width / 1.5 && left > width / 1.5) {
        cardRef.current.style.transform = "translateX(0px) translateY(-100%)";
      }
    }, 100);
  }, [dim, mouseOver]);

  return (
    <div onMouseOut={() => setMouseOver(false)} onMouseOver={() => setMouseOver(true)} className={classes.container}>
      <InfoIcon />
      <div ref={cardRef} className={classes.card}>
        {content}
      </div>
    </div>
  );
};

export default GenadropToolTip;
