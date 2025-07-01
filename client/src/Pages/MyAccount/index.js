import React, { useState, useContext, useEffect } from 'react';
import { Tabs, Tab, Box, Button, TextField } from '@mui/material';
import { MdOutlineCloudUpload } from "react-icons/md";
import { MyContext } from '../../App';
import { useSnackbar } from 'notistack';

const MyAccount = () => {
  const { enqueueSnackbar } = useSnackbar();
  const context = useContext(MyContext);
  const user = context.user;

  const [tabIndex, setTabIndex] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user?._id || user?.id;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/User/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || 'Failed to update');

      // update localStorage and context
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      context.setUser(data.user);

      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar('New and confirm passwords do not match', { variant: 'error' });
      return;
    }

    const match = await compareOldPassword(passwordData.oldPassword);
    if (!match) {
      enqueueSnackbar('Old password is incorrect', { variant: 'error' });
      return;
    }

    try {
      const userId = user?._id || user?.id;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/User/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordData.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || 'Password update failed');

      enqueueSnackbar('Password updated successfully', { variant: 'success' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const compareOldPassword = async (password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/User/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileData.email, password }),
      });
      return res.status === 200;
    } catch (err) {
      console.error("Password match check failed:", err);
      return false;
    }
  };
  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>

        <div className="myAccBox card border-0">
          <Box className="css-1gsv261">
            <Tabs value={tabIndex} onChange={handleTabChange} TabIndicatorProps={{ className: 'MuiTabs-indicator' }} >
              <Tab label="Edit Profile" />
              <Tab label="Change Password" />
            </Tabs>
          </Box>

          {/* -------------------- Edit Profile Tab -------------------- */}
          {tabIndex === 0 && (
            <Box className="css-19kzrtu">
              <form onSubmit={handleProfileSubmit}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="userImage d-flex align-items-center justify-content-center">
                      <div className="overlay d-flex align-items-center justify-content-center">
                        <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                          <MdOutlineCloudUpload />
                        </label>
                        <input type="file" id="fileUpload" name="images" style={{ display: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField name="name" label="Name" variant="outlined" value={profileData.name} onChange={handleProfileChange} className="w-100" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField name="email" label="Email" variant="outlined" value={profileData.email} disabled className="w-100" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField name="phone" label="Phone" variant="outlined" value={profileData.phone} onChange={handleProfileChange} className="w-100" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button type="submit" className="btn-blue bg-red btn-lg btn-big" variant="contained" >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box className="css-19kzrtu">
              <form onSubmit={handlePasswordSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField name="oldPassword" label="Old Password" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-100" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField name="newPassword" label="New Password" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-100" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField name="confirmPassword" label="Confirm Password" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-100" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button type="submit" className="btn-blue bg-red btn-lg btn-big" variant="contained" >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Box>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
