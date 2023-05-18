/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useRef, useEffect, useState } from "react";

import { ReactComponent as InfoIcon } from "../../assets/tooltip.svg";
import classes from "./GenadropTooltip.module.css";

const GenadropToolTip = ({ content, fill = "#3d3d3d" }) => {
  const cardRef = useRef(null);
  const [mouseOver, setMouseOver] = useState(false);

  const adjustTooltip = () => {
    if (!cardRef.current) return;
    const { left, right, width } = cardRef.current.getBoundingClientRect();
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
  };

  useEffect(() => {
    adjustTooltip();
    window.addEventListener("resize", () => {
      adjustTooltip();
    });
  }, [mouseOver]);

  return (
    <div onMouseOut={() => setMouseOver(false)} onMouseOver={() => setMouseOver(true)} className={classes.container}>
      <InfoIcon style={{ fill }} />
      <div ref={cardRef} className={classes.card}>
        {content}
      </div>
    </div>
  );
};

export default GenadropToolTip;
