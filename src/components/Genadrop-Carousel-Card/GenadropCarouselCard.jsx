/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarouselCard.module.css";
import iconRight from "../../assets/icon-angle-right.svg";
import iconLeft from "../../assets/icon-angle-left.svg";

const GenadropCarouselCard = ({ children, cardWidth, gap = 16 }) => {
  const cardContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    wrapperWidth: window.innerWidth,
    slideNumberOfCounts: 0,
    start: 0,
    move: false,
    end: false,
    dir: "",
  });

  const { wrapperWidth, slideNumberOfCounts, start, move, end, dir } = state;
  const [slideActiveCount, setSlideActiveCount] = useState(0);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSlideLeft = () => {
    if (slideActiveCount <= 0) return;
    setSlideActiveCount((sc) => sc - 1);
  };

  const handleSlideRight = () => {
    if (slideActiveCount >= slideNumberOfCounts) return;
    setSlideActiveCount((sc) => sc + 1);
  };

  // const bind = useWheel(({ wheeling, movement: [x] }) => {
  //   if (x > 0 && run.current) {
  //     handleSlideRight();
  //     run.current = false;
  //   } else if (x < 0 && run.current) {
  //     handleSlideLeft();
  //     run.current = false;
  //   }

  //   if (!wheeling) {
  //     run.current = true;
  //   }
  // });

  useEffect(() => {
    cardContainerRef.current.style.transform = `translateX(-${
      slideActiveCount * cardWidth + slideActiveCount * gap
    }px)`;
  }, [slideActiveCount]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      handleSetState({ wrapperWidth: wrapperRef.current && wrapperRef.current.getBoundingClientRect().width });
    });
  }, []);

  useEffect(() => {
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    const length = children.length;
    const slideNumberOfCounts = length - Math.floor(width / (cardWidth + gap / 1.5));
    handleSetState({ slideNumberOfCounts });
    if (!slideNumberOfCounts) {
      setSlideActiveCount(0);
    }
  }, [wrapperWidth, children]);

  useEffect(() => {
    // touch event for mobile
    wrapperRef.current.addEventListener("touchstart", (e) => {
      let event = e.changedTouches ? e.changedTouches[0] : e;
      let x = event.clientX;
      handleSetState({ start: x });
    });

    wrapperRef.current.addEventListener("touchmove", () => {
      handleSetState({ move: true, end: false });
    });

    wrapperRef.current.addEventListener("touchend", () => {
      handleSetState({ end: true });
    });
  }, []);

  useEffect(() => {
    if (move && start) {
      if (wrapperWidth / 2 > start) {
        handleSetState({ dir: "left" });
      } else {
        handleSetState({ dir: "right" });
      }
      handleSetState({ start: 0, move: false, end: false });
    }
  }, [end]);

  useEffect(() => {
    if (!dir) return;
    if (dir === "right") {
      handleSlideRight();
    } else if (dir === "left") {
      handleSlideLeft();
    }
    handleSetState({ dir: "" });
  }, [dir]);

  return (
    <div className={classes.container}>
      <div ref={wrapperRef} className={classes.wrapper}>
        <div style={{ gap }} ref={cardContainerRef} className={classes.cardContainer}>
          {children}
        </div>
        {slideNumberOfCounts ? (
          <>
            <button
              type="button"
              onClick={handleSlideLeft}
              className={`${classes.ctrlBtn_left} ${slideActiveCount && classes.active}`}
            >
              <img src={iconLeft} alt="" />
            </button>
            <button
              type="button"
              onClick={handleSlideRight}
              className={`${classes.ctrlBtn_right} ${slideActiveCount < slideNumberOfCounts && classes.active}`}
            >
              <img src={iconRight} alt="" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GenadropCarouselCard;
