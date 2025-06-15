-- Create templates table
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    preview_images TEXT[],
    file_url TEXT NOT NULL,
    file_size INTEGER,
    slide_count INTEGER,
    aspect_ratio VARCHAR(10) DEFAULT '16:9',
    download_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create download_logs table
CREATE TABLE download_logs (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id),
    ip_address INET,
    user_agent TEXT,
    download_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_featured ON templates(featured);
CREATE INDEX idx_templates_created_at ON templates(created_at);
CREATE INDEX idx_download_logs_template_id ON download_logs(template_id);
CREATE INDEX idx_download_logs_download_date ON download_logs(download_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE templates
    SET download_count = download_count + 1
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically increment download count
CREATE TRIGGER increment_template_download_count
    AFTER INSERT ON download_logs
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count(); 