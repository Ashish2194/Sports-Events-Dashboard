import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import './Header.css';

const Header = ({ title, hasSearchBar, onSearchHandler }) => {
    return <>
        <header className={!hasSearchBar ? 'padded_header':''}>
            <h2>{title}</h2>
            {hasSearchBar && <SearchBar onChange={onSearchHandler} />}
        </header>
    </>
}

export default Header;