import React, { useState } from 'react';
import { Tabs, Tab, Box, Button, TextField } from '@mui/material';

const MyAccount = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>

        <div className="myAccBox card border-0 MuiBox-root css-8atqhb">
          <Box className="MuiBox-root css-1gsv261">
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              className="MuiTabs-root css-orq8zk"
              TabIndicatorProps={{ className: 'MuiTabs-indicator css-ttwr4n' }}
            >
              <Tab
                label="Edit Profile"
                className={`MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 ${
                  tabIndex === 0 ? 'Mui-selected' : ''
                }`}
              />
              <Tab
                label="Change Password"
                className={`MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 ${
                  tabIndex === 1 ? 'Mui-selected' : ''
                }`}
              />
            </Tabs>
          </Box>

          {/* -------------------- Edit Profile Tab -------------------- */}
          {tabIndex === 0 && (
            <Box role="tabpanel" id="simple-tabpanel-0" className="MuiBox-root css-19kzrtu">
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <div className="userImage d-flex align-items-center justify-content-center">
                      <img
                        src="https://api.spicezgold.com/download/https://lh3.googleusercontent.com/a/ACg8ocLbI1dZ0wCWPl2eJPLpVW8UnmOAy43xHgKiQv0FsvpgFmIRGA=s96-c"
                        alt="User"
                      />
                      <div className="overlay d-flex align-items-center justify-content-center">
                        <input type="file" name="images" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            defaultValue="Kenil Shah"
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            defaultValue="kenilshah765@gmail.com"
                            disabled
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            name="phone"
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button
                        type="submit"
                        className="btn-blue bg-red btn-lg btn-big css-1ujsas3"
                        variant="contained"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Box>
          )}

          {/* -------------------- Change Password Tab -------------------- */}
          {tabIndex === 1 && (
            <Box role="tabpanel" id="simple-tabpanel-1" className="MuiBox-root css-19kzrtu">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField
                            name="oldPassword"
                            label="Old Password"
                            variant="outlined"
                            fullWidth
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField
                            name="password"
                            label="New Password"
                            variant="outlined"
                            fullWidth
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <TextField
                            name="confirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            className="w-100 css-i44wyl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button
                        type="submit"
                        className="btn-blue bg-red btn-lg btn-big css-1ujsas3"
                        variant="contained"
                      >
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
