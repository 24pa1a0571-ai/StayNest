const { query } = require('../config/db');
const { propertyRow, parseJson } = require('../utils');
const baseSelect = `SELECT p.*, u.name owner_name,u.email owner_email,u.phone owner_phone,u.profile_image owner_profile_image FROM properties p JOIN users u ON u.id=p.owner_id`;
exports.getProperties=async(req,res)=>{
  try{
    const {city,locality,minRent,maxRent,type,genderPreference,verified,amenities,rating,sort,search}=req.query;
    const where=['p.is_active=1']; const params=[];
    if(city){where.push('LOWER(p.city) LIKE LOWER(?)');params.push(`%${city}%`)}
    if(locality){where.push('LOWER(p.locality) LIKE LOWER(?)');params.push(`%${locality}%`)}
    if(search){where.push('(LOWER(p.name) LIKE LOWER(?) OR LOWER(p.locality) LIKE LOWER(?) OR LOWER(p.city) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))');params.push(...Array(4).fill(`%${search}%`))}
    if(type && !['All','All types'].includes(type)){where.push('p.type=?');params.push(type)}
    if(genderPreference && genderPreference!=='All'){where.push('p.gender_preference=?');params.push(genderPreference)}
    if(verified==='true') where.push("p.verification_status='Verified'");
    if(minRent){where.push('p.monthly_rent>=?');params.push(Number(minRent))}
    if(maxRent){where.push('p.monthly_rent<=?');params.push(Number(maxRent))}
    if(rating){where.push('p.rating>=?');params.push(Number(rating))}
    const order=sort==='price_asc'?'p.monthly_rent ASC':sort==='price_desc'?'p.monthly_rent DESC':sort==='rating'?'p.rating DESC':'p.created_at DESC';
    const [rows]=await query(`${baseSelect} WHERE ${where.join(' AND ')} ORDER BY ${order}`,params);
    let data=rows.map(propertyRow);
    if(amenities){ const wanted=String(amenities).split(',').map(x=>x.trim().toLowerCase()).filter(Boolean); data=data.filter(p=>wanted.every(a=>p.amenities.map(x=>String(x).toLowerCase()).includes(a))); }
    res.json({success:true,count:data.length,data});
  }catch(e){console.error(e);res.status(500).json({success:false,message:'Could not load properties.',error:e.message});}
};
exports.getPropertyById=async(req,res)=>{
  try{
    const [rows]=await query(`${baseSelect} WHERE p.id=? LIMIT 1`,[req.params.id]);
    if(!rows[0]) return res.status(404).json({success:false,message:'Property not found'});
    const [reviews]=await query(`SELECT r.*,u.name user_name,u.profile_image user_profile_image FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.property_id=? ORDER BY r.created_at DESC`,[req.params.id]);
    res.json({success:true,data:propertyRow(rows[0]),reviews:reviews.map(r=>({...r,_id:r.id,id:r.id,user:{id:r.user_id,name:r.user_name,profileImage:r.user_profile_image||''},rating:Number(r.rating),comment:r.comment,createdAt:r.created_at}))});
  }catch(e){res.status(500).json({success:false,message:'Could not load property details.',error:e.message});}
};
exports.getOwnerProperties=async(req,res)=>{const [rows]=await query(`${baseSelect} WHERE p.owner_id=? ORDER BY p.created_at DESC`,[req.user.id]);res.json({success:true,count:rows.length,data:rows.map(propertyRow)});};
exports.createProperty=async(req,res)=>{
  try{
    const b=req.body;
    if(!b.name||!b.description||!b.city||!b.locality||!b.address||!b.monthlyRent||!b.deposit) return res.status(400).json({success:false,message:'Please fill all required property fields.'});
    const [r]=await query(`INSERT INTO properties(name,description,type,owner_id,city,locality,address,monthly_rent,deposit,amenities,room_types,gender_preference,food_available,available_rooms,total_rooms,images,distance,verification_status,rating,safety_score) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[
      b.name,b.description,b.type||'PG',req.user.id,b.city,b.locality,b.address,Number(b.monthlyRent),Number(b.deposit),JSON.stringify(b.amenities||['Wi-Fi','Food','Laundry']),JSON.stringify(b.roomTypes||['Single Sharing','Double Sharing']),b.genderPreference||'Unisex',b.foodAvailable!==false,Number(b.availableRooms)||3,Number(b.totalRooms)||10,JSON.stringify(b.images||['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80']),b.distance||'1.0 km','Verified',4.5,4.6]);
    const [rows]=await query(`${baseSelect} WHERE p.id=?`,[r.insertId]);res.status(201).json({success:true,data:propertyRow(rows[0]),message:'Property created successfully.'});
  }catch(e){console.error(e);res.status(500).json({success:false,message:'Could not create property.',error:e.message});}
};
exports.updateProperty=async(req,res)=>{
  try{const [rows]=await query('SELECT * FROM properties WHERE id=?',[req.params.id]);const p=rows[0];if(!p)return res.status(404).json({success:false,message:'Property not found'});if(p.owner_id!==req.user.id)return res.status(403).json({success:false,message:'Not authorized'});
    const b=req.body; const fields={name:b.name,description:b.description,type:b.type,city:b.city,locality:b.locality,address:b.address,monthly_rent:b.monthlyRent,deposit:b.deposit,amenities:b.amenities&&JSON.stringify(b.amenities),room_types:b.roomTypes&&JSON.stringify(b.roomTypes),gender_preference:b.genderPreference,food_available:b.foodAvailable,available_rooms:b.availableRooms,total_rooms:b.totalRooms,images:b.images&&JSON.stringify(b.images),distance:b.distance};
    const sets=[];const vals=[];for(const [k,v] of Object.entries(fields)){if(v!==undefined){sets.push(`${k}=?`);vals.push(v)}} if(!sets.length)return res.json({success:true,data:propertyRow(p)});vals.push(req.params.id);await query(`UPDATE properties SET ${sets.join(',')} WHERE id=?`,vals);const [fresh]=await query(`${baseSelect} WHERE p.id=?`,[req.params.id]);res.json({success:true,data:propertyRow(fresh[0]),message:'Property updated successfully.'});
  }catch(e){res.status(500).json({success:false,message:'Could not update property.',error:e.message});}
};
exports.deleteProperty=async(req,res)=>{const [rows]=await query('SELECT owner_id FROM properties WHERE id=?',[req.params.id]);if(!rows[0])return res.status(404).json({success:false,message:'Property not found'});if(rows[0].owner_id!==req.user.id)return res.status(403).json({success:false,message:'Not authorized'});await query('UPDATE properties SET is_active=0 WHERE id=?',[req.params.id]);res.json({success:true,message:'Property removed from listings.'});};
