import React, { Dispatch, SetStateAction, useState } from "react";
import { Input, Button } from "antd";
import { MenuOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PresentationType } from "@/types/RSSFeed";

interface SearchAndViewSwitcherProps {
    collapsed: boolean;
    small: boolean;
    onSearch: (term: string) => void;
    typeofPresentation: string;
    setTypeofPresentation: Dispatch<SetStateAction<PresentationType>>;
}
const { Search } = Input;

const NavControls: React.FC<SearchAndViewSwitcherProps> = ({
    collapsed,
    onSearch,
    setTypeofPresentation,
    typeofPresentation,
    small = false
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSearch(searchTerm);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
        } finally {
            setLoading(false);
            setSearchTerm('');
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className={`nav-controls `}
            style={{
                padding: !collapsed ? '0 16px' : 0,
                justifyContent: small ? 'flex-end' : 'unset',
            }}
        >
            {!small && <div className="input-search" >
                <Search
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                    placeholder="Search your topic"
                    loading={loading}
                    enterButton
                />
            </div>}

            <div className="style-view-btn-content"
                style={{ padding: small ? '2rem 0' : '0' }}>
                <Button
                    icon={<UnorderedListOutlined />}
                    onClick={() => setTypeofPresentation('listCard')}
                    disabled={typeofPresentation === 'listCard'}
                />
                <Button
                    icon={<MenuOutlined />}
                    onClick={() => setTypeofPresentation('list')}
                    disabled={typeofPresentation === 'list'}
                />
            </div>
        </form>
    );
};

export default NavControls;