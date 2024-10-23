import React, { useState } from "react";
import { Input, Button } from "antd";
import { MenuOutlined, UnorderedListOutlined, BorderOutlined } from '@ant-design/icons';

interface SearchAndViewSwitcherProps {
    collapsed: boolean;
    onSearch: (term: string) => void;
    onViewChange: (viewType: string) => void;
}

const SearchAndViewSwitcher: React.FC<SearchAndViewSwitcherProps> = ({ collapsed, onSearch, onViewChange }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: !collapsed ? '0 16px' : 0, gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', gap: '0.5rem', padding: '2rem 0', flexGrow: 1 }}>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your topic"
                    style={{ marginRight: '8px' }}
                />
                <Button type="default" htmlType="submit">Search</Button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    icon={<UnorderedListOutlined />}
                    onClick={() => onViewChange('listCard')}
                />
                <Button
                    icon={<MenuOutlined />}
                    onClick={() => onViewChange('list')}
                />
                <Button
                    icon={<BorderOutlined />}
                    onClick={() => onViewChange('card')}
                />
            </div>
        </form>
    );
};

export default SearchAndViewSwitcher;
