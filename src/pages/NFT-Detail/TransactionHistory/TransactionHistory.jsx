import classes from "./TransactionHistory.module.css";

const TransactionHistory = () => {
  const tabs = ["All", "Mints", "Transfers", "Sales", "Listings", "CanceledListings"];
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Transaction History</div>
      <div className={classes.tabs}>
        {tabs.map((tab, idx) => (
          <div key={idx} className={classes.tab}>
            {tab}
          </div>
        ))}
      </div>
      <div className={classes.search}>search</div>
      <div className={classes.listContainer}>
        {Array(20)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className={classes.list}>
              <div className={classes.tag}>Transfers</div>
              <div className={classes.item}>
                <div>From</div>
                <div>To</div>
                <div>2 Days ago</div>
                <div>icon</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
