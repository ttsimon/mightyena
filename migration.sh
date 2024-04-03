if [ $1 == "run" ];then
  npx mwtypeorm migration:run -d application/config/config.default.ts
fi

if [ $1 == "generate" ];then
  npx mwtypeorm migration:generate -d application/config/config.default.ts $2
fi
