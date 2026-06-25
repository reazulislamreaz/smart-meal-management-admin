import { Link } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import { avatars } from "@/data/adminData";
import SettingsLayout from "@/components/settings/SettingsLayout";

export function GeneralSettings() {
  const { profile } = useAppData();
  return (
    <SettingsLayout>
      <section className="identity-card settings-identity">
        <div className="identity">
          <img src={avatars[0]} alt="" />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
        </div>
        <Link to="/settings/edit-profile" className="dark-button">
          Edit Profile
        </Link>
      </section>
      <section className="info-card">
        <h3>Personal information</h3>
        <div className="info-grid three">
          <div>
            <span>Name</span>
            <strong>{profile.name}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{profile.email}</strong>
          </div>
          <div>
            <span>Phone Number</span>
            <strong>{profile.phone}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{profile.role}</strong>
          </div>
          <div>
            <span>Member Since</span>
            <strong>{profile.memberSince}</strong>
          </div>
          <div>
            <span>Address</span>
            <strong>{profile.address}</strong>
          </div>
        </div>
      </section>
    </SettingsLayout>
  );
}
export default GeneralSettings;
