const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const baseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306)
};
const database = process.env.DB_NAME || 'staynest';

const schema = [
`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT '',
  password VARCHAR(255) NOT NULL,
  role ENUM('student','professional','owner') NOT NULL DEFAULT 'student',
  profile_image TEXT,
  preferred_city VARCHAR(100) DEFAULT 'Bangalore',
  preferred_locality VARCHAR(120) DEFAULT '',
  budget DECIMAL(10,2) DEFAULT 15000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('PG','Hostel','Co-Living') NOT NULL DEFAULT 'PG',
  owner_id INT NOT NULL,
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,7) DEFAULT 12.9716000,
  longitude DECIMAL(10,7) DEFAULT 77.5946000,
  monthly_rent DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  safety_score DECIMAL(2,1) DEFAULT 4.6,
  verification_status ENUM('Pending','Verified','Rejected') DEFAULT 'Verified',
  verification_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  amenities JSON,
  room_types JSON,
  gender_preference ENUM('Boys','Girls','Unisex') DEFAULT 'Unisex',
  food_available BOOLEAN DEFAULT TRUE,
  available_rooms INT DEFAULT 3,
  total_rooms INT DEFAULT 10,
  images JSON,
  distance VARCHAR(40) DEFAULT '1.0 km',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_property_city(city), INDEX idx_property_rent(monthly_rent), INDEX idx_property_owner(owner_id)
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  safety_rating TINYINT DEFAULT 5,
  cleanliness_rating TINYINT DEFAULT 5,
  food_rating TINYINT DEFAULT 4,
  location_rating TINYINT DEFAULT 5,
  value_rating TINYINT DEFAULT 4,
  comment TEXT NOT NULL,
  verified_resident BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_property FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS shortlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_shortlist(user_id,property_id),
  CONSTRAINT fk_shortlist_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_shortlist_property FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  room_type VARCHAR(100) DEFAULT 'Double Sharing',
  sharing_type VARCHAR(100) DEFAULT 'Double',
  monthly_rent DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  move_in_date DATE NOT NULL,
  status ENUM('pending','accepted','declined','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(40) NOT NULL DEFAULT '10:00 AM',
  status ENUM('pending','accepted','declined','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT,
  last_message TEXT,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE SET NULL
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY(conversation_id,user_id),
  FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`,
`CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking','visit','message','system') DEFAULT 'system',
  related_id VARCHAR(80) DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB`
];

async function connectDB() {
  try {
    const connection = await mysql.createConnection(baseConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();
    pool = mysql.createPool({ ...baseConfig, database, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
    for (const statement of schema) await pool.query(statement);
    console.log(`MySQL connected: ${database}`);
    return pool;
  } catch (error) {
    console.error('MySQL connection/setup failed:', error.message);
    console.error('Check MySQL service and DB_HOST/DB_USER/DB_PASSWORD in server/.env');
    process.exit(1);
  }
}

function query(sql, params=[]) {
  if (!pool) throw new Error('Database not initialized');
  return pool.query(sql, params);
}
function getPool(){ return pool; }

module.exports = { connectDB, query, getPool, database };
