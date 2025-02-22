---
title: Java多线程
date: 2025-02-19 10:42:23
permalink: /pages/6f1b13/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# Java多线程

Java 提供了强大的并发支持，包括基础的 `Thread`、`Runnable` 机制，以及更高级的**JUC**（java.util.concurrent）并发工具包，涵盖线程池、锁机制、并发集合等，极大地简化了高并发场景下的开发。合理利用多线程不仅能充分发挥多核 CPU 的计算能力，还能优化资源管理，提高系统吞吐量。然而，多线程编程也伴随着线程安全、资源竞争等挑战，需要开发者在设计时合理选择并发工具，确保程序的稳定性和高效性。

## 1. 线程和进程的区别

在操作系统中，**进程（Process）** 是程序的运行实例，每个进程拥有独立的内存空间，是操作系统进行资源分配的基本单位，而 **线程（Thread）** 是进程中的执行单元，多个线程共享同一进程的资源，是CPU调度的基本单位。主要区别如下：

| 对比项         | 进程（Process）                         | 线程（Thread）                 |
| -------------- | --------------------------------------- | ------------------------------ |
| **资源独立性** | 进程之间相互独立，拥有独立的内存空间    | 线程共享进程的堆、方法区等资源 |
| **通信方式**   | 进程间通信（IPC）复杂，如管道、消息队列 | 线程间共享数据，通信更简单     |
| **切换开销**   | 进程切换开销大，需要操作系统调度        | 线程切换开销小，效率更高       |
| **稳定性**     | 一个进程崩溃不会影响其他进程            | 线程崩溃可能影响整个进程       |

在 Java 中，每个 Java 应用程序运行在 JVM 进程中，并可创建多个线程以实现并发执行。

## 2. 并发和并行的区别

- **并发** 适用于 **单核 CPU**，指的是多个任务交替执行，每个任务在一定时间内执行一部分，然后切换到下一个任务。这是因为单核 CPU 在同一时刻只能执行一个任务。并发的主要目的是 **提高系统的响应性和吞吐量**，使多个任务能够共享 CPU 的时间片，从而提升整体效率。
- **并行** 适用于 **多核 CPU**，指的是多个任务真正同时执行，每个任务都由独立的处理器核心负责，并行处理不同的指令。并行的主要目的是 **提升计算能力和执行性能**，使多个任务能同步处理，加快任务完成速度。

**单核 CPU 只能实现并发，无法实现并行**。换句话说，并行计算只有在 **多核 CPU** 环境下才可能发生。而在 **多核 CPU** 中，并发和并行通常会 **同时存在**：多个任务可以在不同的核心上并行执行，而每个任务内部可能还包含并发逻辑，以处理不同的子任务。这种组合方式能够最大程度地提升系统性能和响应效率。

## 3. 线程的创建方式

在 Java 中，创建线程的方式有以下几种：**继承 `Thread` 类**、**实现 `Runnable` 接口**、**实现 `Callable` 接口**（配合 `FutureTask` 使用）。无论采用哪种方式，本质上所有线程最终都会通过 **`new Thread(Runnable target)`** 创建并执行，底层都是实现Runable接口。

### 3.1  继承 Thread 类

通过继承 `Thread` 类并重写 `run()` 方法来创建线程。

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

public class ThreadTest {
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start();  // 启动线程
    }
}
```

**特点**

- 直接继承 `Thread`，代码简洁。
- `run()` 方法定义线程的执行逻辑。
- **局限性**：Java 只支持**单继承**，继承 `Thread` 后无法继承其他类。

------

### 3.2  实现 Runnable 接口

创建线程的推荐方式。通过实现 `Runnable` 接口，并将 `Runnable` 对象传递给 `Thread` 来启动线程。

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable thread running: " + Thread.currentThread().getName());
    }
}

public class RunnableTest {
    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start();
    }
}
```

**特点**

- `Runnable` 方式更灵活，**不影响类的继承**（可同时继承其他类）。
- 适用于 **多个线程共享同一个任务** 的情况。
- `Thread` 类本质上也是**依赖 `Runnable` 来执行任务**。

