-- ============================================
-- SMART LINK HUB - PostgreSQL Database Schema
-- ============================================

-- Users table: Stores user accounts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hubs table: Each user's public link page
CREATE TABLE hubs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(50) UNIQUE NOT NULL, -- The public URL (e.g., myapp.com/username)
  title VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme_config JSONB DEFAULT '{"bg": "#000000", "accent": "#00FF00", "textColor": "#FFFFFF"}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Links table: Individual links in a hub
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  hub_id INT REFERENCES hubs(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50), -- Optional icon identifier
  priority INT DEFAULT 0, -- For ordering (higher = top)
  click_count INT DEFAULT 0, -- For performance-based sorting
  is_active BOOLEAN DEFAULT TRUE,
  last_checked_at TIMESTAMP,
  status_code INT,
  is_healthy BOOLEAN DEFAULT TRUE,
  archive_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link Rules table: Smart routing conditions
CREATE TABLE link_rules (
  id SERIAL PRIMARY KEY,
  link_id INT REFERENCES links(id) ON DELETE CASCADE,
  rule_type VARCHAR(20) NOT NULL, -- 'TIME', 'DEVICE', 'LOCATION'
  conditions JSONB NOT NULL, 
  -- Examples:
  -- TIME: {"startHour": 9, "endHour": 17}
  -- DEVICE: {"device": "mobile"} or {"device": "desktop"}
  -- LOCATION: {"country": "IN"} or {"countries": ["US", "UK"]}
  action VARCHAR(20) DEFAULT 'SHOW', -- 'SHOW' or 'HIDE'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table: Analytics tracking
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  hub_id INT REFERENCES hubs(id) ON DELETE CASCADE,
  link_id INT REFERENCES links(id) ON DELETE SET NULL, -- NULL for page views
  event_type VARCHAR(20) NOT NULL, -- 'VIEW', 'CLICK'
  visitor_ip VARCHAR(45), -- Supports IPv6
  visitor_country VARCHAR(2), -- ISO country code
  visitor_device VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  visitor_user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_hubs_slug ON hubs(slug);
CREATE INDEX idx_hubs_user_id ON hubs(user_id);
CREATE INDEX idx_links_hub_id ON links(hub_id);
CREATE INDEX idx_link_rules_link_id ON link_rules(link_id);
CREATE INDEX idx_events_hub_id ON events(hub_id);
CREATE INDEX idx_events_link_id ON events(link_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_event_type ON events(event_type);

-- Sample seed data for testing
INSERT INTO users (email, password_hash, name) 
VALUES ('demo@example.com', 'hashed_password_here', 'Demo User');

INSERT INTO hubs (user_id, slug, title, bio) 
VALUES (1, 'demo', 'Demo Hub', 'Welcome to my Smart Link Hub!');

INSERT INTO links (hub_id, title, url, priority) VALUES
(1, 'My Website', 'https://example.com', 100),
(1, 'GitHub', 'https://github.com', 90),
(1, 'LinkedIn', 'https://linkedin.com', 80),
(1, 'Join Meeting (9AM-5PM)', 'https://meet.example.com', 70),
(1, 'Download iOS App', 'https://apps.apple.com/example', 60),
(1, 'Download Android App', 'https://play.google.com/example', 60),
(1, 'Amazon India', 'https://amazon.in/shop', 50),
(1, 'Amazon US', 'https://amazon.com/shop', 50);

-- Time-based rule: Meeting link only 9 AM - 5 PM
INSERT INTO link_rules (link_id, rule_type, conditions, action) 
VALUES (4, 'TIME', '{"startHour": 9, "endHour": 17}', 'SHOW');

-- Device-based rules: Show store links based on device
INSERT INTO link_rules (link_id, rule_type, conditions, action) 
VALUES (5, 'DEVICE', '{"device": "mobile", "os": "ios"}', 'SHOW');

INSERT INTO link_rules (link_id, rule_type, conditions, action) 
VALUES (6, 'DEVICE', '{"device": "mobile", "os": "android"}', 'SHOW');

-- Location-based rules: Regional Amazon links
INSERT INTO link_rules (link_id, rule_type, conditions, action) 
VALUES (7, 'LOCATION', '{"country": "IN"}', 'SHOW');

INSERT INTO link_rules (link_id, rule_type, conditions, action) 
VALUES (8, 'LOCATION', '{"country": "US"}', 'SHOW');
