---
title: Mybatis介绍
date: 2025-02-19 10:15:10
permalink: /pages/686465/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# Mybatis介绍

## 1. 什么是ORM框架？

ORM（Object-Relational Mapping，对象关系映射）框架是一种用于在面向对象编程语言（如 Java、Python）中，将数据库中的表结构映射为程序中的对象，从而让开发者能够使用面向对象的方式操作数据库，无需手写复杂的 SQL，减少重复代码，其中Java中常见的ORM框架有Hibernate、MyBatis（半自动）。

**ORM 框架的核心作用**

1. **数据库表与对象映射**：将关系型数据库的表（Table）映射为类（Class），将表中的行（Row）映射为对象（Object）。
2. **自动生成 SQL 语句**：开发者可以通过对象操作数据库，而无需手写 SQL 查询语句，ORM 框架会自动生成对应的 SQL 进行执行。
3. **简化数据库操作**：提供更高层次的 API，隐藏 SQL 细节，使数据操作更加直观，提高开发效率。
4. **数据库无关性**：某些 ORM 框架支持多种数据库，可以通过简单配置切换数据库，而无需修改代码。

## 2 为什么要用 MyBatis？—— 从 JDBC 到 MyBatis 的演进

在 Java 进行数据库操作时，最基础的方法是使用 **JDBC（Java Database Connectivity）**，但是传统 JDBC 存在很多问题，因此出现了 **ORM（对象关系映射）框架**，其中 **MyBatis 是最常用的轻量级 ORM 框架之一**。

### 2.1.传统 JDBC 的弊端

在早期 Java 代码中，我们使用 **JDBC 直接操作数据库**，其核心流程如下：

1. **手动加载数据库驱动**
2. **建立数据库连接**
3. **拼接 SQL 语句**
4. **设置 SQL 语句的参数**
5. **执行查询**
6. **处理结果集**
7. **关闭连接，释放资源**

**示例代码：**

