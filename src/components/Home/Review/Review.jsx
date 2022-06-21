import { useEffect, useRef, useState } from "react";
import GenadropCarousel from "../../Genadrop-Carousel/GenadropCarousel";
import classes from "./Review.module.css";
import { reviews } from "./Reviews-Script";

const Review = () => {
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
  });

  const { cardWidth } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const formattedContent = (content) => {
    return content.substring(0, 140) + "...";
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        Keep Up To Date for <span>Early Access</span>
      </div>
      <div className={classes.description}>See what the buzz about GenaDrop is on twitter.</div>
      <GenadropCarousel cardWidth={cardWidth} gap={16}>
        {reviews.map((review, id) => (
          <a href={review.url} target="_blank" rel="noreferrer" key={id} ref={cardRef} className={classes.card}>
            <div className={classes.header}>
              <img src={review.icon} alt="" className={classes.icon} />
              <div className={classes.date}>{review.date}</div>
              <div className={classes.domain}>{review.domain}</div>
            </div>
            <img src={review.banner} alt="" className={classes.banner} />
            <div className={classes.content}>{formattedContent(review.content)}</div>
            <div className={classes.line}></div>
            <div className={classes.footer}>
              <img className={classes.thumbnail} src={review.thumbnail} alt="" />
              <div className={classes.wrapper}>
                <div className={classes.name}>{review.name}</div>
                <div className={classes.handle}>{review.handle}</div>
              </div>
            </div>
          </a>
        ))}
      </GenadropCarousel>
    </div>
  );
};

export default Review;
