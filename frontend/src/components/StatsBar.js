// frontend/src/components/StatsBar.js

import React from 'react';

const StatsBar = () => {
    // In a real app, these numbers would come from an API call
    const stats = {
        books: "8,200+",
        users: "1,500+",
        exchanges: "12,000+"
    };

    return (
        <section className="stats-bar">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 stat-item mb-4 mb-md-0">
                        <h2>{stats.books}</h2>
                        <p>Books Available</p>
                    </div>
                    <div className="col-md-4 stat-item mb-4 mb-md-0">
                        <h2>{stats.users}</h2>
                        <p>Active Members</p>
                    </div>
                    <div className="col-md-4 stat-item">
                        <h2>{stats.exchanges}</h2>
                        <p>Books Exchanged</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsBar;