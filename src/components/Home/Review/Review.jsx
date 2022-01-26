import classes from './Review.module.css';
import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/swiper.scss'

SwiperCore.use([Autoplay, Pagination, Navigation]);

const Feedback = () => {

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Some people think we’re <span>Pretty Cool.</span></div>
      <div className={classes.description}>
        See what people on twitter are saying about GenaDrop.
      </div>

      <div className={classes.review}>
        <img src="./assets/tweet1.png" alt="" />
        <img src="./assets/tweet2.png" alt="" />
        <img src="./assets/tweet3.png" alt="" />
        <img src="./assets/tweet4.png" alt="" />
      </div>

    </div>
  )
}

export default Feedback;