### 3.3  实现 Callable 接口

`Callable` 接口比 `Runnable` 更加强大，它可以返回执行结果，并抛出异常。

```java
import java.util.concurrent.*;

class MyCallable implements Callable<String> {
    @Override
    public String call() {
        return "Callable task executed by " + Thread.currentThread().getName();
    }
}

public class CallableTest {
    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<String> future = executor.submit(new MyCallable());

        System.out.println(future.get()); // 获取任务执行结果
        executor.shutdown();
    }
}
```

**特点**

- `call()` 方法**可以返回值**，相比 `Runnable` 更加强大。
- 需要使用 `FutureTask` 或 `ExecutorService.submit()` 来管理 `Callable` 任务。
- **适用于需要获取执行结果的任务**（如异步计算）。

## 4. 线程的 6 种状态详解

在 Java 中，线程在生命周期中只可能处于以下 6 种状态之一，并会在不同状态之间切换。

| **状态**                      | **说明**                   | **如何进入**                                                 | **如何退出**                                                 |
| ----------------------------- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **NEW**（新建）               | 线程创建但未启动           | `new Thread()`                                               | 调用 `start()` 进入 RUNNABLE                                 |
| **RUNNABLE**（可运行）        | 线程已启动，等待 CPU 调度  | 调用 `start()`                                               | 获得 CPU 资源变为 RUNNING，或因等待变为 BLOCKED/WAITING/TIMED_WAITING |
| **BLOCKED**（阻塞）           | 线程等待获取锁             | 竞争 `synchronized` 锁失败                                   | 锁释放后进入 RUNNABLE                                        |
| **WAITING**（等待）           | 线程无限期等待其他线程通知 | 调用 `wait()`、`join()`、`LockSupport.park()`                | 其他线程 `notify()`、`notifyAll()` 或 `interrupt()`          |
| **TIMED_WAITING**（超时等待） | 线程等待固定时间           | 调用 `sleep(time)`、`join(time)`、`wait(time)`、`LockSupport.parkNanos()`、`parkUntil()` | 计时结束或提前被唤醒                                         |
| **TERMINATED**（终止）        | 线程执行完成或异常退出     | `run()` 方法结束                                             | 线程无法再次启动                                             |

