---
title: JavaIO
date: 2025-02-22 18:13:06
permalink: /pages/353387/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# Java I/O 详解

## 1. 概述
Java 的 `java.io` 包提供了用于输入和输出的类和接口，用于处理文件操作、数据流、网络通信等。Java I/O 的设计基于**流（Stream）**的概念，通过流将数据从源（Source）传输到目标（Destination）。它支持多种数据源和目标，包括文件、内存缓冲区、网络套接字等。

### 1.1 I/O 的分类
Java I/O 主要分为两类：
- **字节流（Byte Stream）**：以字节为单位操作数据，适用于处理二进制数据（如图片、音频、视频等）。主要基类是 `InputStream` 和 `OutputStream`。
- **字符流（Character Stream）**：以字符为单位操作数据，适用于处理文本数据（如文本文件）。主要基类是 `Reader` 和 `Writer`。

此外，Java I/O 还支持：
- **缓冲流**：通过缓冲减少对底层系统的直接访问，提高效率。
- **数据流**：处理基本数据类型（如 `int`、`double`）和对象。
- **文件操作**：直接操作文件和目录。

---

## 2. 核心类和接口
以下是 `java.io` 包中常用的核心类和接口：

### 2.1 字节流
- **`InputStream`**：所有字节输入流的抽象基类，提供从数据源读取字节的方法。
  - 常用子类：
    - `FileInputStream`：从文件中读取字节。
    - `ByteArrayInputStream`：从字节数组中读取数据。
    - `BufferedInputStream`：缓冲输入流，减少对底层文件系统的直接调用。
- **`OutputStream`**：所有字节输出流的抽象基类，提供向目标写入字节的方法。
  - 常用子类：
    - `FileOutputStream`：向文件写入字节。
    - `ByteArrayOutputStream`：将数据写入字节数组。
    - `BufferedOutputStream`：缓冲输出流。

### 2.2 字符流
- **`Reader`**：所有字符输入流的抽象基类，提供读取字符的方法。
  - 常用子类：
    - `FileReader`：从文件中读取字符。
    - `BufferedReader`：缓冲字符输入流，提供 `readLine()` 方法读取整行文本。
    - `InputStreamReader`：将字节流转换为字符流（桥梁类）。
- **`Writer`**：所有字符输出流的抽象基类，提供写入字符的方法。
  - 常用子类：
    - `FileWriter`：向文件写入字符。
    - `BufferedWriter`：缓冲字符输出流。
    - `OutputStreamWriter`：将字符流转换为字节流（桥梁类）。

### 2.3 文件操作
- **`File`**：表示文件或目录的抽象路径，提供文件操作（如创建、删除、重命名）。
- **`RandomAccessFile`**：支持随机读写文件，可以在文件中任意位置读写数据。

### 2.4 数据流和对象流
- **`DataInputStream` / `DataOutputStream`**：读写基本数据类型（如 `int`、`float`）。
- **`ObjectInputStream` / `ObjectOutputStream`**：读写对象（序列化和反序列化）。

---

## 3. 基本操作和使用场景

### 3.1 文件读取
- **字节流示例（读取二进制文件）**：
```java
import java.io.FileInputStream;
import java.io.IOException;

public class FileReadExample {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("example.bin")) {
            int byteData;
            while ((byteData = fis.read()) != -1) { // 读取单个字节
                System.out.print((char) byteData);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
- **字符流示例（读取文本文件）**：
```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class TextReadExample {
    public static void main(String[] args) {
        try (BufferedReader br = new BufferedReader(new FileReader("example.txt"))) {
            String line;
            while ((line = br.readLine()) != null) { // 逐行读取
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 3.2 文件写入
- **字节流示例（写入二进制文件）**：
```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileWriteExample {
    public static void main(String[] args) {
        try (FileOutputStream fos = new FileOutputStream("output.bin")) {
            String data = "Hello, Java I/O!";
            fos.write(data.getBytes()); // 写入字节数组
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
- **字符流示例（写入文本文件）**：
```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class TextWriteExample {
    public static void main(String[] args) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
            bw.write("Hello, Java I/O!"); // 写入字符串
            bw.newLine(); // 新行
            bw.write("This is a test.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 3.3 对象序列化
- **序列化示例（保存对象到文件）**：
```java
import java.io.*;

public class SerializationExample {
    public static void main(String[] args) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("object.dat"))) {
            Person person = new Person("Alice", 25);
            oos.writeObject(person); // 序列化对象
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class Person implements Serializable {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```
- **反序列化示例（从文件读取对象）**：
```java
import java.io.*;

public class DeserializationExample {
    public static void main(String[] args) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("object.dat"))) {
            Person person = (Person) ois.readObject(); // 反序列化
            System.out.println("Name: " + person.name + ", Age: " + person.age);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

---

## 4. 设计模式和特性

### 4.1 装饰者模式
Java I/O 使用**装饰者模式（Decorator Pattern）**，允许通过包装类增强流的功能。例如：
- `BufferedInputStream` 装饰 `FileInputStream`，提供缓冲功能。
- `DataInputStream` 装饰 `BufferedInputStream`，增加读写基本数据类型的能力。

示例：
```java
FileInputStream fis = new FileInputStream("data.bin");
BufferedInputStream bis = new BufferedInputStream(fis); // 缓冲装饰
DataInputStream dis = new DataInputStream(bis); // 数据类型装饰
int value = dis.readInt(); // 读取整数
```

### 4.2 异常处理
I/O 操作通常涉及外部资源（如文件、网络），因此需要处理 `IOException`。推荐使用 **try-with-resources** 语句，确保资源正确关闭。

### 4.3 性能优化
- 使用缓冲流（如 `BufferedReader`、`BufferedOutputStream`）减少底层系统调用。
- 对于大数据量操作，合理设置缓冲区大小。

---

## 5. 注意事项
1. **资源关闭**：未正确关闭流可能导致资源泄露，推荐使用 try-with-resources。
2. **编码问题**：字符流操作时需注意字符编码（如 UTF-8），可用 `InputStreamReader` 和 `OutputStreamWriter` 指定编码。
3. **线程安全**：大多数 I/O 类不是线程安全的，多线程操作时需同步。

---

## 6. 总结
`java.io` 包是 Java 处理输入输出的基础工具，提供灵活、高效的流操作机制。通过字节流和字符流的结合，以及装饰者模式的设计，它能满足从简单文件读写到复杂对象序列化的各种需求。尽管 Java NIO（`java.nio`）提供了更高性能的替代方案，但 `java.io` 因其简单易用仍是许多场景的首选。