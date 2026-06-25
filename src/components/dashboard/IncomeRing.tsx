export function IncomeRing() {
  return (
    <div className="income-card">
      <h3>Monthly income</h3>
      <p>Your income property calculated each month.</p>
      <div className="ring">
        <span>45.75%</span>
      </div>
      <small>
        You earn $500K yearly. It is higher than last month.
        <br />
        Keep up your good work!
      </small>
      <div className="income-foot">
        <div>
          <span>Today</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
        <div>
          <span>Weekly</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
        <div>
          <span>Monthly</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
      </div>
    </div>
  );
}
export default IncomeRing;