![image-20250220173531697](https://cos.ywenrou.cn/blog/images/image-20250220173531697.png)

## 5. wait/notify 机制

在 Java 多线程编程中，`wait/notify` 机制是线程间通信的核心手段之一。它允许多个线程协作，使得线程能够有序地等待和唤醒，避免不必要的资源浪费。

由前面线程的状态转化图可知，当调用wait()方法后，线程会进入WAITING(等待状态)，后续被notify()后，并没有立即被执行，而是进入等待获取锁的阻塞队列。

![image-20250220192749344](https://cos.ywenrou.cn/blog/images/image-20250220192749344.png)

### 5.1  wait/notify 是什么？

`wait/notify` 机制是基于 **`Object` 类** 的方法，包括：

- `wait()`：当前线程释放锁，并进入等待状态，直到其他线程调用 `notify()` 或 `notifyAll()` 唤醒它。
- `notify()`：随机唤醒一个正在 `wait()` 的线程。
- `notifyAll()`：唤醒所有正在 `wait()` 的线程，但只有一个线程能获取锁，其余线程继续等待。

⚠️ **注意：`wait()`、`notify()` 和 `notifyAll()` 必须在 `synchronized` 代码块中调用，否则会抛出 `IllegalMonitorStateException` 异常！**

### 5.2 工作原理

当一个线程调用 `wait()` 方法时，它会进入 **等待队列**，同时**释放锁**，进入阻塞状态； 当其他线程调用 `notify()` 或 `notifyAll()`，等待的线程会被唤醒，重新争夺锁。

**示例：生产者-消费者模型**

```java
class SharedResource {
    private int data;
    private boolean available = false;
    
    public synchronized void produce(int value) throws InterruptedException {
        while (available) { // 若已有数据，则等待消费
            wait();
        }
        data = value;
        available = true;
        System.out.println("Produced: " + value);
        notify(); // 唤醒等待的消费者
    }
    
    public synchronized void consume() throws InterruptedException {
        while (!available) { // 若无数据，则等待生产
            wait();
        }
        System.out.println("Consumed: " + data);
        available = false;
        notify(); // 唤醒等待的生产者
    }
}
```

**生产者线程**

```java
class Producer extends Thread {
    private SharedResource resource;
    public Producer(SharedResource resource) { this.resource = resource; }
    public void run() {
        try {
            for (int i = 1; i <= 5; i++) {
                resource.produce(i);
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) { e.printStackTrace(); }
    }
}
```

**消费者线程**

```java
class Consumer extends Thread {
    private SharedResource resource;
    public Consumer(SharedResource resource) { this.resource = resource; }
    public void run() {
        try {
            for (int i = 1; i <= 5; i++) {
                resource.consume();
                Thread.sleep(1500);
            }
        } catch (InterruptedException e) { e.printStackTrace(); }
    }
}
```

**启动线程**

```java
public class WaitNotifyExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        new Producer(resource).start();
        new Consumer(resource).start();
    }
}
```

### 5.3 wait/notify 需要注意的点

1. **必须在 `synchronized` 代码块/方法中调用**，否则会抛出 `IllegalMonitorStateException`。
2. **`wait()` 释放锁，而 `notify()` 只是唤醒，不会立刻释放锁**，被唤醒的线程仍需等待锁释放后才能继续执行。
3. **避免死锁**：应使用 `while` 而非 `if` 进行条件判断，防止虚假唤醒（spurious wakeup）。
4. **`notify()` 不能保证唤醒哪个线程**，如果有多个 `wait()` 线程，`notify()` 可能随机选择一个线程。

## 6. 多线程的并发安全问题

**线程安全（Thread Safety）** 指的是当多个线程并发访问共享资源时，不会导致数据不一致、程序异常或系统崩溃。线程不安全的情况通常会引发以下问题：

### 6.1 **竞态条件（Race Condition）**

发生在多个线程并发访问和修改共享资源时，程序的执行结果依赖于线程的调度顺序，导致**不可预测**的错误。例如，两个线程同时对一个变量 `x` 递增，最终 `x` 的值可能小于预期。

**示例（Java）：**

```java
class Counter {
    private int count = 0;

    public void increment() {
        count++; // 非线程安全
    }

    public int getCount() {
        return count;
    }
}

public class RaceConditionDemo {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();

        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Final count: " + counter.getCount()); // 可能小于 2000
    }
}
```

**问题：** `count++` 不是原子操作，多个线程可能同时读取 `count`，导致最终结果不正确。

------

### 6.2  **死锁（Deadlock）**

发生在多个线程互相等待对方释放资源，导致程序无法继续执行。例如，线程 A 持有资源 X，并等待资源 Y，而线程 B 持有资源 Y，并等待资源 X，最终两个线程都无法继续执行。

**示例（Java）：**

```java
class DeadlockExample {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread 1: Locked resource 1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}

                synchronized (resource2) {
                    System.out.println("Thread 1: Locked resource 2");
                }
            }
        });

        Thread t2 = new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread 2: Locked resource 2");
                try { Thread.sleep(100); } catch (InterruptedException e) {}

                synchronized (resource1) {
                    System.out.println("Thread 2: Locked resource 1");
                }
            }
        });

        t1.start();
        t2.start();
    }
}
```

**问题：**

- 线程 1 先锁住 `resource1`，然后等待 `resource2`。
- 线程 2 先锁住 `resource2`，然后等待 `resource1`。
- 结果：两个线程相互等待，形成死锁，程序卡死。

------

### 6.3 **资源争用（Resource Contention）**

发生在多个线程需要访问同一个资源（如 CPU、内存、文件、数据库连接）时，导致性能下降。例如，大量线程同时访问数据库，可能会导致连接池耗尽，影响系统吞吐量。

**示例（Java）：**

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class DatabaseConnection {
    public void queryDatabase() {
        System.out.println(Thread.currentThread().getName() + " querying database...");
        try { Thread.sleep(500); } catch (InterruptedException e) {}
        System.out.println(Thread.currentThread().getName() + " finished querying.");
    }
}

public class ResourceContentionExample {
    public static void main(String[] args) {
        DatabaseConnection db = new DatabaseConnection();
        ExecutorService executor = Executors.newFixedThreadPool(2);

        for (int i = 0; i < 5; i++) {
            executor.execute(db::queryDatabase);
        }

        executor.shutdown();
    }
}
```

**问题：**

- 线程池大小为 2，但有 5 个任务同时查询数据库。
- 可能出现**连接池耗尽**，影响系统吞吐量。

这些问题会导致程序行为异常、运行效率降低，甚至系统崩溃，因此在多线程编程中需要特别关注。

## 7. 如何解决线程的并发安全问题？

在 Java 开发中，为了确保线程安全，常见的方法包括以下几类：

### 7.1 使用 synchronized 关键字（互斥同步）

`synchronized` 关键字用于确保同一时刻只有一个线程可以访问同步代码块或同步方法，从而避免数据竞争。

- **同步实例方法**（锁住当前实例对象 `this`）
- **同步静态方法**（锁住类对象 `Class`）
- **同步代码块**（可指定具体的锁对象）

**示例：**

```java
public class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

### 7.2 使用 volatile关键字

`volatile` 适用于多线程访问共享变量时，保证**变量的可见性**（线程修改后立即对其他线程可见），但**不能保证原子性**。适用于状态标志等场景。

**示例：**

```java
public class VolatileExample {
    private volatile boolean flag = true;

    public void stop() {
        flag = false;
    }
}
```

⚠️ **注意**：`volatile` 不能保证复合操作的原子性（如 `count++`），可使用 `AtomicInteger` 解决。

### 7.3 使用 ThreadLocal（线程隔离，每个线程独立变量）

`ThreadLocal` 适用于每个线程需要独立变量的场景，例如数据库连接、用户会话等。

**示例：**

```java
public class ThreadLocalExample {
    private static final ThreadLocal<Integer> threadLocalCount = ThreadLocal.withInitial(() -> 0);

    public void increment() {
        threadLocalCount.set(threadLocalCount.get() + 1);
    }

    public Integer getCount() {
        return threadLocalCount.get();
    }
}
```

### 7.4 使用 JUC包

`java.util.concurrent`包提供了一系列**线程安全**的类和工具，主要包括：

#### 7.4.1 线程安全类（Atomic原子操作）

JUC 提供 `AtomicInteger`、`AtomicLong`、`AtomicReference` 等原子类，利用**CAS（Compare And Swap）**机制保证线程安全。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();
    }

    public int getCount() {
        return count.get();
    }
}
```

#### 7.4.2 线程安全集合

JUC 提供了一系列线程安全的数据结构：

- `ConcurrentHashMap`（线程安全的 HashMap）
- `CopyOnWriteArrayList`（适用于读多写少的场景）
- `ConcurrentLinkedQueue`（无锁并发队列）

**示例：**

```java
import java.util.concurrent.ConcurrentHashMap;

