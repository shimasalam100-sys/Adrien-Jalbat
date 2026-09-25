drop function if exists public.check_follower_subscription(text);
drop function if exists public.register_follower_subscription(text);
drop function if exists public.unregister_follower_subscription(text);
drop function if exists public.remove_follower_subscription(text);
drop table if exists public.follower_subscriptions;

create table if not exists public.follower_accounts (
  email_hash text primary key,
  is_following boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.follower_accounts enable row level security;

create or replace function public.get_follower_account(p_email_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.follower_accounts%rowtype;
  current_count integer;
begin
  select * into account
  from public.follower_accounts
  where email_hash = p_email_hash;

  select count into current_count from public.followers where id = 1;

  return jsonb_build_object(
    'registered', account.email_hash is not null,
    'is_following', coalesce(account.is_following, false),
    'count', coalesce(current_count, 1003)
  );
end;
$$;

create or replace function public.create_follower_account(p_email_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  was_created boolean;
  account public.follower_accounts%rowtype;
  current_count integer;
begin
  insert into public.follower_accounts (email_hash)
  values (p_email_hash)
  on conflict (email_hash) do nothing;

  was_created := found;
  select * into account from public.follower_accounts where email_hash = p_email_hash;
  select count into current_count from public.followers where id = 1;

  return jsonb_build_object(
    'created', was_created,
    'is_following', account.is_following,
    'count', coalesce(current_count, 1003)
  );
end;
$$;

create or replace function public.set_follower_state(p_email_hash text, p_is_following boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.follower_accounts%rowtype;
  current_count integer;
begin
  select * into account
  from public.follower_accounts
  where email_hash = p_email_hash
  for update;

  if account.email_hash is null then
    if not p_is_following then
      select count into current_count from public.followers where id = 1;
      return jsonb_build_object('registered', false, 'is_following', false, 'count', coalesce(current_count, 1003));
    end if;

    insert into public.follower_accounts (email_hash, is_following)
    values (p_email_hash, true);

    update public.followers
    set count = count + 1
    where id = 1
    returning count into current_count;
  elsif account.is_following is distinct from p_is_following then
    update public.follower_accounts
    set is_following = p_is_following
    where email_hash = p_email_hash;

    update public.followers
    set count = greatest(count + case when p_is_following then 1 else -1 end, 0)
    where id = 1
    returning count into current_count;
  else
    select count into current_count from public.followers where id = 1;
  end if;

  return jsonb_build_object(
    'registered', true,
    'is_following', p_is_following,
    'count', coalesce(current_count, 1003)
  );
end;
$$;

grant execute on function public.get_follower_account(text) to anon, authenticated;
grant execute on function public.create_follower_account(text) to anon, authenticated;
grant execute on function public.set_follower_state(text, boolean) to anon, authenticated;