```java
public static void main(String[] args) {
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;
    try {
        // 1. 手动加载驱动（JDBC 4.0 之后可以省略）
        Class.forName("com.mysql.cj.jdbc.Driver");
        
        // 2. 获取数据库连接
        conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "password");

        // 3. 拼接 SQL 语句（硬编码）
        String sql = "SELECT * FROM users WHERE id = ?";
        pstmt = conn.prepareStatement(sql);

        // 4. 设置 SQL 语句参数（手动赋值）
        pstmt.setInt(1, 1);

        // 5. 执行查询
        rs = pstmt.executeQuery();

        // 6. 处理结果集
        while (rs.next()) {
            System.out.println("User ID: " + rs.getInt("id"));
            System.out.println("User Name: " + rs.getString("name"));
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 7. 关闭资源，避免数据库连接泄露
        try {
            if (rs != null) rs.close();
            if (pstmt != null) pstmt.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

| **问题**                                    | **描述**                                                     |
| ------------------------------------------- | ------------------------------------------------------------ |
| **1. 需要手动加载驱动**                     | 需要 `Class.forName("com.mysql.cj.jdbc.Driver")` 手动加载驱动，JDBC 4.0 之后可省略，但仍然需要正确配置。 |
| **2. SQL 语句硬编码，难以维护**             | SQL 语句是 **硬编码** 在 Java 代码中的，如果表结构发生变化，需要修改 Java 代码，**SQL 可读性差**，且维护困难。 |
| **3. 手动拼接 SQL，容易出错**               | 需要 **手动拼接 SQL 语句**，如 `SELECT * FROM users WHERE name = '" + name + "'`，容易导致 **SQL 注入漏洞**。 |
| **4. 需要手动设置字段**                     | 需要 `pstmt.setInt(1, id);` 手动赋值字段，**冗余代码多，容易出错**。 |
| **5. 没有数据库连接池，性能低下**           | `DriverManager.getConnection()` 每次都会创建一个新的数据库连接，**开销大**，影响系统性能。 |
| **6. 需要手动关闭数据库连接，否则可能泄露** | `conn.close()` 需要手动关闭，如果开发人员忘记关闭，会导致 **数据库连接泄漏**，影响系统稳定性。 |

### 2.2 MyBatis 的优势

MyBatis 是一个轻量级的 **ORM（对象关系映射）** 框架，它的作用是 **简化 JDBC 代码，自动管理 SQL 语句和数据库连接**，提高开发效率。

| **JDBC 传统方式**            | **MyBatis 解决方案**                                         |
| ---------------------------- | ------------------------------------------------------------ |
| 需要手动加载数据库驱动       | **MyBatis 自动管理** 数据库驱动，减少繁琐的 `Class.forName()` 操作。 |
| SQL 语句硬编码在 Java 代码中 | **SQL 和 Java 代码分离**，SQL 写在 XML 或 `@Mapper` 注解里，维护更方便。 |
| 需要手动拼接 SQL，容易出错   | MyBatis **支持动态 SQL**，可以自动拼接 SQL，避免拼接错误。   |
| 需要手动设置参数             | MyBatis **自动映射 Java 对象**，无需 `pstmt.setInt()` 手动赋值。 |
| 没有数据库连接池，性能低     | MyBatis **内置连接池（HikariCP/Druid）**，减少数据库连接的创建开销，提高性能。 |
| 需要手动关闭数据库连接       | **MyBatis 自动管理数据库连接**，避免资源泄漏。               |

## 3.MyBatis原理与执行流程

MyBatis是一个优秀的持久层框架，它的工作流程主要分为两大步骤：配置文件解析和数据库操作

好，让我们来看一下MyBatis的工作原理：

1.  **配置文件**：MyBatis需要一个XML配置文件，叫做`mybatis-config.xml`，用于定义数据源、事务管理以及其他一些设置。 
2.  **SQL映射文件**：为了告诉MyBatis如何映射SQL查询到我们的对象或Java Beans，我们需要定义另一些XML文件。这些文件里，我们会写SQL语句，并定义输入和输出。 
3.  **SqlSessionFactory**：当MyBatis初始化时，它会根据上面提到的配置文件创建一个SqlSessionFactory。这个工厂只会被创建一次，然后被用来生产SqlSession，这些SqlSession是应用中真正做数据库操作的对象。 
4.  **SqlSession**：这是MyBatis的一个关键组件。每当我们想和数据库进行交互时，我们就从SqlSessionFactory那里拿到一个SqlSession。这个会话包含了所有执行SQL的方法，比如`insert`, `update`, `delete`, `select`等。 
5.  **映射器**：为了使代码更整洁，我们经常使用接口来代表SQL映射。这些接口的方法对应了之前在XML映射文件中定义的SQL语句。这样，我们就可以像调用普通的Java方法那样执行SQL语句了。 

那么，当你在应用中调用一个映射器方法时，这里发生了什么？

1. MyBatis会找到对应的SQL语句。
2. 使用给定的参数，MyBatis会为这条SQL语句创建一个PreparedStatement。
3. 执行这个PreparedStatement。
4. 如果这是一个查询操作，MyBatis会将查询结果映射到Java对象或集合中。
5. 最后，返回这个结果。

这就是MyBatis的基本工作原理。使用MyBatis，我们可以更方便地与数据库交互，同时避免大部分重复和模板化的代码。

mapper接口的包路径必须和XML的路径必须一致吗？

当使用包扫描方式时，MyBatis默认会在同包路径下查找对应的XML文件，这使得开发更加便捷。

**`mybatis-config.xml` MyBatis 的 核心配置文件，用于定义数据源、事务管理、日志等。**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- 开启日志 -->
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!-- 配置环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/> 
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 注册别名（简化 resultType 的写法） -->
    <typeAliases>
        <package name="com.example.model"/>
    </typeAliases>

    <!-- 指定 Mapper 映射文件 -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

🔹 **说明**：

- `logImpl="STDOUT_LOGGING"`：开启 **SQL 语句日志**（可选）。
- `mapUnderscoreToCamelCase="true"`：**自动下划线转驼峰**，如 `user_name` → `userName`。
- `transactionManager type="JDBC"`：使用 **JDBC 事务管理**（Spring 管理事务时可省略）。
- `<mappers>`：指定 **SQL 映射文件**。

## 4. MyBatis 中 Mapper 接口的包路径必须和 XML 文件的路径一致吗？

**答案**：**不需要一致**，但 `XML` 文件中的 `namespace` 必须和 `Mapper 接口的全限定类名` 一致，才能让 MyBatis 正确绑定它们。

在使用 MyBatis 时，很多人会疑惑：

> **"Mapper 接口的包路径和 XML 文件的路径需要完全一致吗？"**

实际上，**XML 文件的存放位置可以和接口的包路径不一致**，只要 `namespace` 绑定正确，MyBatis 仍然能找到对应的 SQL 语句。

**错误示例：路径一致但 `namespace` 不匹配**

```plaintext
com/example/mapper/UserMapper.java
com/example/mapper/UserMapper.xml  ❌ (路径一致，但 namespace 不对)
<mapper namespace="wrong.namespace.UserMapper">  <!-- ❌ 错误，必须匹配接口的全限定类名 -->
</mapper>
```

即使 XML 和接口的路径相同，但如果 `namespace` 不匹配，MyBatis 仍然无法识别。

**正确示例：路径不一致但 `namespace` 绑定正确**

```plaintext
com/example/mapper/UserMapper.java
resources/mappers/UserMapper.xml  ✅ (路径不同，但 namespace 绑定正确)
<mapper namespace="com.example.mapper.UserMapper">  <!-- ✅ 必须匹配 Java 接口 -->
</mapper>
```

这样 MyBatis 仍然可以正确找到 `UserMapper` 里的 SQL 语句。

### 4.1 MyBatis 绑定 Mapper 的完整流程

当你调用 `userMapper.getUserById(1)` 时，MyBatis 的工作流程如下：

1. **查找 Mapper 接口**：MyBatis 通过 `@MapperScan` 或 `mybatis-config.xml` 注册 `UserMapper`。
2. **查找 XML**：MyBatis 读取 `UserMapper.xml`，通过 `namespace="com.example.mapper.UserMapper"` 确定 SQL 语句。
3. **动态代理**：MyBatis 生成 `UserMapper` 的代理对象，调用 `getUserById()` 方法时，代理对象会执行 XML 里的 SQL。
4. **返回结果**：MyBatis 将查询结果映射到 `User` 实体，并返回给调用者。

## 5. MyBatis缓存机制

MyBatis提供了两级缓存机制：

### 一级缓存（Local Cache）

一级缓存是 MyBatis 中默认开启的缓存，它作用于一次 SQLSession 的生命周期内。也就是说，当你在一个 SQLSession 中执行了一个查询，这个查询的结果将会被缓存在这个 SQLSession 的本地缓存中。如果你在这个 SQLSession 的后续操作中再次执行相同的查询，MyBatis 将会直接从缓存中获取数据，而不会重新查询数据库。

特点：

- **作用范围**：SQLSession 级别。
- **生命周期**：与 SQLSession 同步，当 SQLSession 关闭或提交后，一级缓存会被清空。
- **自动管理**：不需要显式配置，MyBatis 自动处理。
- **事务一致性**：保证了同一事务内的数据一致性。

### 二级缓存（Second Level Cache）

二级缓存是在 Mapper（命名空间）级别的缓存，作用于多个 SQLSession 实例之间。这意味着在同一个 Mapper 命名空间下的多个 SQLSession 可以共享缓存数据，提高了跨 SQLSession 的数据访问性能。

特点：

- **作用范围**：Mapper（命名空间）级别。
- **生命周期**：全局有效，除非手动清除或应用程序重启。
- **需显式配置**：在 Mapper XML 文件中通过 `<cache>` 元素配置。
- **序列化要求**：缓存的对象需要实现 `Serializable` 接口。
- **数据一致性**：更新数据时，MyBatis 会自动清除相关缓存，但需要确保数据源的一致性。

**使用二级缓存的注意事项：**

- 二级缓存需要在 `<mapper>` 文件中显式配置，且只有 `<select>` 语句的结果才会被缓存。
- 为了防止数据不一致，对于更新操作，MyBatis 默认会清除相关的二级缓存。
- 如果你的应用是集群部署，需要考虑使用分布式缓存解决方案，因为 MyBatis 的二级缓存是基于进程内的。

**缓存的刷新与失效**

- 一级缓存会在每次 SQLSession 提交或回滚后自动清空。
- 二级缓存会因数据的更新操作（如插入、更新或删除）而被刷新。

正确使用缓存可以显著提升应用的性能，但同时需要注意避免因缓存导致的数据延迟或不一致问题。在设计时，应当根据具体的应用场景和数据一致性要求来合理选择和配置缓存策略。

## 6.MyBatis代码示例

### 4.1 读取配置文件

```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

