import React from 'react';
import classes from './dropItem.module.css';

const DropItem = ({
  dropdown, id, handleSetState, item: { icon, title, content },
}) => {
  const handleDropdown = () => {
    if (String(id) === dropdown) return handleSetState({ dropdown: '' });
    handleSetState({ dropdown: String(id) });
  };

  return (
    <>
      <div className={dropdown === String(id) ? `${classes.questionwrapper} ${classes.active}` : classes.questionwrapper}>
        <div className={classes.question} onClick={handleDropdown}>
          <h3>
            <img src={icon} alt="" />
            {' '}
            {title}
          </h3>
          <button>
            <svg className={dropdown === String(id) ? classes.active : ''} viewBox="0 0 320 512" width="100" title="angle-down">
              <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div className={dropdown === String(id) ? `${classes.answer} ${classes.active}` : classes.answer}>
        {content}

      </div>

    </>
  );
};

export default DropItem;
