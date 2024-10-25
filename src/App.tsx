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
import Logo from "./assets/icons/Logo";

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
    setCurrentPage,
    typeofPresentation,
    setTypeofPresentation
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={setCollapsed}
        breakpoint="md"
        collapsedWidth={1}
        style={{ background: "#edeeff" }}
      >
        <Header style={{ padding: 0, background: "#f5f5f5" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 80, height: 64 }}
          />
        </Header>

        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[selectedCategory || ""]}
          style={{ background: "#edeeff" }}
          items={menuItems}
          onSelect={({ key }) => {
            if (key === "dashboard") {
              setViewSaved(false);
              handleCategorySelection("dashboard");
              setSearchTerm("");
            } else if (key === "saved") {
              setViewSaved(true);
              setSearchTerm("");
              setCurrentPage(1)
            } else {
              setViewSaved(false);
              handleCategorySelection(key);
              setSearchTerm("");
            }
          }}
        />
      </Sider>

      <Layout>
        <div style={{ minHeight: "45px" }} />
        <header style={{ margin: '0 auto' }}>
          <Logo />
        </header>
        <Content style={{ margin: "0 16px" }}>
          <div style={{ borderRadius: 8, minHeight: 360 }}>
            <ContentDisplay
              {...{
                categoryLoading,
                dashboardLoading,
                categoryError,
                dashboardError,
                filteredGroupedPosts,
                collapsed,
                setSearchTerm,
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
        <Footer
          style={{ textAlign: "center", color: "#3673fe", fontWeight: "bold", marginTop: '1rem', }}
        >
          RSS Reader ©{new Date().getFullYear()} <br />Project by David Diaz ☕
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
