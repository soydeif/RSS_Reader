import { PostItemProps } from "../types/RSSFeed";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export const PostItem: React.FC<PostItemProps> = ({ item, isActive, onItemClick }) => {
    const modifyLinks = (html: string) => {

        const sanitizedHTML = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
        return parse(sanitizedHTML, {
            replace: (domNode) => {
                if (domNode.type === 'tag' && domNode.name === 'a') {
                    domNode.attribs.target = '_blank';
                    domNode.attribs.rel = 'noopener noreferrer';
                }
            }
        });
    };
    return (
        <div className="rss-item" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <h4
                onClick={onItemClick}
                style={{ cursor: 'pointer', background: '#e0e0e0', padding: '5px' }}
            >
                {item.title}
            </h4>

            {isActive && (
                <>
                    <div>{modifyLinks(item.description)}</div>
                    <div>{modifyLinks(item.content)}</div>
                </>
            )}
        </div>
    );
};