public class SafeMap {
    private ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

    public void put(String key, int value) {
        map.put(key, value);
    }

    public int get(String key) {
        return map.getOrDefault(key, 0);
    }
}
```

#### 7.4.3 显式锁 Lock（如 ReentrantLock）

`ReentrantLock` 提供了比 `synchronized` 更灵活的锁机制，可实现可重入、可中断、公平锁等特性。

**示例：**

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockExample {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
}
```

## 8. Synchronized vs. ReentrantLock

在 Java 多线程编程中，**锁**是解决并发问题的核心机制。**`Synchronized`** 和 **`ReentrantLock`** 是两种常见的同步工具，它们在**锁的获取方式、公平性、灵活性**等方面存在明显区别。

### 8.1 锁的获取方式

#### Synchronized（隐式锁）

- 当线程进入 **同步代码块或方法** 时，JVM **自动加锁**，退出时自动释放。
- **无需手动管理**，由 JVM 处理锁的加解锁，代码简洁，但缺乏灵活性。

**示例：同步方法**

```java
public synchronized void method() {
    // 线程安全代码
}
```

**示例：同步代码块**

```java
public void method() {
    synchronized (this) {
        // 线程安全代码
    }
}
```

#### ReentrantLock（显式锁）

- 需要 **手动调用 `lock()` 获取锁**，再手动 `unlock()` 释放锁。
- 提供**更灵活的控制**，例如**支持超时获取锁、可中断锁、Condition 变量**等。
- **适用于复杂并发场景**，但如果 `unlock()` 释放锁的代码遗漏，会导致死锁问题。