这一步实际上执行了以下操作：
1. 创建`XMLConfigBuilder`对象解析配置文件
2. 解析settings、typeAliases、plugins、environments、mappers等节点
3. 将解析结果存入`Configuration`对象
4. 使用`Configuration`对象创建`DefaultSqlSessionFactory`

### 4.2 创建SqlSession并执行SQL

```java
SqlSession session = sqlSessionFactory.openSession();
try {
  UserMapper mapper = session.getMapper(UserMapper.class);
  User user = mapper.getUserById(1);
  session.commit();
} finally {
  session.close();
}
```

### 4.3 Spring集成MyBatis简介

Spring集成MyBatis后，主要变化：
- 不需要手动创建SqlSessionFactory，由Spring管理
- 使用`SqlSessionFactoryBean`配置MyBatis
- 使用`MapperScannerConfigurer`或`@MapperScan`注解扫描Mapper接口
- 事务由Spring管理，不需要手动commit

SpringBoot进一步简化配置：
- 通过`mybatis-spring-boot-starter`自动配置
- 只需添加依赖和少量配置即可使用

## 5. Spring 环境下 MyBatis 一级缓存为什么失效？

在 **原生 MyBatis** 中，一级缓存的作用范围是 **单个 `SqlSession`**，只要 `SqlSession` 还未关闭，后续相同的查询可以直接从缓存中获取数据，避免重复查询数据库。

