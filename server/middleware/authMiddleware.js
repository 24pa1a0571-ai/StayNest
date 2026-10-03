const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { userRow } = require('../utils');

const protect = async (req,res,next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
  else if (req.headers['x-auth-token']) token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({success:false,message:'Please log in to continue.'});
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'staynest_super_secret_jwt_key_2026');
    const [rows] = await query('SELECT * FROM users WHERE id=? LIMIT 1',[decoded.id]);
    if (!rows[0]) return res.status(401).json({success:false,message:'User no longer exists.'});
    req.user = userRow(rows[0]);
    req.user.password = undefined;
    next();
  } catch(e){ return res.status(401).json({success:false,message:'Invalid or expired login session.'}); }
};
const authorize = (...roles) => (req,res,next) => {
  if(!req.user || !roles.includes(req.user.role)) return res.status(403).json({success:false,message:`Role '${req.user?.role || 'guest'}' is not allowed.`});
  next();
};
module.exports={protect,authorize};