**示例：手动加锁/释放锁**

```java
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // 线程安全代码
} finally {
    lock.unlock(); // 确保锁释放
}
```

### 8.2 公平锁 vs. 非公平锁

#### 什么是公平锁？

- **公平锁**：按照**线程的等待顺序**依次获取锁，先等待的线程优先执行。
- **非公平锁**：新来的线程可能会**直接抢占锁**，即使其他线程已经等待了更长时间。

#### Synchronized 的公平性

- **Synchronized 只能使用非公平锁**，无法手动设置公平性。
- 因为锁竞争时，JVM 允许**新来的线程插队**，可能导致某些线程**长期得不到执行**（线程饥饿）。

#### ReentrantLock 的公平性

- **默认是非公平锁**（吞吐量更高）。

- 支持公平锁，可以通过构造参数设定：

  ```java
  ReentrantLock lock = new ReentrantLock(true); // 创建公平锁
  ```
  
- **公平锁的优点**：避免线程饥饿，提高系统稳定性。

- **公平锁的缺点**：性能稍差，吞吐量比非公平锁低。

**对比：**

| 锁类型            | 公平性                            | 特点                                             |
| ----------------- | --------------------------------- | ------------------------------------------------ |
| **Synchronized**  | 仅支持 **非公平锁**               | 线程可能**插队**，提高吞吐量，但可能导致线程饥饿 |
| **ReentrantLock** | **默认非公平**，可设为 **公平锁** | **公平锁保证 FIFO**，避免线程饥饿，但性能略低    |

### 8.3 ReentrantLock 提供的高级功能

相较于 `Synchronized`，`ReentrantLock` 具备**更强的灵活性**，提供如下高级功能：

#### ✅ 1. 可中断锁

- **Synchronized** 不支持**中断等待**，如果线程一直无法获取锁，只能等待。
- **ReentrantLock** 支持 `lockInterruptibly()`，允许线程**在等待锁时响应中断**。

```java
lock.lockInterruptibly(); // 允许在等待锁时被中断
```

**适用场景**：避免线程**无限制阻塞**，可以在业务需要时终止等待锁的线程。

------

#### ✅ 2. 超时获取锁

- **Synchronized** 不支持**超时机制**，如果获取不到锁，只能一直等待。
- **ReentrantLock** 提供 `tryLock(time, unit)`，如果在设定时间内无法获取锁，就返回 `false`，防止线程长时间等待。

```java
if (lock.tryLock(2, TimeUnit.SECONDS)) { // 2秒内尝试获取锁
    try {
        // 执行业务逻辑
    } finally {
        lock.unlock();
    }
} else {
    System.out.println("获取锁失败，执行其他操作");
}
```

**适用场景**：适用于高并发环境，避免线程无限等待导致死锁。

------

#### ✅ 3. Condition 变量（等待/通知机制）

- **Synchronized** 依赖 `wait()` 和 `notify()` 进行**线程通信**。
- **ReentrantLock** 提供 **Condition 变量**，可以更灵活地控制多个线程的等待/唤醒逻辑。

