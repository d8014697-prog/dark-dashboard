// ==========================================
// KONTROL DATABASE SUPABASE (DATABASEDARK.JS)
// ==========================================
const SUPABASE_URL = "https://ludddgcesihsqhpqszhz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZGRkZ2Nlc2loc3FocHFzemh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MzE0NzcsImV4cCI6MjEwNjAwNzQ3N30.YUcrjZjAqq2VrqwbQS1Ikb4tEKHDl6QSklNmaJONe-w";

// Inisialisasi global client Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
