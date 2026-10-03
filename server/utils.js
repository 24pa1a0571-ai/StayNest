function parseJson(value, fallback = []) {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value) || typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function propertyRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    owner: row.owner_id ? { _id: row.owner_id, id: row.owner_id, name: row.owner_name, email: row.owner_email, phone: row.owner_phone, profileImage: row.owner_profile_image } : row.owner_id,
    ownerId: row.owner_id,
    city: row.city,
    locality: row.locality,
    address: row.address,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    monthlyRent: Number(row.monthly_rent),
    deposit: Number(row.deposit),
    rating: Number(row.rating),
    safetyScore: Number(row.safety_score),
    verificationStatus: row.verification_status,
    verificationDate: row.verification_date,
    amenities: parseJson(row.amenities),
    roomTypes: parseJson(row.room_types),
    genderPreference: row.gender_preference,
    foodAvailable: !!row.food_available,
    availableRooms: row.available_rooms,
    totalRooms: row.total_rooms,
    images: parseJson(row.images),
    distance: row.distance,
    isActive: !!row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function userRow(row){
  if(!row) return null;
  return { id: row.id, _id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, profileImage: row.profile_image || '', preferredCity: row.preferred_city, preferredLocality: row.preferred_locality, budget: Number(row.budget || 0), createdAt: row.created_at };
}
function safeUser(row){ return userRow(row); }
function notifyMessage(type){ return type === 'booking' ? 'Booking update received.' : type === 'visit' ? 'Visit request update received.' : 'You have a new StayNest notification.'; }
module.exports = { parseJson, propertyRow, userRow, safeUser, notifyMessage };
