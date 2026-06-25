import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import BarChart from "@/components/common/BarChart";

export function SubscriptionOverview() {
  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          <Link to="/subscription/plans" className="dark-button">
            Subscription plan
          </Link>
        }
      />
      <p className="subtitle">Manage your subscription plan.</p>
      <div className="subscription-stats">
        <div>
          <span>TOTAL</span>
          <strong>1309</strong>
          <small>Subscribers</small>
          <i />
        </div>
        <div>
          <span>ANNUAL</span>
          <strong>1309</strong>
          <small>Subscribers</small>
          <i className="blue" />
        </div>
        <div>
          <span>SUBSCRIPTION</span>
          <strong>$20</strong>
          <small>Monthly revenue</small>
          <i className="orange" />
        </div>
      </div>
      <BarChart title="Revenue Breakdown" />
    </>
  );
}
export default SubscriptionOverview;
