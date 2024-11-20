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
import DashboardDisplay from "./components/DashboardDisplay";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const {
    collapsed,
    setCollapsed,
    savedPosts,
    selectedCategory,
    setSearchTerm,
    typeofPresentation,
    setTypeofPresentation,
    handleMenuSelect,
    currentSection,
    handleSavePost,
    currentPage,
    setCurrentPage,
    feeds,
    filteredPosts,
    changeFeed,
    error,
    loading,
  } = useAppLogic();

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => handleMenuSelect("dashboard"),
    },
    {
      key: "Feeds",
      icon: <ProfileOutlined />,
      label: "Feeds",
      children: feeds.map((feed) => ({
        key: feed.id.toString(),
        label: <span>{feed.feedtitle}</span>,
        onClick: () => handleMenuSelect(feed.feedtitle),
      })),
    },
    {
      key: "saved",
      icon: <BookOutlined />,
      label: "Saved",
      disabled: savedPosts.length === 0,
      onClick: () => handleMenuSelect("saved"),
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
        <Header
          className={collapsed ? "hamburguer-menu-open" : "hamburguer-menu"}
        >
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
          onSelect={({ key }) => {
            const selectedFeedItem = feeds.find(
              (feed) => feed.id.toString() === key
            );
            changeFeed(selectedFeedItem ? selectedFeedItem.contentGroup : []);
          }}
        />
      </Sider>

      <Layout>
        <div className="spacer" />
        <header
          className="logo-header"
          onClick={() => handleMenuSelect("dashboard")}
        >
          <Logo alt="Reaser Logo" />
        </header>
        <Content className="content">
          <NavControls
            collapsed={collapsed}
            onSearch={setSearchTerm}
            typeofPresentation={typeofPresentation}
            setTypeofPresentation={setTypeofPresentation}
            small={currentSection.length > 1}
          />

          <div className="content-display-container">
            {!(
              selectedCategory === "dashboard" || selectedCategory === null
            ) && (
                <div className="current-section">
                  You're visiting <span>{currentSection}</span> section.
                </div>
              )}
            {selectedCategory === "dashboard" ?
              <DashboardDisplay /> :
              <ContentDisplay
                {...{
                  savedPosts,
                  handleSavePost,
                  currentPage,
                  setCurrentPage,
                  typeofPresentation,
                  setTypeofPresentation,
                  feed: filteredPosts,
                  error,
                  loading,
                  setCollapsed,
                }}
              />}
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
