const {query}=require('../config/db');
const {propertyRow}=require('../utils');
const sel=`SELECT p.*,u.name owner_name,u.email owner_email,u.phone owner_phone,u.profile_image owner_profile_image FROM shortlists s JOIN properties p ON p.id=s.property_id JOIN users u ON u.id=p.owner_id`;
exports.getShortlist=async(req,res)=>{const [rows]=await query(`${sel} WHERE s.user_id=? AND p.is_active=1 ORDER BY s.created_at DESC`,[req.user.id]);res.json({success:true,count:rows.length,data:rows.map(propertyRow)});};
exports.addToShortlist=async(req,res)=>{try{await query('INSERT INTO shortlists(user_id,property_id) VALUES(?,?)',[req.user.id,req.params.propertyId]);res.status(201).json({success:true,message:'Added to shortlist.'});}catch(e){if(e.code==='ER_DUP_ENTRY')return res.json({success:true,message:'Already shortlisted.'});res.status(500).json({success:false,message:'Could not shortlist property.',error:e.message});}};
exports.removeFromShortlist=async(req,res)=>{await query('DELETE FROM shortlists WHERE user_id=? AND property_id=?',[req.user.id,req.params.propertyId]);res.json({success:true,message:'Removed from shortlist.'});};
