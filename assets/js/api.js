// api.js - Versi final
const API_URL = 'https://script.google.com/macros/s/AKfycbxJ5tgR8768gMFJ5X_OHMC-pNaFDPLvNy-_AKTu_bSMldCAWJJbtd6tVXDOyC04rqQ/exec';

async function callApi(action, params = {}, method = 'GET') {
  const token = localStorage.getItem('token');
  const url = new URL(API_URL);
  url.searchParams.append('action', action);
  
  if (token) url.searchParams.append('token', token);
  
  if (method === 'GET') {
    Object.keys(params).forEach(key => {
      if (typeof params[key] === 'object') {
        url.searchParams.append(key, JSON.stringify(params[key]));
      } else {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const res = await fetch(url);
    return res.json();
  } else {
    // POST with JSON body
    const body = { ...params, token };
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    return res.json();
  }
}
