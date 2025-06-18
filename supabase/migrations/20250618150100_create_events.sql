create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date timestamp with time zone not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert initial events
INSERT INTO events (title, date, image_url) VALUES
('Revival', '2025-05-03 22:00:00+00', NULL),
('Jem and the Beezneez', '2025-05-10 22:00:00+00', NULL),
('Tommy Carey', '2025-05-17 22:00:00+00', NULL),
('Anne Kinsella', '2025-05-24 22:00:00+00', NULL),
('Paul Ellis', '2025-05-31 22:00:00+00', NULL);

-- Create trigger to update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on events
  for each row
  execute function update_updated_at();
