-- Run this once in Supabase SQL Editor.
-- It removes old player_rounds policies left by previous migrations and
-- recreates the intended host-write / player-read access rules.

alter table public.player_rounds enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'player_rounds'
  loop
    execute format(
      'drop policy if exists %I on public.player_rounds',
      policy_record.policyname
    );
  end loop;
end
$$;

create policy "player_rounds_select" on public.player_rounds
  for select
  using (player_id = (select auth.uid())::text);

create policy "player_rounds_insert" on public.player_rounds
  for insert
  with check (
    exists (
      select 1
      from public.game_state as game
      where game.id = player_rounds.lobby_code
        and game.host_id = (select auth.uid())::text
    )
  );

create policy "player_rounds_update" on public.player_rounds
  for update
  using (
    player_id = (select auth.uid())::text
    or exists (
      select 1
      from public.game_state as game
      where game.id = player_rounds.lobby_code
        and game.host_id = (select auth.uid())::text
    )
  )
  with check (
    player_id = (select auth.uid())::text
    or exists (
      select 1
      from public.game_state as game
      where game.id = player_rounds.lobby_code
        and game.host_id = (select auth.uid())::text
    )
  );

create policy "player_rounds_delete" on public.player_rounds
  for delete
  using (
    exists (
      select 1
      from public.game_state as game
      where game.id = player_rounds.lobby_code
        and game.host_id = (select auth.uid())::text
    )
  );

create or replace function public.publish_player_rounds(round_rows jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  round_row jsonb;
  lobby_code_value text;
begin
  if jsonb_typeof(round_rows) <> 'array' then
    raise exception 'round_rows must be a JSON array';
  end if;

  for round_row in select value from jsonb_array_elements(round_rows)
  loop
    lobby_code_value := round_row ->> 'lobby_code';

    if not exists (
      select 1
      from public.game_state as game
      where game.id = lobby_code_value
        and game.host_id = (select auth.uid())::text
    ) then
      raise exception 'Only the lobby host may publish player rounds';
    end if;

    insert into public.player_rounds (lobby_code, player_id, round_id, payload)
    values (
      round_row ->> 'lobby_code',
      round_row ->> 'player_id',
      round_row ->> 'round_id',
      round_row -> 'payload'
    )
    on conflict (lobby_code, player_id, round_id)
    do update set payload = excluded.payload;
  end loop;
end;
$$;

revoke all on function public.publish_player_rounds(jsonb) from public;
grant execute on function public.publish_player_rounds(jsonb) to authenticated;

-- This should return exactly four policies.
select policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'player_rounds'
order by policyname;
