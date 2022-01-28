import classes from './Review.module.css';
import TweetEmbed from 'react-tweet-embed';

const Review = () => {

  const reviews = [
    "1473516385691062273",
    "1484327197854736391",
    "1484447708668649475",
    "1473516385691062273",
  ]

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Some people think we’re <span>Pretty Cool.</span></div>
      <div className={classes.description}>
        See what people on twitter are saying about GenaDrop.
      </div>

      <div className={classes.review}>
        {/* <img src="/assets/tweet1.png" alt="" />
        <img src="/assets/tweet2.png" alt="" />
        <img src="/assets/tweet3.png" alt="" />
        <img src="/assets/tweet4.png" alt="" /> */}

        {reviews.map((tweet) => {
          return <span className={classes.tweet}><TweetEmbed id={tweet} placeholder={'loading'} /></span>

        })}
        
      </div>

    </div>
  )
}

export default Review;