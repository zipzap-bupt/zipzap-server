
export NODE_ENV=development

git pull origin HEAD
pm2 stop app -f
pm2 start app.js 