import useDashboardLogic from "@/hooks/useDashboardLogic";
import { useDisplayLogic } from "@/hooks/useDisplayLogic";
import { Alert, Skeleton, Empty } from "antd";
import NewsSection from "./NewsSection";

const DashboardDisplay: React.FC = () => {
    const { loading, error, latestNews, topStories, formatDate } = useDashboardLogic();
    const { modifyLinks, defaultImage } = useDisplayLogic();

    if (loading) {
        return <Skeleton active paragraph={{ rows: 10 }} style={{ marginTop: '5rem' }} />;
    }
    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <>

            <div className="bento-grid">
                <span className="dashboard-date">{formatDate()}</span>
                {topStories.length > 0 || latestNews.length > 0 ? (
                    <>
                        <NewsSection
                            title="🎖 Top stories"
                            items={topStories}
                            cssClass="featured"
                            modifyLinks={modifyLinks}
                            defaultImage={defaultImage}
                        />
                        <NewsSection
                            title="🔥 Latest news"
                            items={latestNews}
                            cssClass="local"
                            modifyLinks={modifyLinks}
                            defaultImage={defaultImage}
                        />
                    </>
                ) : (
                    <Empty description="No data found" />
                )}
            </div>
        </>
    );
};

export default DashboardDisplay;
