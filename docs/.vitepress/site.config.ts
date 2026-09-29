/**
 * Fork this file to customize the site identity without editing theme components.
 */
export const siteConfig = {
  title: "Yang's Blog",
  description: '后端架构 · Android系统与应用 · 机器学习 · 隐私计算密码学',
  author: {
    name: 'xiaoyang',
    avatar: '/img/avator.jpg',
    role: 'Backend engineer · curious builder',
    motto: '尽人事，听天命',
    bio: '用代码搭建自己的认知地图。'
  },
  site: {
    eyebrow: "YANG'S NOTEBOOK",
    headline: '站点信息',
    startDate: '2024-05-01'
  },
  sections: [
    {
      id: 'java', link: '/java/', navTitle: '后端开发',
      title: '后端开发体系',
      description: '分布式微服务架构、Spring Boot/Cloud、MyBatis、Redis、MySQL、JVM 虚拟机调优及经典八股文与源码剖析。',
      icon: '/img/java.png', accent: '#3b82f6'
    },
    {
      id: 'android', link: '/android/', navTitle: 'Android开发',
      title: 'Android 核心开发',
      description: 'Android 现代应用架构实践、Jetpack 体系、Kotlin 进阶与 Framework 底层系统机制深度剖析。',
      icon: '/img/other.png', accent: '#10b981'
    },
    {
      id: 'ml', link: '/ml/', navTitle: '机器学习',
      title: '机器学习与联邦学习',
      description: '纵向联邦学习 (VFL)、个性化联邦学习、模型蒸馏 (FedMD/FedFD)、强化学习算法与分布式协同训练。',
      icon: '/img/ml.png', accent: '#ec4899'
    },
    {
      id: 'crypto', link: '/crypto/', navTitle: '密码学',
      title: '现代密码学与隐私计算',
      description: '同态加密方案（RSA乘法同态、Paillier加法同态、CKKS全同态）、现代密码学体系与 PySyft 隐私计算框架。',
      icon: '/img/crytography.png', accent: '#8b5cf6'
    },
    {
      id: 'cmd', link: '/cmd/', navTitle: '命令手册',
      title: '生产命令实战手册',
      description: 'Linux 系统管理、Docker 容器化、Kubernetes 编排、Git 协作流与 Nginx 配置高频速查手册。',
      icon: '/img/cmd.png', accent: '#f59e0b'
    }
  ],
  links: {
    github: 'https://github.com/ShwnYANG',
    email: 'ywenrou123@163.com',
    about: '/about/'
  }
} as const

export type SiteConfig = typeof siteConfig
