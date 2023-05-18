/* eslint-disable prefer-const */
/* eslint-disable no-else-return */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarouselScreen.module.css";
import iconRight from "../../assets/icon-angle-right.svg";
import iconLeft from "../../assets/icon-angle-left.svg";

const GenadropCarouselScreen = ({ children, cardWidth, gap = 16, init = true }) => {
  const cardContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    wrapperWidth: window.innerWidth,
    slideCount: 0,
    scrollLength: 0,
    start: 0,
    move: false,
    end: false,
    dir: "",
  });

  const { wrapperWidth, slideCount, scrollLength, start, move, end, dir } = state;
  const [slideActiveCount, setSlideActiveCount] = useState(0);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSlideLeft = () => {
    // if (slideActiveCount <= 0) return;
    setSlideActiveCount((sc) => sc - 1);
  };

  const handleSlideRight = () => {
    // if (slideActiveCount >= slideCount) return;
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
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    let cardsInView = Math.floor(width / (cardWidth + gap / 2));
    if (width > 600) {
      cardsInView = Math.floor(cardsInView / 3);
    }
    const scrollLength = slideActiveCount * cardsInView * cardWidth + slideActiveCount * cardsInView * gap;
    handleSetState({ scrollLength });
    cardContainerRef.current.style.transform = `translateX(-${scrollLength}px)`;
  }, [slideActiveCount]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      handleSetState({ wrapperWidth: wrapperRef.current && wrapperRef.current.getBoundingClientRect().width });
    });
  }, []);

  const getCount = (len, view) => {
    if (len % view === 0) {
      return Math.floor(len / view) - 1;
    } else {
      return Math.floor(len / view);
    }
  };

  useEffect(() => {
    const width = wrapperRef.current && wrapperRef.current.getBoundingClientRect().width;
    const cardTotalLength = children.length;
    const cardsInView = Math.floor(width / (cardWidth + gap / 2));
    const slideCount = getCount(cardTotalLength, cardsInView);
    handleSetState({ slideCount });
    if (!slideCount) {
      setSlideActiveCount(0);
    }
    let res = Math.floor(Math.floor(scrollLength / (cardWidth + gap / 2)) / slideActiveCount / cardsInView);
    if (slideActiveCount === 0) return;
    setSlideActiveCount(res);
  }, [wrapperWidth, children]);

  useEffect(() => {
    setSlideActiveCount(0);
  }, [init]);

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
        {slideCount ? (
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
              className={`${classes.ctrlBtn_right} ${slideActiveCount < slideCount && classes.active}`}
            >
              <img src={iconRight} alt="" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GenadropCarouselScreen;
