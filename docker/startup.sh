echo "Starting application..."
echo "BACKEND_URL = ${BACKEND_URL}"
envsubst < "/usr/share/nginx/html/assets/runtime.txt" > "/usr/share/nginx/html/assets/env.txt"
nginx -g 'daemon off;'
