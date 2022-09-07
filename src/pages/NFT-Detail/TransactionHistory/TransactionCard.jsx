import classes from "./TransactionHistory.module.css";

const Transaction = ({ txn, setState }) => {
  return (
    <div onClick={() => setState({ transaction: null })} className={`${classes.txnCard} ${txn && classes.active}`}>
      <div>card</div>
    </div>
  );
};

export default Transaction;
