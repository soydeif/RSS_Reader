import React from "react";
import "./reset.css";
import "./global.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  ProfileOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Button, Menu } from "antd";

import { useAppLogic } from "./hooks/useAppLogic";
import ContentDisplay from "./components/ContentDisplay";
import Logo from "./components/icons/Logo";
import NavControls from "./components/NavControls";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const {
    collapsed,
    setCollapsed,
    savedPosts,
    selectedCategory,
    searchTerm,
    setSearchTerm,
    handleSavePost,
    categories,
    categoryLoading,
    dashboardLoading,
    categoryError,
    dashboardError,
    filteredGroupedPosts,
    filteredPosts,
    currentPage,
    setCurrentPage,
    typeofPresentation,
    setTypeofPresentation,
    handleMenuSelect,
    currentSection
  } = useAppLogic();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "Categories",
      icon: <ProfileOutlined />,
      label: "Categories",
      children: categories.map((category) => ({
        key: category.key,
        label: (
          <span>
            {category.label}
          </span>
        ),
      })),
    },
    {
      key: "saved",
      icon: <BookOutlined />,
      label: "Saved",
      disabled: savedPosts.length === 0,
    },
  ];

  return (
    <Layout className="app-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={setCollapsed}
        breakpoint="md"
        collapsedWidth={1}
        className="sider"
      >
        <Header className={collapsed ? 'hamburguer-menu-open' : 'hamburguer-menu'}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
        </Header>

        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[selectedCategory || ""]}
          className="menu"
          items={menuItems}
          onSelect={({ key }) => handleMenuSelect(key)}
        />
      </Sider>

      <Layout>
        <div className="spacer" />
        <header className="logo-header" onClick={() => handleMenuSelect('dashboard')}>
          <Logo alt="Reaser Logo" />
        </header>
        <Content className="content">
          {currentSection !== 'dashboard' && <NavControls
            collapsed={collapsed}
            onSearch={setSearchTerm}
            typeofPresentation={typeofPresentation}
            setTypeofPresentation={setTypeofPresentation} />}

          <div className="content-display-container">
            <div className="current-section">
              You're visiting <span>{currentSection}</span> section.
            </div>
            <ContentDisplay
              {...{
                categoryLoading,
                dashboardLoading,
                categoryError,
                dashboardError,
                filteredGroupedPosts,
                collapsed,
                searchTerm,
                filteredPosts,
                savedPosts,
                handleSavePost,
                currentPage,
                setCurrentPage,
                typeofPresentation,
                setTypeofPresentation
              }}
            />
          </div>
        </Content>
        <Footer className="footer">
          Project {new Date().getFullYear()} <br />
          <span className="footer-highlight">by David Diaz ☕</span>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
