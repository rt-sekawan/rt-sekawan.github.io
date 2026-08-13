// api.js
const API_URL = 'https://script.google.com/macros/s/AKfycbwM0luMiUqY_AYirH4L7ZH1OmO60jVm4lFR1VTKJbmtj9oCou83mvmS1S9EV71YXRQ/exec';

async function callApi(action, params = {}, method = 'GET') {
  const token = localStorage.getItem('token');
  const url = new URL(API_URL);
  url.searchParams.append('action', action);
  if (token) url.searchParams.append('token', token);
  
  if (method === 'GET') {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const res = await fetch(url);
    return res.json();
  } else {
    // POST: kirim parameter di body JSON, token di query
    const body = { ...params, token };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  }
}