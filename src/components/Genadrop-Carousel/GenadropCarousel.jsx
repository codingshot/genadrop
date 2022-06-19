import { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarousel.module.css";
import iconRight from "../../assets/icon-angle-right.svg";
import iconLeft from "../../assets/icon-angle-left.svg";

const GenadropCarousel = ({ children, cardWidth, gap = 16 }) => {
  const cardContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    length: children.length,
    wrapperWidth: 0,
    slideNumberOfCounts: 0,
  });

  const { length, wrapperWidth, slideNumberOfCounts } = state;

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

  useEffect(() => {
    handleSetState({ wrapperWidth: wrapperRef.current && wrapperRef.current.getBoundingClientRect().width });
    window.addEventListener("resize", () => {
      handleSetState({ wrapperWidth: wrapperRef.current && wrapperRef.current.getBoundingClientRect().width });
    });
  }, []);

  useEffect(() => {
    cardContainerRef.current.style.transform = `translateX(-${
      slideActiveCount * cardWidth + slideActiveCount * gap
    }px)`;
  }, [slideActiveCount]);

  useEffect(() => {
    const slideNumberOfCounts = length - Math.floor(wrapperWidth / (cardWidth + gap / 2));
    handleSetState({ slideNumberOfCounts });
  }, [wrapperWidth]);

  return (
    <div className={classes.container}>
      <div ref={wrapperRef} className={classes.wrapper}>
        <div style={{ gap }} ref={cardContainerRef} className={classes.cardContainer}>
          {children}
        </div>
        {slideNumberOfCounts ? (
          <>
            <button onClick={handleSlideLeft} className={classes.ctrlBtn_left}>
              <img src={iconLeft} alt="" />
            </button>
            <button onClick={handleSlideRight} className={classes.ctrlBtn_right}>
              <img src={iconRight} alt="" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GenadropCarousel;
