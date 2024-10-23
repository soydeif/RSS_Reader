import React from 'react';
import "./reset.css";
import "./global.css";
import { MenuFoldOutlined, MenuUnfoldOutlined, BookOutlined, ProfileOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Button, Menu } from 'antd';

import { useAppLogic } from './hooks/useAppLogic';
import ContentDisplay from './components/ContentDisplay';

const { Header, Content, Footer, Sider } = Layout;



const App: React.FC = () => {

  const {
    collapsed,
    setCollapsed,
    savedPosts,
    selectedCategory,
    setViewSaved,
    searchTerm,
    setSearchTerm,
    handleSavePost,
    handleCategorySelection,
    categories,
    categoryLoading,
    dashboardLoading,
    categoryError,
    dashboardError,
    filteredGroupedPosts,
    filteredPosts,
    currentPage,
    setCurrentPage
  } = useAppLogic();




  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => { handleCategorySelection('dashboard'); setSearchTerm(''); },
    },
    {
      key: "Categories",
      icon: <ProfileOutlined />,
      label: 'Categories',
      children: categories.map(category => ({
        key: category.key,
        label: (
          <span onClick={() => handleCategorySelection(category.key)}>
            {category.label}
          </span>
        ),
      })),
    },
    {
      key: "saved",
      icon: <BookOutlined />,
      label: 'Saved',
      onClick: () => {
        setViewSaved(true);
        setSearchTerm('');
      },
      disabled: savedPosts.length === 0,
    },
  ];

  const handleViewChange = (viewType: string) => {
    console.log('viewType', viewType)
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={setCollapsed}
        style={{ background: '#dfdaf9ba' }}
      >
        <Header style={{ padding: 0, background: '#f5f5f5' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 80, height: 64 }}
          />
        </Header>

        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[selectedCategory || '']}
          style={{ background: '#dfdaf9ba' }}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <div style={{ minHeight: '45px' }} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ borderRadius: 8, minHeight: 360 }}>
            <ContentDisplay
              {...{
                categoryLoading, dashboardLoading, categoryError, dashboardError, filteredGroupedPosts, collapsed,
                setSearchTerm, handleViewChange, searchTerm, filteredPosts, savedPosts, handleSavePost, currentPage, setCurrentPage
              }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#502dc8', fontWeight: 'bold' }}>
          RSS Reader ©{new Date().getFullYear()} Project by David Diaz ☕
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;


