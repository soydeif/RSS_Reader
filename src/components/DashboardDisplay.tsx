import useDashboardLogic from "@/hooks/useDashboardLogic";
import { useDisplayLogic } from "@/hooks/useDisplayLogic";
import { Alert, Skeleton, Empty } from "antd";
import NewsSection from "./NewsSection";
import { Fragment } from "react/jsx-runtime";

const DashboardDisplay: React.FC = () => {
    const { modifyLinks, defaultImage } = useDisplayLogic();
    const { loading, error, latestNews, topStories, formatDate } = useDashboardLogic();

    if (loading || !topStories.length && !latestNews.length) {
        return <Skeleton active paragraph={{ rows: 10 }} style={{ marginTop: "5rem" }} />;
    }

    if (error) {
        return <Fragment>
            <Alert message={error} type="error" showIcon />
            <Empty description="No data found" />
        </Fragment>
    }



    return (
        <>
            <div className="bento-grid">
                <span className="dashboard-date">{formatDate()}</span>
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
            </div>
        </>
    );
};

export default DashboardDisplay;
