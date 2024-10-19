import React, { useState, useEffect } from 'react';
import "./reset.css";
import "./global.css";
import Sidebar from "./components/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined, BookOutlined, HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { Layout, Button, Menu } from 'antd';
import { fetchRssFeedAsText } from './rssService';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { FeedItemPost } from './types/RSSFeed';
import Searchbar from './components/Searchbar';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState<number | null>(null);
  const [selectedFeedData, setSelectedFeedData] = useState<FeedItemPost[] | null>(null);
  const [dashboardData, setDashboardData] = useState<FeedItemPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<FeedItemPost[]>([]);

  const feeds = useSelector((state: RootState) => state.rss.source);

  useEffect(() => {
    const storedPosts = localStorage.getItem("savedPosts");
    if (storedPosts) {
      setSavedPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  const handleFeedClick = async (url: string, index: number) => {
    if (activeFeedIndex === index) {
      setActiveFeedIndex(null);
      setSelectedFeedData(null);
    } else {
      const data = await fetchRssFeedAsText(url);
      setSelectedFeedData(data || []);
      setActiveFeedIndex(index);
    }
  };

  const handleDashboardClick = async () => {
    const news: FeedItemPost[] = [];

    for (const feed of feeds) {
      const data = await fetchRssFeedAsText(feed.url);
      if (data) {
        const latestPosts = data.slice(0, 2);
        news.push(...latestPosts);
      }
    }

    setDashboardData(news);
    setActiveFeedIndex(null);
  };


  const handleSavePost = (post: FeedItemPost) => {
    setSavedPosts((prev) => {
      const isAlreadySaved = prev.some(item => item.id === post.id);

      if (isAlreadySaved) {
        return prev.filter(item => item.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{ background: '#dfdaf9ba' }}
      >
        <Header style={{ padding: 0, background: '#f5f5f5' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 80,
              height: 64,
            }}
          />
        </Header>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeFeedIndex !== null ? activeFeedIndex.toString() : '']}
          style={{ background: '#dfdaf9ba' }}
        >
          <Menu.Item key="dashboard" onClick={handleDashboardClick}>
            <HomeOutlined />
            <span style={{ marginLeft: 8 }}>Dashboard</span>
          </Menu.Item>
          <Menu.SubMenu key="feeds" icon={<ProfileOutlined />} title="Feeds">
            {feeds?.map((feed, index) => (
              <Menu.Item key={index.toString()} onClick={() => handleFeedClick(feed.url, index)}>
                {feed.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
          {/* Agregar menú para elementos guardados */}
          <Menu.SubMenu key="saved" icon={<BookOutlined />} title="Saved">
            {savedPosts.map((post, index) => (
              <Menu.Item key={index.toString()}>
                {post.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        </Menu>

        <Searchbar collapsed={collapsed} />
      </Sider>

      <Layout>
        <div style={{ minHeight: '45px' }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              borderRadius: 8,
              minHeight: 360,
            }}
          >
            {activeFeedIndex !== null && selectedFeedData ? (
              <Sidebar selectedFeedData={selectedFeedData} onSavePost={handleSavePost} savedPosts={savedPosts} />
            ) : dashboardData.length > 0 ? (
              <Sidebar selectedFeedData={dashboardData} onSavePost={handleSavePost} savedPosts={savedPosts} />
            ) : (
              <p>Select a feed or Dashboard to display posts</p>
            )}
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