但在 **Spring 中**，`SqlSession` 由 `SqlSessionTemplate` 管理：

- `SqlSessionTemplate` **每次执行 SQL 时都会创建新的 `SqlSession`**，不会复用 `SqlSession`，导致 **一级缓存失效**。
- `SqlSessionTemplate` 主要用于 **确保 `SqlSession` 是线程安全的**，但同时也牺牲了一级缓存的作用。

**代码示例**

假设 `UserMapper.xml` 中有如下 SQL：

```xml
<select id="getUserById" parameterType="int" resultType="User">
    SELECT * FROM user WHERE id = #{id}
</select>
```

然后执行以下代码：

```java
User user1 = userMapper.getUserById(1);
User user2 = userMapper.getUserById(1);
System.out.println(user1 == user2);
```

在 **原生 MyBatis** 中，`user1 == user2` 会返回 **true**，因为 **查询结果来自一级缓存**，而 在 Spring 中，返回 false，说明每次查询都重新从数据库获取数据。

### 5.1. 如何让一级缓存生效？

如果你希望一级缓存仍然有效，你需要 **手动管理 `SqlSession`**，而不是让 `SqlSessionTemplate` 自动创建。

#### 方法 1：使用 `@Transactional` 让 Spring 复用 `SqlSession`

在 **同一个事务范围内**，Spring 会复用 `SqlSession`，从而使一级缓存生效：

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    @Transactional  // 让Spring管理事务，确保使用同一个SqlSession
    public void testCache() {
        User user1 = userMapper.getUserById(1);
        User user2 = userMapper.getUserById(1);
        System.out.println(user1 == user2); // true，命中一级缓存
    }
}
```

✅ **加上 `@Transactional` 后，Spring 复用 `SqlSession`，使一级缓存生效。**

#### 方法 2：手动创建 `SqlSession`

你可以手动创建 `SqlSession`，避免 `SqlSessionTemplate` 每次创建新会话：

```java
@Autowired
private SqlSessionFactory sqlSessionFactory;

public void testManualSqlSession() {
    try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user1 = mapper.getUserById(1);
        User user2 = mapper.getUserById(1);
        System.out.println(user1 == user2); // true
    }
}
```

✅ **这样 `SqlSession` 由我们手动管理，在同一个 `SqlSession` 中执行查询，一级缓存生效。**

### 5.2. MyBatis 二级缓存在 Spring Boot 下是否生效？

**二级缓存在 Spring Boot 下是可以生效的**，但需要手动开启：

1. **在 `mybatis-config.xml` 里开启缓存**

   ```xml
   <configuration>
       <settings>
           <setting name="cacheEnabled" value="true"/>
       </settings>
   </configuration>
   ```

2. **在 `UserMapper.xml` 中启用缓存**

   ```xml
   <mapper namespace="com.example.mapper.UserMapper">
       <cache/>
   </mapper>
   ```

3. **让实体类实现 `Serializable`**

   ```java
   public class User implements Serializable {
       private static final long serialVersionUID = 1L;
       private Integer id;
       private String name;
   }
   ```

**测试二级缓存是否生效**

```java
User user1 = userMapper.getUserById(1);
User user2 = userMapper.getUserById(1);
System.out.println(user1 == user2); // true（命中二级缓存）
```

✅ **即使 `SqlSession` 关闭，数据仍然可以从二级缓存中获取。**

### 5.3 Spring 推荐的缓存方案

如果你的应用是 **分布式部署**，建议使用 **Spring Cache + Redis** 而不是 MyBatis 二级缓存：

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    @Cacheable(value = "userCache", key = "#id")
    public User getUserById(Integer id) {
        return userMapper.getUserById(id);
    }
}
```

这样，查询 `getUserById(1)` 时，数据会缓存到 Redis，避免重复查询数据库。

### 5.4 总结

| 缓存级别                        | Spring  默认情况                                          | 解决方案                                                     |
| ------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| **一级缓存**（SQLSession 级别） | **失效**（因 `SqlSessionTemplate` 每次新建 `SqlSession`） | 1. **使用 `@Transactional` 让 Spring 复用 `SqlSession`**2. **手动管理 `SqlSession`** |
| **二级缓存**（Mapper 级别）     | **默认关闭**                                              | 1. 在 `Mapper.xml` 中开启 `<cache/>`2. 实体类实现 `Serializable` |
| **推荐方案**                    | **Spring Cache + Redis**                                  | 使用 `@Cacheable` 将查询结果缓存到 Redis                     |

如果你的应用是 **单体架构**，可以使用 MyBatis 二级缓存；但如果是 **分布式架构**，建议使用 **Spring Cache + Redis** 进行缓存，避免数据一致性问题。

