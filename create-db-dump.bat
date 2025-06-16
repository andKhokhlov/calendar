@echo off
echo Creating database dump...
pg_dump -U postgres -d calendar > ./backend/init.sql
echo Database dump created successfully! 