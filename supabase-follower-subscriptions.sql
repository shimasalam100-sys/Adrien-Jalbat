create table if not exists public.follower_subscriptions (
  email_hash text primary key,
  created_at timestamptz not null default now()
);

alter table public.follower_subscriptions enable row level security;

create or replace function public.check_follower_subscription(p_email_hash text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.follower_subscriptions
    where email_hash = p_email_hash
  );
$$;

create or replace function public.register_follower_subscription(p_email_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  was_inserted boolean;
  current_count integer;
begin
  insert into public.follower_subscriptions (email_hash)
  values (p_email_hash)
  on conflict (email_hash) do nothing;

  was_inserted := found;

  if was_inserted then
    update public.followers
    set count = count + 1
    where id = 1
    returning count into current_count;
  else
    select count into current_count
    from public.followers
    where id = 1;
  end if;

  return jsonb_build_object(
    'already_following', not was_inserted,
    'count', coalesce(current_count, 1003)
  );
end;
$$;

grant execute on function public.check_follower_subscription(text) to anon, authenticated;
grant execute on function public.register_follower_subscription(text) to anon, authenticated;

create or replace function public.remove_follower_subscription(p_email_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  was_deleted boolean;
  current_count integer;
begin
  delete from public.follower_subscriptions
  where email_hash = p_email_hash;

  was_deleted := found;

  if was_deleted then
    update public.followers
    set count = greatest(count - 1, 0)
    where id = 1
    returning count into current_count;
  else
    select count into current_count
    from public.followers
    where id = 1;
  end if;

  return jsonb_build_object(
    'was_following', was_deleted,
    'count', coalesce(current_count, 1003)
  );
end;
$$;

grant execute on function public.remove_follower_subscription(text) to anon, authenticated;
