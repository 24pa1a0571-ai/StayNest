const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { userRow } = require('../utils');
const tokenFor = id => jwt.sign({id}, process.env.JWT_SECRET || 'staynest_super_secret_jwt_key_2026', {expiresIn:'30d'});
const publicUser = row => userRow(row);

exports.register = async (req,res) => {
  try {
    const {name,email,phone,password,role,preferredCity,preferredLocality,budget} = req.body;
    if(!name || !email || !password) return res.status(400).json({success:false,message:'Name, email and password are required.'});
    if(password.length < 6) return res.status(400).json({success:false,message:'Password must be at least 6 characters.'});
    const [exists] = await query('SELECT id FROM users WHERE email=? LIMIT 1',[email.toLowerCase().trim()]);
    if(exists[0]) return res.status(400).json({success:false,message:'User with this email already exists.'});
    const hash=await bcrypt.hash(password,10);
    const [result]=await query(`INSERT INTO users(name,email,phone,password,role,preferred_city,preferred_locality,budget) VALUES(?,?,?,?,?,?,?,?)`,[name.trim(),email.toLowerCase().trim(),phone||'',hash,role||'student',preferredCity||'Bangalore',preferredLocality||'',Number(budget)||15000]);
    const [rows]=await query('SELECT * FROM users WHERE id=?',[result.insertId]);
    const user=publicUser(rows[0]);
    res.status(201).json({success:true,token:tokenFor(user.id),user});
  } catch(e){ console.error(e); res.status(500).json({success:false,message:'Registration failed.',error:e.message}); }
};
exports.login = async (req,res) => {
  try{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).json({success:false,message:'Email and password are required.'});
    const [rows]=await query('SELECT * FROM users WHERE email=? LIMIT 1',[email.toLowerCase().trim()]);
    const user=rows[0];
    if(!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({success:false,message:'Invalid email or password.'});
    res.json({success:true,token:tokenFor(user.id),user:publicUser(user)});
  }catch(e){res.status(500).json({success:false,message:'Login failed.',error:e.message});}
};
exports.getMe=async(req,res)=>res.json({success:true,user:req.user});