```java
Condition condition = lock.newCondition();

lock.lock();
try {
    condition.await();  // 线程等待
    condition.signal(); // 唤醒等待线程
} finally {
    lock.unlock();
}
```

**适用场景**：生产者-消费者模型、线程通信机制等。

------

### 8.4 适用场景

| **适用情况**                | **Synchronized**     | **ReentrantLock**            |
| --------------------------- | -------------------- | ---------------------------- |
| **简单同步（代码块/方法）** | ✅ 推荐               | ❌ 过于复杂                   |
| **需要公平锁**              | ❌ 不支持             | ✅ 支持                       |
| **支持中断**                | ❌ 不支持             | ✅ 支持 `lockInterruptibly()` |
| **超时等待锁**              | ❌ 不支持             | ✅ 支持 `tryLock(time, unit)` |
| **等待/通知机制**           | ⚠️ 依赖 `wait/notify` | ✅ `Condition` 更灵活         |

## 9. 工作中你如何使用多线程

我通过通过使用线程池管理线程资源，避免手动创建线程导致资源浪费。池化技术的思想主要是为了减少每次获取资源的消耗，提高对资源的利用率。

**优点：**

- **减少资源消耗**：线程池复用已有线程，避免频繁创建销毁。
- **提高响应速度**：任务提交后可快速分配线程执行，提高系统吞吐量。
- **统一管理线程**：支持线程超时回收、任务队列等机制，增强控制能力。

## 10.线程池的创建方式

在 Java 中，我们可以通过 **`ThreadPoolExecutor`** 或 **`Executors`** 来创建线程池，其中 **推荐使用 `ThreadPoolExecutor`** 进行精确控制，以避免 `Executors` 默认配置可能带来的问题（如 `CachedThreadPool` 可能导致 OOM）。

