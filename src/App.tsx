import React, { useState, useEffect } from 'react';
import "./reset.css";
import "./global.css";
import Sidebar from "./components/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined, BookOutlined, ProfileOutlined } from '@ant-design/icons';
import { Layout, Button, Menu, Skeleton, Alert } from 'antd';
import { useFetchNews, Article } from './hooks/useFetchNews';
import { FeedItemPost } from './types/RSSFeed';
import Searchbar from './components/Searchbar';

const { Header, Content, Footer, Sider } = Layout;

const categories = [
  { key: 'business', label: 'Business' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'general', label: 'General' },
  { key: 'health', label: 'Health' },
  { key: 'science', label: 'Science' },
  { key: 'sports', label: 'Sports' },
  { key: 'technology', label: 'Technology' }
];

const mapArticleToFeedItemPost = (article: Article): FeedItemPost => ({
  id: article.url,
  title: article.title,
  description: article.description,
  content: article.content || '',
  link: article.url,
  thumbnailUrl: article.urlToImage || '',
  feedTitle: article.source.name,
  publishedAt: article.publishedAt,
  author: article?.author,
});

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [savedPosts, setSavedPosts] = useState<FeedItemPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('general');

  const { news, loading, error } = useFetchNews(selectedCategory || 'general');

  useEffect(() => {
    const storedPosts = localStorage.getItem("savedPosts");
    if (storedPosts) {
      setSavedPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
  };

  const handleSavePost = (post: FeedItemPost) => {
    setSavedPosts((prev) => {
      const isAlreadySaved = prev.some(item => item.id === post.id);
      return isAlreadySaved ? prev.filter(item => item.id !== post.id) : [...prev, post];
    });
  };

  const feedData: FeedItemPost[] = news.map(mapArticleToFeedItemPost);

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
          selectedKeys={[selectedCategory || '']}
          style={{ background: '#dfdaf9ba' }}
        >
          <Menu.SubMenu key="Categories" icon={<ProfileOutlined />} title="Categories">
            {categories.map((category) => (
              <Menu.Item key={category.key}
                onClick={() => handleCategoryClick(category.key)}>
                <span>{category.label}</span>
              </Menu.Item>
            ))}
          </Menu.SubMenu>

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
          <div style={{ borderRadius: 8, minHeight: 360 }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : error ? (
              <Alert message="Error al cargar las noticias" type="error" showIcon />
            ) : feedData.length > 0 ? (
              <Sidebar selectedFeedData={feedData} onSavePost={handleSavePost} savedPosts={savedPosts} />
            ) : (
              <p>Selecciona una categoría para mostrar noticias</p>
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
