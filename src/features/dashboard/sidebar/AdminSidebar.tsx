import { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MenuOutlined,
    BellOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, theme, Grid, Drawer, Avatar, Badge, Tooltip, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarMenu from '../components/SIdebarMenu';
import defaultLogo from "../../../assets/logo.png";
import { Fullscreen, Minimize } from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('instituteName');
        localStorage.removeItem('instituteLogo');
        navigate('/login');
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const screens = useBreakpoint();
    const isMobile = !screens.md;


    const instituteName = localStorage.getItem('instituteName') || 'Institute Name';
    const instituteLogoUrl = localStorage.getItem('instituteLogo') || defaultLogo;

    return (
        <Layout className='h-screen overflow-hidden'>

            {!isMobile && (

                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={260}
                    style={{
                        background: '#ffffff',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                    }}
                >
                    <div className="demo-logo-vertical " />
                    {
                        collapsed ? (
                            <img src={instituteLogoUrl} alt="" className='mt-4 mb-5 h-10 w-10 mx-auto flex items-center justify-center' />
                        ) : (
                            <div className='flex items-center justify-center gap-2 mt-4 mb-5'>
                                <img src={instituteLogoUrl} alt="" className='h-10 w-10' />
                                <h1 className='text-2xl font-bold text-black text-center'>Ilam Pannel</h1>
                            </div>
                        )
                    }
                    <SidebarMenu collapsed={collapsed} />
                </Sider>
            )}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    {!isMobile && (
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}

                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,

                            }}
                        />
                    )}
                    {isMobile && (
                        <>
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerOpen(true)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <Drawer
                                placement="left"
                                open={drawerOpen}
                                onClose={() => setDrawerOpen(false)}
                                bodyStyle={{ padding: 0 }}
                            >
                                <SidebarMenu />
                            </Drawer>
                        </>
                    )}


                    <div className="flex items-center gap-4 pr-6 ml-auto float-right h-full">
                        <Tooltip title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                            <Button
                                type="text"
                                icon={isFullScreen ? <Minimize /> : <Fullscreen />}
                                onClick={toggleFullScreen}
                                className="flex items-center justify-center"
                                style={{ fontSize: '18px' }}
                            />
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <Badge count={5} size="small">
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    className="flex items-center justify-center"
                                    style={{ fontSize: '18px' }}
                                />
                            </Badge>
                        </Tooltip>

                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'logout',
                                        label: 'Logout',
                                        icon: <LogoutOutlined />,
                                        onClick: handleLogout,
                                    },
                                ],
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <div className='flex items-center gap-2 cursor-pointer'>
                                <Avatar size={40} />
                                <h1>{instituteName}</h1>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    className="no-scrollbar"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        height: '100vh',
                        overflowY: 'auto',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        scrollBehavior: 'smooth',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminSidebar;