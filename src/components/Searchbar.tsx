import React, { useState } from "react";
import { Input, Button } from "antd";

interface SearchbarProps {
    collapsed: boolean;
    onSearch: (term: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ collapsed, onSearch }) => {

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);

    };

    return (
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: !collapsed ? '0 16px' : 0 }}>

            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '0.5rem', padding: '2rem 0', }}>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your topic"
                    required
                    style={{ marginRight: '8px' }}
                />
                <Button type="default" htmlType="submit">Search</Button>
            </div>

        </form>
    );
};

export default Searchbar;
