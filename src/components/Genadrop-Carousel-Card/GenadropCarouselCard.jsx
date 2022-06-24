import { useEffect, useRef, useState } from "react";
import classes from "./GenadropCarouselCard.module.css";
import iconRight from "../../assets/icon-angle-right.svg";
import iconLeft from "../../assets/icon-angle-left.svg";

const GenadropCarouselCard = ({ children, cardWidth, gap = 16 }) => {
  const cardContainerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [state, setState] = useState({
    wrapperWidth: 0,
    slideNumberOfCounts: 0,
  });

  const { wrapperWidth, slideNumberOfCounts } = state;
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

  return (
    <div className={classes.container}>
      <div ref={wrapperRef} className={classes.wrapper}>
        <div style={{ gap }} ref={cardContainerRef} className={classes.cardContainer}>
          {children}
        </div>
        {slideNumberOfCounts ? (
          <>
            <button
              onClick={handleSlideLeft}
              className={`${classes.ctrlBtn_left} ${slideActiveCount && classes.active}`}
            >
              <img src={iconLeft} alt="" />
            </button>
            <button
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