![image-20250220162812259](https://cos.ywenrou.cn/blog/images/image-20250220162812259.png)

------

### 方式一：使用 ThreadPoolExecutor构造函数创建线程池（推荐）

`ThreadPoolExecutor` 提供了更灵活的线程池管理方式，可以**精细控制线程数、队列大小及拒绝策略**，适用于高并发场景。

**1. `ThreadPoolExecutor` 构造方法**

```java
public ThreadPoolExecutor(
    int corePoolSize,        // 核心线程数
    int maximumPoolSize,     // 最大线程数
    long keepAliveTime,      // 线程空闲时间
    TimeUnit unit,           // 时间单位
    BlockingQueue<Runnable> workQueue, // 任务队列
    ThreadFactory threadFactory,       // 线程工厂（可自定义线程命名）
    RejectedExecutionHandler handler   // 拒绝策略
)
```

**2. 代码示例**

```java
import java.util.concurrent.*;

public class CustomThreadPool {
    public static void main(String[] args) {
        // 创建线程池
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(
            2,  // 核心线程数
            5,  // 最大线程数
            10, TimeUnit.SECONDS,  // 线程存活时间
            new LinkedBlockingQueue<>(3),  // 任务队列，最大可排队 3 个任务
            Executors.defaultThreadFactory(),  // 线程工厂，默认
            new ThreadPoolExecutor.AbortPolicy() // 拒绝策略
        );

        // 提交任务
        for (int i = 1; i <= 10; i++) {
            int taskNumber = i;
            threadPool.execute(() -> {
                System.out.println(Thread.currentThread().getName() + " 正在执行任务 " + taskNumber);
                try {
                    Thread.sleep(2000);  // 模拟任务执行时间
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }

        // 关闭线程池
        threadPool.shutdown();
    }
}
```

**3. 线程池参数解释**

| 参数                | 含义         | 作用                                                   |
| ------------------- | ------------ | ------------------------------------------------------ |
| **corePoolSize**    | 核心线程数   | 线程池会维持的最小线程数量，即使它们处于空闲状态       |
| **maximumPoolSize** | 最大线程数   | 线程池允许创建的最大线程数                             |
| **keepAliveTime**   | 线程存活时间 | 当线程数大于 `corePoolSize` 时，多余空闲线程的存活时间 |
| **workQueue**       | 任务队列     | 当核心线程满后，新任务进入队列等待                     |
| **threadFactory**   | 线程工厂     | 创建线程的方式（可自定义线程命名）                     |
| **handler**         | 拒绝策略     | 当任务队列满时的处理方式                               |

**4. 拒绝策略（RejectedExecutionHandler）**

当任务超出 **最大线程数 + 队列容量** 时，线程池会触发**拒绝策略**：

| 拒绝策略              | 作用                                                         |
| --------------------- | ------------------------------------------------------------ |
| `AbortPolicy`（默认） | **丢弃任务，抛出异常**（适用于重要任务，需手动处理异常）     |
| `CallerRunsPolicy`    | **由调用线程执行任务**，不会抛异常（适用于主线程能承担任务执行） |
| `DiscardPolicy`       | **丢弃任务，不抛异常**（适用于不重要的任务，如日志）         |
| `DiscardOldestPolicy` | **丢弃队列中最早的任务，然后尝试执行新任务**                 |

------

### 方式二：使用 Executors 工具类创建线程池（不推荐）

`Executors` 提供了一些简单的方法来创建常见类型的线程池，但默认配置容易导致资源问题，例如：

- `CachedThreadPool` 线程数**无限增长**，可能导致 OOM。
- `FixedThreadPool` 和 `SingleThreadExecutor` 使用**无界队列**，可能导致任务堆积，内存占满。

**1. 常见线程池**

```java
// 1. 固定大小线程池（适用于任务量稳定场景）
ExecutorService fixedThreadPool = Executors.newFixedThreadPool(5);

// 2. 缓存线程池（适用于短任务高并发场景）
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();

// 3. 单线程池（适用于串行执行任务）
ExecutorService singleThreadPool = Executors.newSingleThreadExecutor();

// 4. 调度线程池（适用于定时任务）
ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(5);
```

**2. 示例代码**

```java
import java.util.concurrent.*;

public class ExecutorsExample {
    public static void main(String[] args) {
        ExecutorService fixedThreadPool = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 5; i++) {
            int taskNumber = i;
            fixedThreadPool.execute(() -> {
                System.out.println(Thread.currentThread().getName() + " 执行任务 " + taskNumber);
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }

        fixedThreadPool.shutdown();
    }
}
```

## 11. 为什么推荐 ThreadPoolExecutor而不推荐 Executors？

`Executors` 提供的方法容易导致资源管理问题：

1. `Executors.newFixedThreadPool(nThreads)`
   - 使用 **`LinkedBlockingQueue`（无界队列）**，可能导致任务堆积，占用大量内存，最终 OOM。
2. `Executors.newCachedThreadPool()`
   - 使用 **`SynchronousQueue`（无容量队列）**，如果任务提交过快，线程会无限创建，可能导致 OOM。
3. `Executors.newSingleThreadExecutor()`
   - 适用于**单任务串行执行**，但同样使用 `LinkedBlockingQueue`，任务积压可能导致 OOM。

## 12. 线程池的底层工作原理

![image-20250220162925362](https://cos.ywenrou.cn/blog/images/image-20250220162925362.png)

### 12.1 线程池的创建

在使用线程池之前，首先需要创建线程池。线程池的创建通常涉及以下参数：

- **核心线程数（Core Pool Size）**：始终存活的线程数量，即使没有任务也不会销毁。
- **最大线程数（Maximum Pool Size）**：线程池能创建的最大线程数量。
- **任务队列（Blocking Queue）**：用于存储等待执行的任务。
- **线程存活时间（Keep Alive Time）**：当线程数超过核心线程数时，空闲线程的存活时间。
- **线程工厂（Thread Factory）**：用于创建新线程的工厂方法。
- **拒绝策略（Rejected Execution Handler）**：当任务队列已满且线程数达到最大值时的处理策略。

### 12.2 任务提交

当有任务需要执行时，线程池提供两种方式提交任务：

- **`execute(Runnable command)`**：适用于不需要返回结果的任务。
- **`submit(Callable<T> task)`**：适用于需要返回结果的任务，会返回 `Future<T>` 对象，可通过 `get()` 方法获取执行结果。

### 12.3 线程分配

- 任务提交后，线程池优先使用**核心线程**执行任务。
- 如果核心线程已满，任务会进入**任务队列**等待执行。
- 当任务队列也满了，并且线程数未达到最大线程数时，线程池会创建**新临时线程**执行任务。
- 如果线程数已达最大值并且任务队列满了，则触发**拒绝策略**。

### 12.4 任务执行

线程池中的工作线程会不断从任务队列中取出任务并执行。当任务执行完成后，线程不会立即销毁，而是继续等待新任务。

### 12.5 线程回收

线程池的线程不会无限增长，而是根据配置参数进行回收：

- **核心线程**默认不会被回收，即使空闲也会存活。
- **非核心线程**（当线程数超过核心线程数时创建的临时线程）在**`keepAliveTime`** 设定的时间内没有新任务时，会被销毁。

### 12.6 任务完成与结果返回

- 如果任务是 `Callable` 类型，线程池会返回 `Future<T>` 对象，可通过 `get()` 方法获取结果。
- 如果是 `Runnable` 任务，则无返回值，任务执行完即结束。

### 12.7 线程池的异常处理

线程池内部会对任务执行过程中抛出的异常进行处理：

- **使用 `execute()` 提交任务**：如果任务中有未捕获的异常，线程会终止，线程池会创建新线程替换它。
- **使用 `submit()` 提交任务**：异常会被封装在 `Future` 中，线程不会终止，需要调用 `get()` 方法捕获 `ExecutionException`。

##  13. 线程池中线程异常后，销毁还是复用？ 

直接说结论，需要分两种情况： 

- **使用execute()提交任务**：当任务通过execute()提交到线程池并在执行过程中抛出异常时，如果这个异常没有在任务内被捕获，那么该异常会导致当前线程终止，并且异常会被打印到控制台或日志文件中。线程池会检测到这种线程终止，并创建一个新线程来替换它，从而保持配置的线程数不变。 -
- **使用submit()提交任务**：对于通过submit()提交的任务，如果在任务执行中发生异常，这个异常不会直接打印出来。相反，异常会被封装在由submit()返回的Future对象中。当调用Future.get()方法时，可以捕获到一个ExecutionException。在这种情况下，线程不会因为异常而终止，它会继续存在于线程池中，准备执行后续的任务。 

简单来说：使用execute()时，未捕获异常导致线程终止，线程池创建新线程替代；使用submit()时，异常被封装在Future中，线程继续复用。 这种设计允许submit()提供更灵活的错误处理机制，因为它允许调用者决定如何处理异常，而execute()则适用于那些不需要关注执行结果的场景。

具体的源码分析可以参考这篇：[线程池中线程异常后：销毁还是复用？ - 京东技术](https://mp.weixin.qq.com/s/9ODjdUU-EwQFF5PrnzOGfw)。

## 14. 线程的关闭和线程池的关闭

在多线程编程中，线程的关闭和线程池的关闭有一些关键区别。

1. **线程的关闭**：
   - `interrupt()`：这个方法用于通知线程中断，线程的执行状态会变成“中断”，但是它不会立即停止线程的执行。线程需要在适当的位置检查是否被中断，并响应中断请求，例如通过抛出 `InterruptedException` 或检查 `Thread.interrupted()` 标志。
   - `stop()`：这个方法曾经是用来强制终止线程的，但它已经被标记为已弃用（自 Java 1.2 起）。使用 `stop()` 方法来停止线程是不安全的，因为它会强制线程退出，可能会导致不一致的状态或资源泄漏。因此，不推荐使用该方法。
2. **线程池的关闭**：
   - `shutdown()`：这个方法会平滑地关闭线程池，停止接收新任务，并且在完成所有已提交的任务后退出。
   - `shutdownNow()`：这个方法会尝试立即停止所有正在执行的任务，并返回尚未执行的任务列表。
