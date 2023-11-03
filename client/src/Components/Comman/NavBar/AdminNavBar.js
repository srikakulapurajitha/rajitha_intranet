
import { styled } from '@mui/material/styles';
//import AppBar from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
import { AddAlert, Announcement, BadgeRounded,  Campaign,  Description, EventAvailable, ExpandLess, ExpandMore,  LocalLibrary, ManageHistory, NoteAdd, PersonAdd, SupervisedUserCircle, UploadFile } from '@mui/icons-material';



import { Fade } from '@mui/material';

import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import StoreIcon from '@mui/icons-material/Store';
import { useContext, useState } from 'react';
import { Avatar } from '@mui/material';
import UserContext from '../../context/UserContext';
//import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
//import CompanyManagementPages from '../CompanyPagesManagement/AddCompanyManagementPages';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,

}));

// drawer width
const drawerWidth = 280;



export default function AdminNavBar(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

 
  const navigate = useNavigate()

  const { window } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    //
    console.log(drawerOpen)
    setDrawerOpen(!drawerOpen);
  };

  const [openCompanyManagementMenu, setOpenCompanyManagementMenu] = useState(false);

  const [openCompanyPageManagementMenu, setOpenCompanyPageManagementMenu] = useState(false)
  const [openUserManagementMenu, setOpenUserManagementMenu] = useState(false);
  const [openAnnouncementMenu,setOpenAnnouncementMenu]=useState(false)
  const [openLeaveManagementMenu,setOpenLeaveManagementMenu]=useState(false)


  const handleSubMenuOpen = (item) => {
    //
    console.log(openCompanyManagementMenu, drawerOpen)
    setDrawerOpen(true)
    switch(item){
      case 'company management':
        setOpenCompanyManagementMenu(true)
        break
      case 'company pages management':
        setOpenCompanyPageManagementMenu(true)
        break
      case 'user management':
        setOpenUserManagementMenu(true)
        break
      case 'announcement':
        setOpenAnnouncementMenu(true)
        break
      case 'leave management':
        setOpenLeaveManagementMenu(true)
        break
      default:
        setDrawerOpen(false)
       
      }
    }
    
    
  

  // const handleSubMenuClose = (item) => {
  //   setDrawerOpen(false)
  //   switch(item){
  //     case 'company management':
  //       setOpenCompanyManagementMenu(false)
  //       break
  //     case 'company pages management':
  //       setOpenCompanyPageManagementMenu(false)
  //       break
  //     default:
  //       setDrawerOpen(false)
       
  //     }
    
  // }


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

  const handleLogout = async() =>{
    try{
      const res = await axios.get('/api/logout')
      toast.success(res.data)
      navigate('/login',{replace:true})
    }
    catch(err){
      console.log(err)
      toast.error('error occured!')

    }
    
  }



  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
      <MenuItem>
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
      </MenuItem>
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
  const {userDetails} = useContext(UserContext)


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
              <img src='bcglogo.png' alt='logo' style={{ marginTop: '5px', marginLeft: '10px', width: '50%' }} />
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
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="black"
            >
              {userDetails.profile_pic===''?<AccountCircle />:<Avatar  sx={{ width: 24, height: 24 }} src={userDetails.profile_pic} />}
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
        <List sx={{ mt: 8 }}>
          {['Dashboard', 'Attendance'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation(index)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr:3,
                    justifyContent: 'center',
                  }}
                >
                  {iconList[index]}
                </ListItemIcon>

              </ListItemButton>
            </ListItem>
          ))}
          
          <Divider />
          {/*------------------------company management---------------------- */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>handleSubMenuOpen('company management')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}

              >
                <BusinessIcon />
              </ListItemIcon>
              {openCompanyManagementMenu ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>

          </ListItem>
          <Divider />
          {/*------------------------company pages management---------------------- */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>handleSubMenuOpen('company pages management')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}

              >
                <LocalLibrary />
              </ListItemIcon>
              {openCompanyPageManagementMenu ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>

          </ListItem>
          <Divider />
          {/*------------------------user management---------------------- */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>handleSubMenuOpen('user management')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}

              >
                <SupervisedUserCircle />
              </ListItemIcon>
              {openUserManagementMenu ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>

          </ListItem>
          <Divider />
          {/*--------------------announcement-------------------------- */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>handleSubMenuOpen('announcement')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}

              >
                <Campaign />
              </ListItemIcon>
              {openUserManagementMenu ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>

          </ListItem>
          <Divider />

          {/*------------------------leave management---------------------- */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>handleSubMenuOpen('leave management')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}

              >
                <ManageHistory />
              </ListItemIcon>
              {openLeaveManagementMenu ? <ExpandLess /> : <ExpandMore />}

            </ListItemButton>

          </ListItem>
          <Divider />

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
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation(index)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
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
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider > Admin Features </Divider>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setOpenCompanyManagementMenu(!openCompanyManagementMenu)} >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'initial',
                  alignItems: 'center'
                }}

              >
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary={'Company Managment'} />
              {openCompanyManagementMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            {openCompanyManagementMenu ? <>
            <Fade in={openCompanyManagementMenu} >
              <List>
                
                <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>navigate('/addcompany')}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml:3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <AddBusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Add Company '} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: 'block'}} onClick={()=>navigate('/viewcompany')}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <StoreIcon />
                    </ListItemIcon>
                    <ListItemText primary={'View Company '}  />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
            </Fade>
            </>:null}

          </ListItem>

          {/*-----------comapany pages management-------------------*/}

           <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setOpenCompanyPageManagementMenu(!openCompanyPageManagementMenu)} >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'initial',
                  alignItems: 'center'
                }}

              >
                <LocalLibrary />
              </ListItemIcon>
              <ListItemText primary={'Company Page Managment'} />
              {openCompanyPageManagementMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            {openCompanyPageManagementMenu ? <>
            <Fade in={openCompanyPageManagementMenu} >
              
              <List>
                
                <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/addcompanypages")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml:3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <NoteAdd />
                    </ListItemIcon>
                    <ListItemText primary={'Add Company Page '} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: 'block'}} onClick={()=>navigate("/viewcompanypages")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <Description />
                    </ListItemIcon>
                    <ListItemText primary={'View Company Page '}  />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
             
            </Fade>
            </>:null}

          </ListItem> 
          {/*---------------user manegement-----------------------*/}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setOpenUserManagementMenu(!openUserManagementMenu)} >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'initial',
                  alignItems: 'center'
                }}

              >
                <SupervisedUserCircle />
              </ListItemIcon>
              <ListItemText primary={'User Managment'} />
              {openUserManagementMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            {openUserManagementMenu ? <>
            <Fade in={openUserManagementMenu} >
              
              <List>
                
                <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/adduser")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml:3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <PersonAdd />
                    </ListItemIcon>
                    <ListItemText primary={'Add User '} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: 'block'}} onClick={()=>navigate("/viewusers")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <BadgeRounded/>
                    </ListItemIcon>
                    <ListItemText primary={'View Users '}  />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
             
            </Fade>
            </>:null}

          </ListItem> 
          {/*---------------Announcement-----------------------*/}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setOpenAnnouncementMenu(!openAnnouncementMenu)} >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'initial',
                  alignItems: 'center'
                }}

              >
                <Campaign />
              </ListItemIcon>
              <ListItemText primary={'Announcements'} />
              {openAnnouncementMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            {openAnnouncementMenu ? <>
            <Fade in={openAnnouncementMenu} >
              
              <List>
                
                <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/addannouncement")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml:3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <AddAlert />
                    </ListItemIcon>
                    <ListItemText primary={'Add Announcement '} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: 'block'}} onClick={()=>navigate("/viewannouncements")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <Announcement/>
                    </ListItemIcon>
                    <ListItemText primary={'View Announcement '}  />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
             
            </Fade>
            </>:null}

          </ListItem> 

          {/*---------------leave manegement-----------------------*/}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => setOpenLeaveManagementMenu(!openLeaveManagementMenu)} >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'initial',
                  alignItems: 'center'
                }}

              >
                <ManageHistory />
              </ListItemIcon>
              <ListItemText primary={'Leave Managment'} />
              {openLeaveManagementMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            {openLeaveManagementMenu ? <>
            <Fade in={openLeaveManagementMenu} >
              
              <List>
                
                <ListItem disablePadding sx={{ display: 'block' }} onClick={()=>navigate("/uploadattendance")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml:3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <UploadFile />
                    </ListItemIcon>
                    <ListItemText primary={'Upload Attendance '} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: 'block'}} onClick={()=>navigate("/viewattendance")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        ml: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}

                    >
                      <EventAvailable/>
                    </ListItemIcon>
                    <ListItemText primary={'View Attendance '}  />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
             
            </Fade>
            </>:null}

          </ListItem> 

          
        </List>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
      <ToastContainer />
    </>
  );
}
