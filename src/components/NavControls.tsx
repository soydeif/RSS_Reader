import React, { Dispatch, SetStateAction, useState } from "react";
import { Input, Button } from "antd";
import { MenuOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PresentationType } from "@/types/RSSFeed";



interface SearchAndViewSwitcherProps {
    collapsed: boolean;
    onSearch: (term: string) => void;
    setTypeofPresentation: Dispatch<SetStateAction<PresentationType>>;
}

const NavControls: React.FC<SearchAndViewSwitcherProps> = ({ collapsed, onSearch, setTypeofPresentation }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
        setSearchTerm('')
    };

    return (
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: !collapsed ? '0 16px' : 0, gap: '1rem' }}>
            <div
                className="input-search"
                style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', gap: '0.5rem', padding: '2rem 0', flexGrow: 1 }}>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                    placeholder="Search your topic"
                    style={{ marginRight: '8px' }}
                />
                <Button type="default" htmlType="submit">Search</Button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}
                className="style-view-btn-content">
                <Button
                    icon={<UnorderedListOutlined />}
                    onClick={() => setTypeofPresentation('listCard')}
                />
                <Button
                    icon={<MenuOutlined />}
                    onClick={() => setTypeofPresentation('list')}
                />
            </div>
        </form>
    );
};

export default NavControls;
