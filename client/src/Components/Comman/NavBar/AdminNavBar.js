
import { styled } from '@mui/material/styles';
//import AppBar from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
//import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
//import MailIcon from '@mui/icons-material/Mail';
//import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Drawer from '@mui/material/Drawer';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
//import CssBaseline from '@mui/material/CssBaseline';
import BusinessIcon from '@mui/icons-material/Business';
import { AccountBalanceWallet, AccountBox, AddAPhoto, AddAlert, AddPhotoAlternate, AdsClick, Announcement, BadgeRounded, Balance, BrowseGallery, Campaign, CardTravel, CreditScore, Description, EventAvailable, ExpandLess, ExpandMore, ForwardToInbox, GroupAdd, Insights, Key, LocalLibrary, LockOpen, LockReset, Logout, ManageHistory, ModelTraining, MoreTime, NoteAdd, Paid, Payments, PersonAdd, RequestQuote, Send, Settings, SupervisedUserCircle, TrendingUp, UploadFile, WorkHistory, WorkOff, Wysiwyg } from '@mui/icons-material';


import { CgListTree } from 'react-icons/cg'
import { Collapse, Stack, colors } from '@mui/material';

import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import StoreIcon from '@mui/icons-material/Store';
import { useContext, useState } from 'react';
import { Avatar } from '@mui/material';
import UserContext from '../../context/UserContext';
//import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { UserAccessContext } from '../../context/UserAccessContext';
//import CompanyManagementPages from '../CompanyPagesManagement/AddCompanyManagementPages';


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,

}));

// drawer width
const drawerWidth = 290;



