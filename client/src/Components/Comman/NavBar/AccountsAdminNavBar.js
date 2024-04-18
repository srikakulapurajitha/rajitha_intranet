
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
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
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
import { useContext, useState } from 'react';
import { Avatar, Collapse, Stack } from '@mui/material';
//import CompanyManagementPages from '../CompanyPagesManagement/AddCompanyManagementPages';

import UserContext from '../../context/UserContext';
//import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AccountBalanceWallet, AccountBox, AdsClick, ExpandLess, ExpandMore, ForwardToInbox, LockOpen, Logout, RequestQuote, WorkHistory, WorkOff } from '@mui/icons-material';
import { CgListTree } from 'react-icons/cg';
import { UserAccessContext } from '../../context/UserAccessContext';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,

}));

// drawer width
const drawerWidth = 280;



export default function AccountsAdminNavBar(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);


  const navigate = useNavigate()

  const { window, userIntroTour } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userDetails } = useContext(UserContext)
  const [expandedPage, setExpandedPage] = useState('')
  const { pagesToBeNotAccessed } = useContext(UserAccessContext)


  const handleExpand = (page) => {
    //console.log(page,expandedPage)
    if (!drawerOpen) {
      setDrawerOpen(true)
    }
    setExpandedPage(expandedPage === page ? '' : page)

  }




  const handleDrawerToggle = () => {
    //
    //console.log(drawerOpen)
    setExpandedPage('')
    setDrawerOpen(!drawerOpen);
  };



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
  // const day= dateFormat(currentTime)




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
            right: 14,
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
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
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
              <img src={process.env.REACT_APP_BACKEND_SERVER+'/logo/BCGLOGO.png'} alt='logo' style={{ marginTop: '5px', marginLeft: '10px', width: '90%', height: '50px' }} />

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
        <List sx={{ mt: 8 }} className='navigation-menu'>
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

          {/* ---------------------------------------------salary management--------------------------------------------------------- */}
          

          {
            pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
            <>
            <Divider sx={{ fontSize: 12, fontWeight: 'bold' }}>Accounts</Divider>
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
              </>
              :
              null
          }


        </List>

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
         
          {/* ---------------------------------------------salary management--------------------------------------------------------- */}

          {
              pagesToBeNotAccessed !== null && !pagesToBeNotAccessed.includes('SalaryManagement') ?
              <>
              <Divider  > Accounts Features </Divider>
              
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
                </>

                : null
            }



        </List>

      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
