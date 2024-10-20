import React, { useState, useEffect } from 'react';
import "./reset.css";
import "./global.css";
import Sidebar from "./components/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined, BookOutlined, ProfileOutlined } from '@ant-design/icons';
import { Layout, Button, Menu, Skeleton, Alert } from 'antd';
import { useFetchNews, Article } from './hooks/useFetchNews';
import { FeedItemPost } from './types/RSSFeed';
import Searchbar from './components/Searchbar';
import { store } from './store';
import { addFeed, removeFeed } from './rssSlice';

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

const mapArticleToFeedItemPost = (article: Article, category: string): FeedItemPost => ({
  id: article.url,
  title: article.title,
  description: article.description,
  content: article.content || '',
  link: article.url,
  thumbnailUrl: article.urlToImage || '',
  feedTitle: article.source.name,
  publishedAt: article.publishedAt,
  author: article?.author,
  category,
});

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [savedPosts, setSavedPosts] = useState<FeedItemPost[]>(() => {
    const savedPostsFromStorage = localStorage.getItem("savedPosts");
    return savedPostsFromStorage ? JSON.parse(savedPostsFromStorage) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>('general');
  const [viewSaved, setViewSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { news, loading, error } = useFetchNews(selectedCategory || 'general');

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setViewSaved(false);
    setSearchTerm('');
  };

  const handleSavePost = (post: FeedItemPost) => {
    setSavedPosts((prev) => {
      const isAlreadySaved = prev.some(item => item.id === post.id);
      if (isAlreadySaved) {
        const newPosts = prev.filter(item => item.id !== post.id);
        store.dispatch(removeFeed(post.id));
        return newPosts;
      } else {
        store.dispatch(addFeed({ title: post.title, url: post.link }));
        return [...prev, post];
      }
    });
  };

  const filteredPosts = viewSaved
    ? savedPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : news.map(article => mapArticleToFeedItemPost(article, selectedCategory || 'general'));


  const groupedPosts = (posts: FeedItemPost[]) => {
    return categories.reduce((acc, category) => {
      const filteredByCategory = posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()) && post.category === category.key);
      if (filteredByCategory.length > 0) {
        acc[category.label] = filteredByCategory;
      }
      return acc;
    }, {} as Record<string, FeedItemPost[]>);
  };

  const filteredGroupedPosts = groupedPosts(filteredPosts);

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

          <Menu.SubMenu key="saved" icon={<BookOutlined />} title="Saved" onClick={() => { setViewSaved(true); setSearchTerm('') }} disabled={savedPosts.length === 0}>
            <Menu.Item key="list"  >
              <span>Recently added</span>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>


      </Sider>

      <Layout>
        <div style={{ minHeight: '45px' }} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ borderRadius: 8, minHeight: 360 }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 10 }} />
            ) : error ? (
              <Alert message="Error al cargar las noticias" type="error" showIcon />
            ) : searchTerm ? (
              Object.keys(filteredGroupedPosts).length > 0 ? (
                <>
                  {Object.entries(filteredGroupedPosts).map(([, posts]) => (
                    <>
                      <Searchbar collapsed={collapsed} onSearch={setSearchTerm} />
                      <Sidebar selectedFeedData={posts} onSavePost={handleSavePost} savedPosts={savedPosts} pagination={false} />
                    </>
                  ))}
                </>
              ) : (
                <p>No se encontraron resultados.</p>
              )
            ) : (
              <>
                <Searchbar collapsed={collapsed} onSearch={setSearchTerm} />
                <Sidebar selectedFeedData={filteredPosts} onSavePost={handleSavePost} savedPosts={savedPosts} />
              </>
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
