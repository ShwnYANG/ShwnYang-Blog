---
title: SpringBoot介绍
date: 2025-02-18 19:24:15
permalink: /pages/a2bf78/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# SpringBoot介绍

## **Spring Boot 是什么？**

**Spring Boot 是 Spring 框架的一个子项目**，它主要用于**简化 Spring 应用的开发**，**提供了一整套开箱即用的功能**，比如：

- **内嵌 Web 服务器**（如 Tomcat、Jetty、Undertow）
- **自动配置**（AutoConfiguration）
- **约定优于配置**（Convention over Configuration）
- **无 XML 配置**（几乎不需要 `applicationContext.xml`）
- **Starter 依赖管理**（简化 `pom.xml`）

> **一句话总结**：Spring Boot 让 Spring 开发更简单、更快速，避免大量的 XML 配置，开箱即用！

------

## **Spring 和 Spring Boot 的区别**

| 特性           | Spring                     | Spring Boot            |
| -------------- | -------------------------- | ---------------------- |
| **需要的配置** | 需要手动配置（XML/Java）   | 约定优于配置，自动装配 |
| **Web 服务器** | 需要手动配置 Tomcat、Jetty | 内嵌 Tomcat，开箱即用  |
| **依赖管理**   | 依赖版本需要手动维护       | Starter 依赖自动管理   |
| **开发效率**   | 配置复杂，开发慢           | 简单易用，开发快       |
| **微服务支持** | 需要自己搭建               | 天然支持微服务         |

------

## **Spring Boot 的核心特性**

### **1️⃣ 自动配置（AutoConfiguration）**

Spring Boot **通过 `@EnableAutoConfiguration` 让 Spring 自动配置**，省去繁琐的 XML 或 Java 配置。

**示例：**

```java
@SpringBootApplication  // 这个注解包含了 @EnableAutoConfiguration
public class MySpringBootApplication {
    public static void main(String[] args) {
        SpringApplication.run(MySpringBootApplication.class, args);
    }
}
```

🔹 **Spring Boot 会自动扫描类路径下的 `spring.factories` 文件，加载相应的自动配置类**。

------

### **2️⃣ 内嵌 Web 服务器**

Spring Boot **内置了 Tomcat、Jetty 等 Web 服务器**，不需要单独部署。

**示例：**

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```

📌 直接运行 `main` 方法，访问 `http://localhost:8080/hello`，无需额外配置 Tomcat。

------

### **3️⃣ Starter 依赖管理**

Spring Boot 提供了 **Starter 依赖**，让你不用手动管理各种版本的依赖。

**示例：`pom.xml`**

```xml
<dependencies>
    <!-- 直接引入 spring-boot-starter-web，包含了 Spring MVC、Tomcat 等所有依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

📌 只需要加一个 `spring-boot-starter-web`，Spring Boot **自动帮你配置 Spring MVC 和 Tomcat**！

------

### **4️⃣ 统一配置文件（application.yml / application.properties）**

Spring Boot 统一使用 `application.yml` 或 `application.properties` 进行配置，避免 XML。

**示例：`application.yml`**

```yaml
server:
  port: 8081
spring:
  application:
    name: my-spring-boot-app
```

📌 这样 Spring Boot 就会**自动将端口改为 `8081`，并且应用名称变为 `my-spring-boot-app`**。

------

## **Spring Boot 启动流程**

当调用 `SpringApplication.run(...)` 时，Spring Boot **会执行一系列自动配置**：

1. **创建 `SpringApplication` 对象**
2. **自动推断应用类型**（Servlet / Reactive / None）
3. **加载 `ApplicationContext`**
4. **执行 `@SpringBootApplication` 扫描并加载 Bean**
5. **加载 `spring.factories` 进行自动配置**
6. **启动 Web 服务器（Tomcat/Jetty）**
7. **初始化 `CommandLineRunner` / `ApplicationRunner`**

------

## **Spring Boot 适合用在哪些场景？**

1. Web 应用
   - 快速开发 RESTful API
   - 传统 Web MVC 应用
2. 微服务架构
   - 天然支持 Spring Cloud
   - 简单搭建分布式服务
3. 任务调度 / 定时任务
   - 支持 `@Scheduled`
4. 数据处理
   - 与 Spring Data JPA、MyBatis 无缝集成
5. 企业级应用
   - 快速搭建企业管理系统、后台管理系统

------

## **总结**

- **Spring Boot = Spring + 简单易用**
- **自动配置**，减少 XML 和 Java 配置代码
- **内置 Web 服务器**，直接运行，不需要部署
- **Starter 依赖**，简化依赖管理
- **微服务天然支持**，和 Spring Cloud 结合强大
- **统一配置**，使用 `application.yml` 进行全局管理

> **一句话总结**：Spring Boot 让 Spring 开发更简单、更高效！ 🚀