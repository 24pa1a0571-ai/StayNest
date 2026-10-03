import React,{createContext,useEffect,useState}from'react';import api from'../services/api';
export const AuthContext=createContext();
export const AuthProvider=({children})=>{const[token,setToken]=useState(localStorage.getItem('staynest_token'));const[user,setUser]=useState(null);const[loading,setLoading]=useState(true);
useEffect(()=>{(async()=>{if(!token){setLoading(false);return}try{const r=await api.get('/auth/me');setUser(r.data.user)}catch{localStorage.removeItem('staynest_token');setToken(null)}finally{setLoading(false)}})()},[token]);
const login=async(email,password)=>{const r=await api.post('/auth/login',{email,password});localStorage.setItem('staynest_token',r.data.token);setToken(r.data.token);setUser(r.data.user);return r.data.user};
const register=async(data)=>{const r=await api.post('/auth/register',data);localStorage.setItem('staynest_token',r.data.token);setToken(r.data.token);setUser(r.data.user);return r.data.user};
const logout=()=>{localStorage.removeItem('staynest_token');setToken(null);setUser(null)};
return <AuthContext.Provider value={{user,token,loading,login,register,logout,isAuthenticated:!!user,isOwner:user?.role==='owner',isStudent:['student','professional'].includes(user?.role)}}>{children}</AuthContext.Provider>};
