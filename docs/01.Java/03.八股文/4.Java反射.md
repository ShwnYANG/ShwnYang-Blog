---
title: Java反射
date: 2025-02-21 10:14:58
permalink: /pages/d9767f/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# Java反射

## 1. 什么是代理？

代理模式（Proxy Pattern）是一种结构型设计模式，代理对象充当真实对象的替身，控制对其的访问或添加额外的行为。在 Java 中，代理常用于日志记录、性能监控、安全检查等场景。代理可以分为静态代理和动态代理两种，主要区别在于创建方式和灵活性。

![image-20250221103119717](https://cos.ywenrou.cn/blog/images/image-20250221103119717.png)

## 2. 代理的工作机制

代理的工作流程如下：

1. 调用者调用代理对象的方法。
2. 代理对象在方法执行前或后添加额外的逻辑（如日志、权限检查）。
3. 代理将请求转发给目标对象，目标对象执行实际业务逻辑。
4. 返回结果可能经过代理的再次处理后返回给调用者。

这种机制的核心是**接口一致性**：代理对象必须实现与目标对象相同的接口，确保调用者无感知地使用代理。



## 3. 静态代理
静态代理是你手动编写的一个类，实现与真实对象相同的接口，然后在方法中调用真实对象的方法，并可能添加额外逻辑。例如：
- 你有一个 `User` 接口，`RealUser` 实现它，`UserProxy` 是静态代理，调用 `RealUser` 的方法前打印日志。
- 优点：运行快，因为是编译时生成的类。
- 缺点：不够灵活，每个接口都需要写一个代理类。

静态代理是指手动编写一个代理类，实现与真实对象相同的接口，并在方法中调用真实对象的方法，同时可能添加额外的逻辑。

**实现示例**

考虑以下代码示例，展示一个简单的静态代理：

```java
public interface User {
    void doSomething();
}

public class RealUser implements User {
    @Override
    public void doSomething() {
        System.out.println("Doing something");
    }
}

public class UserProxy implements User {
    private User realUser;

    public UserProxy(User realUser) {
        this.realUser = realUser;
    }

    @Override
    public void doSomething() {
        System.out.println("Before doing something");
        realUser.doSomething();
        System.out.println("After doing something");
    }
}
```

在这个例子中，`UserProxy` 是 `RealUser` 的静态代理，实现了 `User` 接口，在调用 `doSomething` 方法前和后添加了打印日志。

## 4.动态代理

动态代理是在运行时通过 Java 的反射 API 创建的代理，不需要手动编写代理类。它利用 `java.lang.reflect.Proxy` 类生成实现指定接口的代理实例，所有方法调用都会路由到一个调用处理器（Invocation Handler）。

### 实现示例
以下是一个动态代理的示例，展示如何为 `User` 接口创建代理并添加日志功能：

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;

public class LoggingProxyHandler implements InvocationHandler {
    private Object realObject;

    public LoggingProxyHandler(Object realObject) {
        this.realObject = realObject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Calling method: " + method.getName());
        try {
            return method.invoke(realObject, args);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Error invoking method", e);
        }
    }
}

public class DynamicProxyExample {
    public static void main(String[] args) {
        User realUser = new RealUser();
        User proxy = (User) Proxy.newProxyInstance(
            realUser.getClass().getClassLoader(),
            new Class[] { User.class },
            new LoggingProxyHandler(realUser)
        );

        proxy.doSomething();
    }
}
```

在这个例子中，`Proxy.newProxyInstance` 创建了一个动态代理实例，实现了 `User` 接口。所有对代理的方法调用都会通过 `LoggingProxyHandler` 的 `invoke` 方法处理，打印方法名后调用真实对象的对应方法。

### 动态代理的实现原理
动态代理的核心在于反射：
1. **代理类的创建**：`Proxy.newProxyInstance` 使用反射生成一个实现指定接口的类，类名通常以 `$Proxy` 开头，加载到 JVM 中。
2. **方法调用的处理**：调用处理器（`InvocationHandler`）的 `invoke` 方法接收所有方法调用，通过 `Method.invoke` 使用反射调用真实对象的方法。

### 优点与缺点
- **优点**：灵活性高，可以在运行时为任意接口创建代理，无需为每个接口编写类，减少代码重复，适合框架开发。
- **缺点**：由于使用反射，性能稍慢，存在一定的运行时开销，且只能代理接口，不能直接代理具体类。如果需要代理具体类，可以使用其他库如 CGLIB，通过字节码操作实现，但这超出了标准 Java 反射的范围。

### 使用场景
动态代理常用于需要通用拦截逻辑的场景，例如：
- 框架开发，如 Spring AOP 中的事务管理。
- 测试场景，创建模拟对象（Mock）来代替真实对象。
- 添加横切关注点，如日志记录、性能监控。



## 5. 反射的定义与用途

在Java编程中，反射（Reflection）是一种强大的机制，可以通过编程的方式访问类的信息例如成员变量、成员方向和构造方法的信息，并进行一些操作。这包括创建对象、调用方法，甚至访问私有成员。反射广泛应用于框架开发（如Spring AOP）、动态代理等场景。它通过`java.lang.reflect`包提供的一系列类（如`Class`、`Method`、`Field`、`Constructor`）实现。反射的核心在于`Class`对象，它代表运行时的类信息。

![image-20250221111728493](https://cos.ywenrou.cn/blog/images/image-20250221111728493.png)

## 6. 获取Class对象的三种方式
获取`Class`对象是反射的起点，有三种常见方法：

| 方法                      | 描述                                               | 使用场景                         |
| ------------------------- | -------------------------------------------------- | -------------------------------- |
| `Class.forName("全类名")` | 通过类名字符串加载类，抛出`ClassNotFoundException` | 运行时从配置文件或用户输入获取类 |
| `类名.class`              | 直接使用类的`.class`属性                           | 编译时已知类，代码简洁           |
| `对象.getClass()`         | 从实例对象获取其类信息                             | 有对象实例时，查看其类型         |

## 7. 使用反射操作构造方法
通过`Class`对象的`getConstructors()`或`getDeclaredConstructors()`方法，可以获取类的构造方法。`getConstructors()`返回所有公共构造方法，`getDeclaredConstructors()`返回所有构造方法（包括私有）。

**以下是使用反射创建对象的步骤：**

1. 获取`Class`对象。
2. 获取`Constructor`对象，例如`getDeclaredConstructor()`。
3. 如果构造方法是私有的，调用`setAccessible(true)`以绕过访问检查。
4. 使用`newInstance()`创建对象。

代码示例：
```java
Class<?> cls = Class.forName("com.example.MyClass");
Constructor<?> constructor = cls.getDeclaredConstructor(String.class);
constructor.setAccessible(true); // 允许访问私有构造方法
Object instance = constructor.newInstance("example");
```

这允许创建私有构造方法的对象，打破了封装，适合测试场景。

## 8. 使用反射操作成员变量
成员变量（字段）通过`getFields()`或`getDeclaredFields()`获取。`getFields()`返回所有公共字段（包括继承的），`getDeclaredFields()`返回类中声明的所有字段（包括私有）。

要获取字段的值，必须提供实例对象，并使用`Field.get()`方法。如果字段是私有的，需先调用`setAccessible(true)`。

示例：
```java
Class<?> cls = Class.forName("com.example.MyClass");
Field field = cls.getDeclaredField("myField");
field.setAccessible(true);
Object instance = cls.getDeclaredConstructor().newInstance();
Object value = field.get(instance);
```

这展示了反射如何动态访问字段值，需注意性能开销和安全问题。

## 9. 使用反射操作成员方法
成员方法通过`getMethods()`或`getDeclaredMethods()`获取。`getMethods()`返回所有公共方法（包括继承的），`getDeclaredMethods()`返回类中声明的所有方法（包括私有）。

**具体方法如下：**

- `getMethods()`：返回`Method[]`，包含所有公共方法。
- `getDeclaredMethods()`：返回`Method[]`，包含所有声明方法，不包括继承的。
- `getMethod(String name, Class<?>... parameterTypes)`：返回单个公共方法。
- `getDeclaredMethod(String name, Class<?>... parameterTypes)`：返回单个声明方法。

使用`Method.invoke(Object obj, Object... args)`运行方法，参数包括调用对象和方法参数。

示例：
```java
Class<?> cls = Class.forName("com.example.MyClass");
Method method = cls.getDeclaredMethod("myMethod", int.class);
method.setAccessible(true); // 如果是私有方法
Object instance = cls.getDeclaredConstructor().newInstance();
Object result = method.invoke(instance, 42);
```

这允许动态调用方法，适合框架如Spring的AOP实现。

## 10. 总结
反射提供了强大的动态能力，但也带来性能开销（由于使用反射调用比直接调用慢）和安全风险（可访问私有成员）。因此，在高性能场景或安全敏感场景下需谨慎使用。

