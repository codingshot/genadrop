import classes from './FAQCard.module.css';

const FQACard = ({ dropdown, id, handleSetState, FAQ: {question, answer} }) => {

  const handleDropdown = () => {
    if(String(id) === dropdown) return handleSetState({ dropdown: '' })
    handleSetState({ dropdown: String(id) })
  }

  return (
    <div className={classes.container}>
      <div onClick={handleDropdown} className={classes.question}>
        <span>Q.</span>
        <p>{question}</p>
        <span>{dropdown === String(id) ? <img src="/assets/close-icon.svg" alt="" /> : <img src="/assets/open-icon.svg" alt="" /> }</span>
      </div>
      <div className={`${classes.answer} ${dropdown === String(id) && classes.dropdown}`}>
        <span>A.</span>
        <p>{answer} {id === 0 ? <a target="_blank" rel="noreferrer" href="https://www.youtube.com/watch?v=Yx3zimPPwjA">demo.</a> : ''} </p>
      </div>
    </div>
  )
}

export default FQACard;