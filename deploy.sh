#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e


# push_addr=git@github.com:OkayYang/OkayYang.github.io.git # git提交地址，也可以手动设置，比如：push_addr=git@github.com:xugaoyi/vuepress-theme-vdoing.git
# commit_info=`git describe --all --always --long`
# dist_path=docs/.vuepress/dist # 打包生成的文件夹路径
# push_branch=main # 推送的分支

# # 生成静态文件
# npm run build:win

# # 进入生成的文件夹
# cd $dist_path

# git init
# git add -A
# git commit -m "deploy, $commit_info"
# git push -f $push_addr HEAD:$push_branch

# cd -
# rm -rf $dist_path


# deploy to github
if [ -z "$GITHUB_TOKEN" ]; then
  npm run build:win # 生成静态文件
  msg='deploy'
  githubUrl=git@github.com:OkayYang/OkayYang.github.io.git
else
  npm run build # 生成静态文件    
  msg='来自github action的自动部署'
  githubUrl=https://OkayYang:${GITHUB_TOKEN}@github.com/OkayYang/OkayYang.github.io.git
  git config --global user.name "xiaoyang"
  git config --global user.email "xuxiaoyang168@gmail.com"
fi
cd docs/.vuepress/dist # 进入生成的文件夹
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl HEAD:main # 推送到github

cd -
rm -rf docs/.vuepress/dist
