#!/bin/sh
echo "⏳ Waiting for MySQL to be ready..."

until nc -z mysql 3306; do
  sleep 2
done

echo "✅ MySQL is accepting connections"
exec "$@"
