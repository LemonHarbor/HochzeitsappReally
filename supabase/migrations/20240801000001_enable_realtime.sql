-- Enable realtime for all tables
alter publication supabase_realtime add table guests;
alter publication supabase_realtime add table tables;
alter publication supabase_realtime add table seats;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table access_codes;
