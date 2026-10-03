const bcrypt=require('bcryptjs');
const {connectDB,query}=require('../config/db');
const seed=async()=>{
 await connectDB();
 console.log('Resetting StayNest demo data...');
 await query('SET FOREIGN_KEY_CHECKS=0');
 for(const t of ['notifications','messages','conversation_participants','conversations','visits','bookings','shortlists','reviews','properties','users']) await query(`TRUNCATE TABLE ${t}`);
 await query('SET FOREIGN_KEY_CHECKS=1');
 const hash=await bcrypt.hash('StayNest123',10);
 const users=[
  ['Aarav Mehta','student@staynest.demo','+91 98765 43210',hash,'student','Bangalore','Koramangala',15000],
  ['Kiran Kumar','owner@staynest.demo','+91 91234 56789',hash,'owner','Bangalore','',15000],
  ['Rajesh Sharma','rajesh@staynest.demo','+91 99887 76655',hash,'owner','Hyderabad','',15000],
  ['Vikram Rao','vikram@staynest.demo','+91 94433 22110',hash,'professional','Pune','',18000]
 ];
 for(const u of users) await query('INSERT INTO users(name,email,phone,password,role,preferred_city,preferred_locality,budget) VALUES(?,?,?,?,?,?,?,?)',u);
 const [owners]=await query("SELECT id,email FROM users WHERE role='owner'");const o1=owners.find(x=>x.email==='owner@staynest.demo').id,o2=owners.find(x=>x.email==='rajesh@staynest.demo').id;
 const props=[
 ['Bliss PG for Boys','Modern furnished PG with Wi-Fi, housekeeping, security and meals.','PG',o1,'Bangalore','Koramangala 4th Block','#142, 8th Main, Koramangala 4th Block, Bangalore',8500,12000,4.5,4.6,['Food','Wi-Fi','Laundry','AC','CCTV','Power Backup'],['Single Sharing','Double Sharing','Triple Sharing'],'Boys',1,4,12,['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80','https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'],'0.8 km'],
 ['Comfort Stay PG','Spacious stay in a quiet residential area with study tables, attached baths and gym access.','PG',o1,'Bangalore','Koramangala 5th Block','#55, 1st Cross, Koramangala 5th Block, Bangalore',9000,15000,4.2,4.5,['Food','Wi-Fi','Laundry','Gym','Security Guard'],['Double Sharing','Single Room'],'Unisex',1,2,10,['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'],'1.2 km'],
 ['Green Nest Hostel','Student-friendly hostel with terrace lounge, gaming zone and biometric security.','Hostel',o1,'Bangalore','HSR Layout','Sector 3, HSR Layout, Bangalore',7000,10000,4.3,4.7,['Wi-Fi','Laundry','Terrace Lounge','Gaming Zone','Biometric'],['Triple Sharing','Four Sharing'],'Girls',1,6,15,['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'],'2.1 km'],
 ['Urban Living PG','Premium co-living with work desks, social spaces and smart access.','Co-Living',o1,'Bangalore','Indiranagar','100 Feet Road, Indiranagar, Bangalore',11000,15000,4.6,4.7,['Food','Wi-Fi','Laundry','AC','Work Cafe','Housekeeping'],['Single Private','Double Sharing'],'Unisex',1,3,16,['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'],'2.8 km'],
 ['Sunrise Residency','Comfortable accommodation close to HITEC City with meals and 24/7 security.','PG',o2,'Hyderabad','HITEC City','Phase 2, HITEC City, Hyderabad',9500,12000,4.4,4.6,['Food','Wi-Fi','Laundry','AC','Elevator'],['Single Room','Double Sharing'],'Unisex',1,5,20,['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'],'1.5 km'],
 ['NestHub Co-Living','Modern co-living near Hinjewadi IT Park, designed for work and community.','Co-Living',o2,'Pune','Hinjewadi','Phase 1, Hinjewadi, Pune',10500,14000,4.7,4.8,['Food','Wi-Fi','Laundry','AC','Gym','Gaming Zone'],['Single Private','Double Sharing'],'Unisex',1,4,18,['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80'],'0.5 km'],
 ['Metro Stay','Affordable PG next to metro with meals, cleaning, hot water and CCTV.','PG',o2,'Hyderabad','Gachibowli','DLF Road, Gachibowli, Hyderabad',8000,10000,4.1,4.4,['Food','Wi-Fi','Laundry','Hot Water','CCTV'],['Double Sharing','Triple Sharing'],'Boys',1,3,14,['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80'],'0.3 km'],
 ['LakeView PG','Quiet student stay with study-friendly environment and 24/7 security.','Hostel',o2,'Delhi','Hauz Khas','Main Market, Hauz Khas, Delhi',12000,15000,4.6,4.8,['Food','Wi-Fi','Laundry','AC','Library','CCTV'],['Single Room','Double Sharing'],'Girls',1,2,10,['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80'],'0.6 km']
 ];
 for(const p of props){await query(`INSERT INTO properties(name,description,type,owner_id,city,locality,address,monthly_rent,deposit,rating,safety_score,amenities,room_types,gender_preference,food_available,available_rooms,total_rooms,images,distance) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10],JSON.stringify(p[11]),JSON.stringify(p[12]),p[13],p[14],p[15],p[16],JSON.stringify(p[17]),p[18]])}
 const [pRows]=await query('SELECT id FROM properties ORDER BY id LIMIT 2');const student=(await query("SELECT id FROM users WHERE email='student@staynest.demo'"))[0][0].id;
 if(pRows[0]){await query('INSERT INTO reviews(property_id,user_id,rating,comment) VALUES(?,?,?,?)',[pRows[0].id,student,5,'Clean property, good location and easy visit coordination.']);}
 console.log('Seed complete. Demo password: StayNest123');process.exit(0);
}; seed().catch(e=>{console.error(e);process.exit(1)});
