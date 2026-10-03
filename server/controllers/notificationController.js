const {query}=require('../config/db');
exports.getNotifications=async(req,res)=>{const [rows]=await query('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC',[req.user.id]);res.json({success:true,data:rows.map(n=>({...n,id:n.id,_id:n.id,read:!!n.is_read,createdAt:n.created_at}))});};
exports.markAsRead=async(req,res)=>{await query('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?',[req.params.id,req.user.id]);res.json({success:true});};
exports.markAllAsRead=async(req,res)=>{await query('UPDATE notifications SET is_read=1 WHERE user_id=?',[req.user.id]);res.json({success:true});};
