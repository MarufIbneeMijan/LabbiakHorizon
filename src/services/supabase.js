import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- PRODUCTS API ---
export const productsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (productData) => {
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id, updatedFields) => {
    const { data, error } = await supabase.from('products').update(updatedFields).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
};

// --- ORDERS API ---
export const ordersAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (orderPayload) => {
    const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
    if (error) throw error;
    return data[0];
  },
  updateStatus: async (id, newStatus) => {
    const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  }
};