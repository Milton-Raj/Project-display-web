create table public.blogs (
  id            uuid        primary key default uuid_generate_v4(),
  title         text        not null,
  slug          text        not null unique,
  header_image  text,
  content       text,
  status        text        not null default 'draft' check (status in ('published','draft','archived')),
  created_at    timestamp   with time zone default timezone('utc', now()) not null,
  updated_at    timestamp   with time zone default timezone('utc', now()) not null
);
