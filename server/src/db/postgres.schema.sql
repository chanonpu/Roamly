-- Reference schema for a production Postgres backend, matching the shape
-- already documented in the frontend's DocumentationModal.tsx. The shipped
-- server uses a simple file-backed store (db/store.ts) instead so the app
-- runs with zero setup; swap that module for a repository built on this
-- schema (e.g. with `pg` or an ORM) when you're ready to go to production.

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    visited_countries JSONB DEFAULT '[]',
    planned_countries JSONB DEFAULT '[]',
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    unlocked_at DATE
);

CREATE TABLE destinations (
    id VARCHAR(50) PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10),
    image_url TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    timezone VARCHAR(50),
    best_season VARCHAR(80),
    avg_daily_cost_usd NUMERIC(10,2),
    description TEXT,
    has_warning BOOLEAN DEFAULT FALSE,
    warning_key VARCHAR(30),
    popular_tags JSONB DEFAULT '[]'
);

CREATE TABLE travel_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    country VARCHAR(100),
    flag_emoji VARCHAR(10),
    cover_image TEXT,
    summary TEXT,
    duration_days INT NOT NULL,
    season VARCHAR(20),
    preferences JSONB DEFAULT '[]',
    companion_style VARCHAR(20),
    estimated_cost_usd NUMERIC(10,2),
    transportation VARCHAR(200),
    weather_forecast VARCHAR(200),
    creator_id VARCHAR(36) REFERENCES users(id),
    is_published BOOLEAN DEFAULT TRUE,
    is_forked BOOLEAN DEFAULT FALSE,
    original_itinerary_id VARCHAR(36) REFERENCES travel_plans(id),
    likes_count INT DEFAULT 0,
    bookmarks_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    rating NUMERIC(2,1) DEFAULT 0,
    ratings_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    day_title VARCHAR(200),
    time_of_day VARCHAR(20), -- 'Morning', 'Afternoon', 'Evening'
    sort_order INT DEFAULT 0,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    location TEXT,
    description TEXT,
    estimated_duration VARCHAR(50),
    estimated_cost_usd NUMERIC(10,2),
    google_maps_url TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6)
);

CREATE TABLE packing_items (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    category VARCHAR(20),
    item VARCHAR(200) NOT NULL,
    packed BOOLEAN DEFAULT FALSE
);

CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id),
    content TEXT NOT NULL,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, user_id)
);

CREATE TABLE bookmarks (
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, user_id)
);

CREATE INDEX idx_activities_plan ON activities(plan_id, day_number, sort_order);
CREATE INDEX idx_comments_plan ON comments(plan_id);
CREATE INDEX idx_plans_creator ON travel_plans(creator_id);