export default function AdminNavBar(props) {



  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate()

  const { window, userIntroTour } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    //console.log(drawerOpen)
    setExpandedPage('')
    setDrawerOpen(!drawerOpen);

  };

  const [expandedPage, setExpandedPage] = useState('')

  const { pagesToBeNotAccessed } = useContext(UserAccessContext)


  const handleExpand = (page) => {
    //console.log(page,expandedPage)
    if (!drawerOpen) {
      setDrawerOpen(true)
    }
    setExpandedPage(expandedPage === page ? '' : page)

  }

  const handleNavigation = (index) => {
    const navList = ['/', '/attendance']
    navigate(navList[index])
    setDrawerOpen(false)
  }
  const iconList = [<DashboardCustomizeIcon />, <EventAvailableIcon />]


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/logout')
      toast.success(res.data)
      navigate('/login', { replace: true })
    }
    catch (err) {
      //console.log(err)
      toast.error(err.response.data)

    }

  }
  // const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);


  // function dateFormat(date) {
  //   const options = {

  //     day: 'numeric',
  //     year: 'numeric',
  //     month: 'long',
  //     weekday: 'long',

  //   };
  //   const formate = date.toLocaleDateString('en-CA', options).replace(/ /g, ',').split(',').filter(x => x !== "")
  //   //console.log(formate,date.toLocaleDateString('en-CA', options).replace(/ /g, ',').split(',').filter(x => x !== ""))
  //   const day = formate[2]
  //   let formated_day;
  //   switch (day) {
  //     case '1':
  //       formated_day = '1st'
  //       break
  //     case '2':
  //       formated_day = '2nd'
  //       break
  //     case '3':
  //       formated_day = '3rd'
  //       break
  //     default:
  //       formated_day = `${day}th`
  //       break

  //   }
  //   formate[2] = formated_day

  //   //console.log(formated_day)
  //   return `${formate[0]} ${formate[2]} ${formate[1]}, ${formate[3]}`

  // }

  // const time = currentTime.toLocaleTimeString(undefined, { hour12: true });
  // const day = dateFormat(currentTime)

  //console.log("running")



  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 20,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >


      <MenuItem onClick={() => navigate('/myprofile')}>
        <ListItemIcon>
          <AccountBox fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={() => navigate('/changepassword')}>
        <ListItemIcon>
          <LockOpen fontSize="small" />
        </ListItemIcon>
        Change Password
      </MenuItem>
      {userIntroTour !== undefined ?
        <MenuItem onClick={() => userIntroTour()}>
          <ListItemIcon>
            <AdsClick fontSize="small" />
          </ListItemIcon>
          Intro Tour
        </MenuItem> : null
      }
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );


  const container = window !== undefined ? () => window().document.body : undefined;
  const { userDetails } = useContext(UserContext)




  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'block', sm: 'block' } }}
          >
            <Link href="/" underline="none">
              <img src={process.env.REACT_APP_BACKEND_SERVER + '/logo/BCGLOGO.png'} alt='logo' style={{ marginTop: '5px', marginLeft: '10px', width: '90%', height: '50px' }} />

            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* <IconButton size="large" aria-label="show 4 new mails" color="black">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="black"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            {/* <Stack spacing={-0.5}>
              <Typography variant="subtitle1" color={'ButtonText'} style={{ textAlign: "center", justifyContent: "center", alignItems: 'center', color: 'gray', fontSize: '20px' }}>
                {time}
              </Typography>
              <Typography variant='subtitle2' color={'ButtonText'} sx={{ color: 'gray' }}>{day} </Typography>

            </Stack> */}
            <Stack spacing={-0.5} m={1}>
              <Typography variant="subtitle1" color={'ButtonText'} style={{ textAlign: "center", justifyContent: "center", alignItems: 'center', color: 'black', fontSize: '22px', paddingTop: '4px' }}>

                Hi {`${userDetails.first_name}!  `}
              </Typography>
              {/* <Typography variant='subtitle2' color={'ButtonText'} sx={{ color: 'gray',alignItems:'center' }}>
                  {userDetails.designation}
                </Typography> */}
            </Stack>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="black"
              className='account-menu'
            >
              {userDetails.profile_pic === '' ? <AccountCircle /> : <Avatar sx={{ width: 35, height: 35 }} src={userDetails.profile_pic} />}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="black"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent"
        container={container}

        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth - 200,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth - 200,
            boxSizing: 'border-box',
          },
        }}

        anchor="left"

      >
        <Box sx={{ overflow: 'auto', mt: 8 }} >

          <List sx={{}} className='navigation-menu' disablePadding dense>

            {['Dashboard', 'Attendance'].map((text, index) => (


              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes(text) ?
                <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation(index)}>
                  <ListItemButton

                    title={text}
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,

                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        display: 'flex',

                        justifyContent: 'center',
                      }}
                    >
                      {iconList[index]}
                    </ListItemIcon>

                  </ListItemButton>
                </ListItem>
                : null



            ))}
            {/*----------------------------------Leaves---------------------------*/}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('ApplyLeave') || !pagesToBeNotAccessed.includes('BalanceLeaves')) ?

                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Leaves')}>
                  <ListItemButton
                    title={'Leaves'}
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,

                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: 1.2,

                        justifyContent: 'center',

                      }}
                    >
                      <WorkOff />
                      {expandedPage === 'Leaves' ? <ExpandLess /> : <ExpandMore />}


                    </ListItemIcon>

                  </ListItemButton>
                </ListItem>

                : null

            }



            {/*----------------------------------History Log Of All applications---------------------------*/}
            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('HistoryLog') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/historylog')}>
                  <ListItemButton
                    title={'History Log for all Application'}
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',

                      }}
                    >
                      <WorkHistory />

                    </ListItemIcon>


                  </ListItemButton>
                </ListItem>
                :
                null
            }

            {/* ------------------------------------------reporting structure-------------------------------- */}
            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ReportingStructure') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/reportingstructure')}>
                  <ListItemButton
                    title={'View Reporting Structure'}
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,

                        mr: 2,
                        justifyContent: 'center',
                        alignItems: 'center'

                      }}
                    >
                      <CgListTree fontSize={20} />

                    </ListItemIcon>


                  </ListItemButton>
                </ListItem>
                :
                null
            }


            <Divider sx={{ fontSize: 12, fontWeight: 'bold' }}>Admin</Divider>

            {/*------------------------company Management---------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddCompany') || !pagesToBeNotAccessed.includes('ViewCompany')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Company Management')}>
                  <ListItemButton
                    title='Company Management'
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: 1.2,
                        justifyContent: 'center',

                      }}

                    >
                      <BusinessIcon />
                      {expandedPage === 'Company Management' ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>


                  </ListItemButton>
                  <Divider />

                </ListItem>


                : null
            }

            {/*------------------------company pages Management---------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddCompanyPages') || !pagesToBeNotAccessed.includes('ViewCompanyPages')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Company Page Management')}>
                  <ListItemButton
                    title='Company Pages Management'
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: 1.2,
                        justifyContent: 'center',

                      }}

                    >
                      <LocalLibrary />
                      {expandedPage === 'Company Page Management' ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>


                  </ListItemButton>
                  <Divider />

                </ListItem>


                : null
            }

            {/*------------------------user Management---------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddUser') || !pagesToBeNotAccessed.includes('ViewUsers')) ?
                <>
                  <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('User Management')}>
                    <ListItemButton
                      title='User Management'
                      sx={{
                        minHeight: 45,
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: 1.2,
                          justifyContent: 'center',

                        }}

                      >
                        <SupervisedUserCircle />
                        {expandedPage === 'User Management' ? <ExpandLess /> : <ExpandMore />}

                      </ListItemIcon>

                    </ListItemButton>

                  </ListItem>
                  <Divider />
                </>

                : null
            }

            {/*--------------------announcement-------------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddAnnouncement') || !pagesToBeNotAccessed.includes('ViewAnnouncements')) ?

                <>
                  <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Announcements')}>
                    <ListItemButton
                      title='Announcement'
                      sx={{
                        minHeight: 45,
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: 1.2,
                          justifyContent: 'center',

                        }}

                      >
                        <Campaign />
                        {expandedPage === 'Announcements' ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>


                    </ListItemButton>

                  </ListItem>
                  <Divider />
                </>

                : null
            }


            {/*--------------------Office Gallery-------------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('UploadGallery') || !pagesToBeNotAccessed.includes('ViewGallery')) ?
                <>
                  <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Manage Office Gallery')}>
                    <ListItemButton
                      title='Manage Office Gallery'
                      sx={{
                        minHeight: 45,
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: 1.2,

                          justifyContent: 'center',

                        }}

                      >
                        <AddPhotoAlternate />
                        {expandedPage === 'Manage Office Gallery' ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>


                    </ListItemButton>

                  </ListItem>
                  <Divider />
                </>

                : null
            }


            {/*------------------------leave Management---------------------- */}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('UploadAttendance') || !pagesToBeNotAccessed.includes('ViewAttendance') || !pagesToBeNotAccessed.includes('CreateReportingStructure') || !pagesToBeNotAccessed.includes('ViewReportingStructure') || !pagesToBeNotAccessed.includes('HistorylogAdmin') || !pagesToBeNotAccessed.includes('ManageBalanceLeaves')) ?
                <>
                  <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Leave Management')}>
                    <ListItemButton
                      title='Leave Management'
                      sx={{
                        minHeight: 45,
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: 1.2,
                          justifyContent: 'center',

                        }}

                      >
                        <ManageHistory />
                        {expandedPage === 'Leave Management' ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>


                    </ListItemButton>

                  </ListItem>

                </>

                : null
            }

            {/* ---------------------------------------------salary management--------------------------------------------------------- */}
            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
                <Divider sx={{ fontSize: 12, fontWeight: 'bold' }}>Accounts</Divider>
                : null


            }

            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/salary-management')}>
                  <ListItemButton
                    title={'Salary Management'}
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',

                      }}
                    >
                      <RequestQuote />

                    </ListItemIcon>


                  </ListItemButton>
                </ListItem>
                :
                null
            }


          </List>

        </Box>


      </Drawer>

      <Drawer
        container={container}
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{

          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}

      >
        <Box sx={{ overflow: 'auto', height: 'auto' }}>
          <List sx={{ mt: 8 }}>
            {['Dashboard', 'Attendance'].map((text, index) => (

              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes(text) ?
                <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation(index)}>
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                      }}
                    >
                      {iconList[index]}
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>{text}</Typography>} />
                  </ListItemButton>
                </ListItem>
                : null
            ))}
            {/*--------------------------------------Leaves----------------------------------*/}

            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('ApplyLeave') || !pagesToBeNotAccessed.includes('BalanceLeaves'))
                ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Leaves')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <WorkOff />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Leaves</Typography>} />
                    {expandedPage === 'Leaves' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={expandedPage === 'Leaves'} timeout={'auto'} unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ApplyLeave') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/applyleave')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <ForwardToInbox />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Apply Leave</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null
                      }
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('BalanceLeaves') ?
                          <ListItem disablePadding sx={{ display: 'flex' }} onClick={() => navigate('/balanceleaves')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <AccountBalanceWallet />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Balance Leaves</Typography>} />
                            </ListItemButton>
                          </ListItem>
                          : null

                      }
                    </List>
                  </Collapse>

                </ListItem>
                :
                null
            }

            {/*----------------------------------History Log Of All application---------------------------*/}
            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('HistoryLog') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/historylog')}  >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                      }}
                    >
                      <WorkHistory />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>History Log for all Application</Typography>} />
                  </ListItemButton>
                </ListItem>

                : null
            }

            {/* --------------------reporting structure-------------------------------------------- */}

            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ReportingStructure') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/reportingstructure')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                      }}
                    >
                      < CgListTree fontSize={20} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Reporting Structure</Typography>} />
                  </ListItemButton>
                </ListItem>

                : null
            }

            <Divider > Admin Features </Divider>
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddCompany') || !pagesToBeNotAccessed.includes('ViewCompany'))

                ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Company Management')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Company Management</Typography>} />
                    {expandedPage === 'Company Management' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Divider />

                  <Collapse in={expandedPage === 'Company Management'} timeout="auto" unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('AddCompany')
                          ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/addcompany')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <AddBusinessIcon />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Add Company</Typography>} />
                            </ListItemButton>
                          </ListItem>
                          : null
                      }
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewCompany')
                          ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/viewcompany')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <StoreIcon />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Company</Typography>} />
                            </ListItemButton>
                          </ListItem>
                          : null

                      }



                      <Divider />
                    </List>

                  </Collapse>

                </ListItem>
                : <>
                </>
            }


            {/*-----------comapany pages Management-------------------*/}

            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddCompanyPages') || !pagesToBeNotAccessed.includes('ViewCompanyPages')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Company Page Management')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <LocalLibrary />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Company Page Management</Typography>} />
                    {expandedPage === 'Company Page Management' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Divider />

                  <Collapse in={expandedPage === 'Company Page Management'} timeout="auto" unmountOnExit>
                    <List>

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('AddCompanyPages') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/addcompanypages")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <NoteAdd />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Add Company Page</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewCompanyPages') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/viewcompanypages")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <Description />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Company Page </Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }
                      <Divider />
                    </List>

                  </Collapse>

                </ListItem>

                : null
            }

            {/*---------------user manegement-----------------------*/}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddUser') || !pagesToBeNotAccessed.includes('ViewUsers') || !pagesToBeNotAccessed.includes('UserAccessManagement') || !pagesToBeNotAccessed.includes('Experience')) ?

                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('User Management')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <SupervisedUserCircle />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>User Management</Typography>} />
                    {expandedPage === 'User Management' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Divider />

                  <Collapse in={expandedPage === 'User Management'} timeout={'auto'} unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('AddUser') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/adduser")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}
                              >
                                <PersonAdd />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Add User</Typography>} />
                            </ListItemButton>
                          </ListItem>


                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewUsers') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/viewusers")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <BadgeRounded />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Users</Typography>} />
                            </ListItemButton>
                          </ListItem>


                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('UserAccessManagement') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/user-access-management")}>

                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <Key />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>User Access Management</Typography>} />
                            </ListItemButton>
                          </ListItem>


                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('Experience') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/experience")}>

                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <Insights />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Experience</Typography>} />
                            </ListItemButton>
                          </ListItem>


                          : null

                      }

                      <Divider />
                    </List>

                  </Collapse>

                </ListItem>

                : null
            }






            {/*---------------Announcement-----------------------*/}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('AddAnnouncement') || !pagesToBeNotAccessed.includes('ViewAnnouncements')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Announcements')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <Campaign />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Announcements</Typography>} />
                    {expandedPage === 'Announcements' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Divider />

                  <Collapse in={expandedPage === 'Announcements'} timeout={'auto'} unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('AddAnnouncement') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/addannouncement")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}
                              >
                                <AddAlert />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Add Announcement</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewAnnouncements') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/viewannouncements")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <Announcement />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Announcement</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }
                      <Divider />
                    </List>

                  </Collapse>

                </ListItem>


                : null
            }


            {/*---------------Manage Office Gallery------------------------*/}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('UploadGallery') || !pagesToBeNotAccessed.includes('ViewGallery')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Manage Office Gallery')} >
                  <ListItemButton
                    sx={{ minHeight: 45, justifyContent: 'center', px: 1.5, }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center', }} >
                      <AddPhotoAlternate />
                    </ListItemIcon>
                    <ListItemText primary={'Manage Office Gallery'} />
                    {expandedPage === 'Manage Office Gallery' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Divider />
                  <Collapse in={expandedPage === 'Manage Office Gallery'} timeout={'auto'} unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('UploadGallery') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/upload-gallery")}>
                            <ListItemButton
                              sx={{ minHeight: 45, justifyContent: 'center', px: 1.5, }} >
                              <ListItemIcon sx={{ minWidth: 0, mr: 3, ml: 3, justifyContent: 'center', }}>
                                <AddAPhoto />
                              </ListItemIcon>
                              <ListItemText primary={'Upload Gallery '} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewGallery') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/view-gallery")}>
                            <ListItemButton sx={{ minHeight: 45, justifyContent: 'center', px: 1.5, }} >
                              <ListItemIcon sx={{ minWidth: 0, mr: 3, ml: 3, justifyContent: 'center', }} >
                                <BrowseGallery />
                              </ListItemIcon>
                              <ListItemText primary={'View Gallery '} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }
                      <Divider />
                    </List>

                  </Collapse>


                </ListItem>

                : null
            }

            {/*---------------leave manegement-----------------------*/}
            {
              pagesToBeNotAccessed !== null && (!pagesToBeNotAccessed.includes('UploadAttendance') || !pagesToBeNotAccessed.includes('ViewAttendance') || !pagesToBeNotAccessed.includes('CreateReportingStructure') || !pagesToBeNotAccessed.includes('ViewReportingStructure') || !pagesToBeNotAccessed.includes('HistorylogAdmin') || !pagesToBeNotAccessed.includes('ManageBalanceLeaves')) ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleExpand('Leave Management')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',

                      }}

                    >
                      <ManageHistory />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Leave Management</Typography>} />
                    {expandedPage === 'Leave Management' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>


                  <Collapse in={expandedPage === 'Leave Management'} timeout={'auto'} unmountOnExit>
                    <List>
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('UploadAttendance') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/uploadattendance")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}
                              >
                                <UploadFile />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Upload Attendance</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewAttendance') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/viewattendance")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <EventAvailable />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Attendance</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('GenerateAttendance') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/generate-attendance")}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <ModelTraining />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Generate Attendance</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('CreateReportingStructure') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/createreportingstructure')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >

                                <GroupAdd />
                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Create Reporting Structure</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ViewReportingStructure') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/viewreportingstructure')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                < CgListTree fontSize={20} />

                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>View Reporting Structure</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('HistorylogAdmin') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/historylog-admin')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <WorkHistory />

                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>History Log for all applications</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }
                      {
                        pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('ManageBalanceLeaves') ?
                          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/manage-balance-leaves')}>
                            <ListItemButton
                              sx={{
                                minHeight: 45,
                                justifyContent: 'center',
                                px: 1.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  ml: 3,
                                  justifyContent: 'center',

                                }}

                              >
                                <Balance />

                              </ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Manage Balance Leaves</Typography>} />
                            </ListItemButton>
                          </ListItem>

                          : null

                      }

                    </List>

                  </Collapse>

                </ListItem>


                : null
            }


            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
                <Divider > Accounts Features </Divider>
                : null


            }
            {/* ---------------------------------------------salary management--------------------------------------------------------- */}

            {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/salary-management')} >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: 'center',
                      px: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                      }}
                    >
                      <RequestQuote />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: 15 }}>Salary Management</Typography>} />
                  </ListItemButton>
                </ListItem>

                : null
            }


          </List>
        </Box>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
      <ToastContainer />
    </>
  );
}
