import React from "react";
import { ProfileDashboard } from "../../components/dashboard/profile-dashboard/profile-dashboard";
import { useBackgroundSelector } from "../../hooks";
import { getActiveAccount } from "../../../Background/redux-slices/selectors/accountSelectors";

const DashboardPage = () => {
    const activeAccount = useBackgroundSelector(getActiveAccount);

    return (
        <ProfileDashboard activeAccount={activeAccount} />
    )
}

export default DashboardPage; 