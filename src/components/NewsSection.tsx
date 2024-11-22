import React from "react";
import { Image } from "antd";
import { NewsItem } from "@/types/RSSFeed";


interface NewsSectionProps {
    title: string;
    items: NewsItem[];
    cssClass: string;
    modifyLinks: (text: string, addLinks: boolean) => React.ReactNode;
    defaultImage: string;
}

const NewsSection: React.FC<NewsSectionProps> = ({
    title,
    items,
    cssClass,
    modifyLinks,
    defaultImage,
}) => {
    return (
        <div className={`bento-column ${cssClass}`}>
            <h2>{title}</h2>
            <div className={`${cssClass}-items`}>
                {items.map((item, index) => (
                    <div
                        className={`${cssClass}-item ${index === 0 ? `${cssClass}-item-featured` : ""
                            }`}
                        key={item.id}
                    >
                        {item.image && (
                            <Image
                                alt={item.title}
                                src={item.image || ""}
                                fallback={defaultImage}
                                loading="lazy"
                                className={`${cssClass}-image`}
                                height="180px"
                            />
                        )}
                        <div className={`${cssClass}-content`}>
                            <h3>{item.title}</h3>
                            {item.source && <span className={`${cssClass}-source`}>{item.source}</span>}
                            <p>{modifyLinks(item.summary, true)}</p>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                Continue reading
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsSection;
