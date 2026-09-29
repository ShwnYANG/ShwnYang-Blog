#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

dist_path=docs/.vitepress/dist

# deploy to github
if [ -z "$GITHUB_TOKEN" ]; then
  msg='deploy'
  githubUrl=git@github.com:OkayYang/OkayYang.github.io.git
else
  msg='来自 GitHub Actions 的自动部署'
  githubUrl=https://OkayYang:${GITHUB_TOKEN}@github.com/OkayYang/OkayYang.github.io.git
  git config --global user.name "xiaoyang"
  git config --global user.email "xuxiaoyang168@gmail.com"
fi

cd $dist_path
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl HEAD:main

cd -
rm -rf $dist_path
