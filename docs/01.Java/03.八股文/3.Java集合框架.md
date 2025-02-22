---
title: Java集合框架
date: 2025-02-20 20:53:40
permalink: /pages/40ffbb/
categories:
  - Java
  - 八股文
tags:
  - 
author: 
  name: xiaoyang
  link: https://github.com/OkayYang
---
# Java集合框架

集合这东西啊，在咱们开发里简直是“万金油”，ArrayList、LinkedList、HashMap、HashSet，随随便便就能掏出来用，IDE里敲几下键盘，代码就哗哗往外冒，效率拉满！不过呢，光会用可不行，咱们得做个有追求的码农，对吧？要是能搞清楚这些API背后是怎么玩儿的，原理是什么，就像自带“显微镜”一样，把集合的“内脏”看得清清楚楚，那感觉多带劲儿啊！这可不是简单地用工具，而是咱们在驾驭工具，想怎么玩就怎么玩，牛不牛？

## 1. 集合框架是个啥？先来个全家福！

Java集合框架（Java Collections Framework，简称JCF）是Java提供的一套“工具箱”，专门用来装和管理对象。它从Java 1.2开始崭露头角，彻底告别了早期数组、Vector那种“各自为战”的混乱局面。集合框架的核心就是两大“门派”：`Collection`和`Map`，加上它们的“徒子徒孙”，组成了一个超级大家庭。

想象一下，集合框架就像一个大超市：
- **`Collection`**：货架上放着一堆单品，比如`List`（有序可重复）、`Set`（无序不可重复）、`Queue`（队列操作）。
- **`Map`**：货架上摆的是“键值对”套装，靠`key`找`value`，简单粗暴。

下图是集合框架的“全家福”，有点眼花缭乱？别慌，咱们一步步拆开聊！

![image-20250220211342893](https://cos.ywenrou.cn/blog/images/image-20250220211342893.png)

## 2. 两大门派，带你认亲戚

### 2.1 Collection——单身贵族的天下
`Collection`是所有单元素集合的“老祖宗”，它定义了增删改查的基本套路。它的三大分支各有绝技：

1. **`List`**：有序、可重复，像个记性超好的管家，按顺序摆好东西，常见选手有`ArrayList`（数组快查）和`LinkedList`（链表快改）。
2. **`Set`**：无序、不重复，像个“洁癖患者”，绝不允许俩长一样的家伙混进来，代表有`HashSet`（哈希表）和`TreeSet`（有序树）。
3. **`Queue`**：队列选手，讲究“先进先出”或“优先级”，比如`PriorityQueue`（优先级堆）和`ArrayDeque`（双端数组）。

### 2.2 Map——键值对的王者
`Map`不归`Collection`管，它专管键值对`<key, value>`，通过`key`定位`value`，`key`绝不重复。它的明星成员有：
- `HashMap`：哈希表扛把子，查找快到飞起。
- `TreeMap`：红黑树高手，自带排序功能。
- `LinkedHashMap`：哈希表加链表，能记插入顺序还能玩LRU。

## 3. 工具侠——Iterator和朋友们

集合再牛，也得会“翻箱倒柜”找东西吧？这时候，遍历工具就上场了：
- **`Iterator`**：单向遍历老大哥，能看（`next()`）、问（`hasNext()`）、删（`remove()`）。
- **`Iterable`**：Iterator的“升级版外壳”，支持增强for循环（Java 1.8起还加了`forEach`），底层还是靠Iterator干活。
- **`ListIterator`**：List专属，双向遍历+任意起点，简直是“灵活小王子”。

### 3.1 Iterator接口

**源码**：

```java
public interface Iterator<E> {
    boolean hasNext();
    E next();
    void remove();
}
```

提供的API接口含义如下：

- `hasNext()`：判断集合中是否存在下一个对象
- `next()`：返回集合中的下一个对象，并将访问指针移动一位
- `remove()`：删除集合中调用`next()`方法返回的对象

在早期，遍历集合的方式只有一种，通过`Iterator`迭代器操作

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
Iterator iter = list.iterator();
while (iter.hasNext()) {
    Integer next = iter.next();
    System.out.println(next);
    if (next == 2) { iter.remove(); }
}
```

### 3.2 Iterable 接口
**源码**：

```java
public interface Iterable<T> {
    Iterator<T> iterator();
    // JDK 1.8
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }
}
```

- **特点**：提供了`Iterator`接口，实现了`Iterable`的集合都能用迭代器遍历。
- **新技能**：JDK 1.8加入`forEach()`，支持增强for循环。

**用法**：
```java
List<Integer> list = new ArrayList<>();
for (Integer num : list) {
    System.out.println(num);
}
```

**真相**：用`javap -c`反编译，发现增强for是语法糖，等价于：

```java
Iterator<Integer> iter = list.iterator();
while (iter.hasNext()) {
    Integer num = iter.next();
    System.out.println(num);
}
```

### 3.3 ListIterator接口
还没完！`ListIterator`登场，它继承`Iterator`，专为`List`打造，支持**任意起点**和**双向遍历**。

**用法**：
```java
List<Integer> list = new ArrayList<>();
ListIterator<Integer> listIter1 = list.listIterator();    // 从0开始
ListIterator<Integer> listIter2 = list.listIterator(5);  // 从5开始
```

**源码**：
```java
public interface ListIterator<E> extends Iterator<E> {
    boolean hasNext();
    E next();
    boolean hasPrevious();
    E previous();
    int nextIndex();
    int previousIndex();
    void remove();
    void set(E e);  // 替换最后访问的元素
    void add(E e);  // 在当前位置插入
}
```

- **升级点**：比`Iterator`多出回退（`previous`）、索引感知（`nextIndex`/`previousIndex`）、修改（`set`/`add`）。
- **特点**：从任意下标起跳，双向操作，功能更强。

## 4. Map家族——键值对界的扛把子

### 4.1 HashMap：快枪手

JDK 8 中 HashMap 的数据结构是`数组`+`链表`+`红黑树`。

- **绝技**：哈希表（数组+链表+红黑树），查找和插入平均O(1)。
- **特点**：无序、非线程安全，冲突多时链表变红黑树（长度>8且数组>64）。
- **用法**：随便存键值对，速度第一选择。

```java
HashMap<String, Integer> map = new HashMap<>();
map.put("苹果", 5);
map.put("香蕉", 3);
System.out.println(map.get("苹果")); // 输出5
```

![image-20250220215824255](https://cos.ywenrou.cn/blog/images/image-20250220215824255.png)

HashMap 的存储过程基于哈希表，通过键的哈希码计算存储位置。主要步骤如下：
1. **计算哈希码**: 调用键的 `hashCode()` 方法，得到一个整数。
2. **确定桶位置**: 用哈希码通过哈希函数（如 `(n - 1) & hash`）计算数组索引。
3. **处理碰撞**: 如果桶内已有元素，使用链表或红黑树存储新键值对。
4. **存储键值对**: 将键值对放入对应桶，必要时扩容数组。

从 Java 8 开始，当桶内元素过多时，链表会转为红黑树以优化查找效率。

**存储过程：**

#### 1. 计算键的哈希码
- **过程**: 当调用 `put(K key, V value)` 时，HashMap 首先通过键的 `hashCode()` 方法获取一个整数哈希码。
- **细节**: `hashCode()` 是 Object 类的方法，用户可以自定义。如果键是 null，哈希码定义为 0。
- **优化**: HashMap 内部通过一个额外的扰动函数（`hash()` 方法）优化哈希码，减少碰撞：
  ```java
  static final int hash(Object key) {
      int h;
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
  }
  ```
  这里将哈希码高 16 位与低 16 位异或，确保高位信息参与索引计算，降低碰撞概率。

#### 2. 确定桶的位置
- **过程**: 使用哈希码计算键值对在数组中的存储位置（桶索引）。
- **底层结构**: HashMap 使用一个 `Node<K,V>[] `数组（称为 table）存储数据，每个数组元素是一个桶。
- **哈希函数**: 桶索引通过 `(n - 1) & hash` 计算，其中：
  - `n` 是数组长度（总是 2 的幂，如 16、32）。
  - `hash` 是优化后的哈希码。
- **为什么用 &**: 因为 `n` 是 2 的幂，`(n - 1)` 的二进制全是 1，`&` 操作相当于取模运算（`hash % n`），但效率更高。
- **示例**: 
  - 假设数组长度为 16，哈希码为 20。
  - `(n - 1) = 15`，二进制为 `1111`。
  - `20 & 15 = 4`，键值对存储在索引 4 的桶中。

#### 3. 处理碰撞
- **场景**: 如果多个键的哈希码映射到同一索引（即碰撞），需要解决冲突。

- **Java 7 及之前**: 使用链表。
  
  - 桶内已有元素时，新键值对作为链表节点插入（头插法）。
  - 查找时间复杂度为 O(n)，n 是链表长度。
  
- **Java 8 改进**: 链表 + 红黑树。
  - 当桶内元素少于 8 时，使用链表。
  - 当链表长度超过 8 且数组长度至少为 64 时，转换为红黑树。
  - 红黑树查找时间复杂度为 O(log n)，优化了大量碰撞时的性能。
  
- **Node 结构**:
  
  ```java
  static class Node<K,V> implements Map.Entry<K,V> {
      final int hash;
      final K key;
      V value;
      Node<K,V> next;
  }
  ```
  红黑树使用 `TreeNode` 类，继承 Node 并增加了树结构相关字段。

#### 4. 存储键值对
- **过程**: 将键值对封装为 Node 或 TreeNode 对象，放入对应桶。
- **扩容检查**: 每次 put 后，检查元素数量是否超过阈值（`threshold = capacity * loadFactor`）。
  - 默认容量（capacity）为 16，加载因子（loadFactor）为 0.75。
  - 若超过阈值，数组扩容为原先两倍（例如 16 -> 32）。
  - 扩容后，所有元素重新计算索引并迁移（rehash），因为数组长度变化影响 `(n - 1) & hash` 的结果。

#### 存储过程示例
假设初始 HashMap 容量为 16，加载因子 0.75，存储键值对 ("key1", "value1")：
1. 调用 `key1.hashCode()`，假设返回 12345。
2. 扰动计算：`12345 ^ (12345 >>> 16)`，得到优化哈希码，例如 12350。
3. 计算索引：`(16 - 1) & 12350 = 15 & 12350 = 14`。
4. 检查 table[14]：
   - 若为空，创建新 Node，放入 table[14]。
   - 若不为空，插入链表或红黑树。
5. 元素数量加 1，检查是否需要扩容。

#### 关键细节
- **null 键处理**: null 键的哈希码为 0，通常存储在 table[0]。
- **扩容代价**: 扩容涉及数组复制和 rehash，时间复杂度为 O(n)，可能影响性能。
- **红黑树转换条件**:
  - 链表长度 ≥ 8（`TREEIFY_THRESHOLD`）。
  - 数组长度 ≥ 64（`MIN_TREEIFY_CAPACITY`）。
  - 若数组长度小于 64，仅扩容，不转为树。

### 4.2 LinkedHashMap：记性好

- **绝技**：HashMap+双向链表，默认记插入顺序，设`accessOrder=true`还能按访问顺序排（LRU神器）。
- **用法**：需要顺序或缓存时用它。

```java
LinkedHashMap<String, Integer> lmap = new LinkedHashMap<>(16, 0.75f, true);
lmap.put("A", 1);
lmap.put("B", 2);
lmap.get("A"); // 访问A，顺序变为B->A
```

![image-20250220222301977](https://cos.ywenrou.cn/blog/images/image-20250220222301977.png)

### 4.3 TreeMap：排序大师

- **绝技**：数组+红黑树实现，O(log n)，键天然有序（或自定义Comparator）。
- **用法**：需要键排序时，比如排行榜。

```java
TreeMap<Integer, String> tmap = new TreeMap<>();
tmap.put(3, "三");
tmap.put(1, "一");
System.out.println(tmap); // {1=一, 3=三}
```



![image-20250220222453414](https://cos.ywenrou.cn/blog/images/image-20250220222453414.png)

### 4.4 WeakHashMap：短命鬼

- **绝技**：键是弱引用，GC一来就拜拜，适合临时缓存。
- **用法**：存不重要、不常访问的数据。

### 4.5 Hashtable：老前辈
- **绝技**：数组 + 链表结构，线程安全（全方法加`synchronized`），但性能差，已被淘汰。
- **替代**：用`ConcurrentHashMap`吧，新时代选择！

## 5.1 Collection家族——单身派对

### 5.2 Set系：不爱重复
- **`HashSet`**：靠HashMap，O(1)查重，无序。
- **`LinkedHashSet`**：靠LinkedHashMap，有序版HashSet。
- **`TreeSet`**：靠TreeMap，有序且不重复，O(log n)。

```java
Set<String> set = new HashSet<>();
set.add("猫"); set.add("狗"); set.add("猫"); // 猫只存一次
System.out.println(set); // [猫, 狗]
```

### 5.3 List系：爱排队
- **`ArrayList`**：数组实现，查快（O(1)），增删慢（O(n)），非线程安全。
- **`LinkedList`**：双向链表，增删快（O(1)），查慢（O(n)），还能当队列用。
- **`Vector`**：线程安全的老古董，太慢，被淘汰。

```java
List<String> list = new ArrayList<>();
list.add("A"); list.add("B");
System.out.println(list.get(0)); // A
```

### 5.5 Queue系：排队大师
- **`PriorityQueue`**：堆实现，按优先级出队（默认自然序）。
- **`ArrayDeque`**：数组双端队列，栈和队列都行，比LinkedList还快。
- **`LinkedList`**：也能当队列，双向操作灵活。

```java
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(3); pq.offer(1); pq.offer(2);
System.out.println(pq.poll()); // 1，最小值先出
```

---

## 6. 性能PK，谁是王者？

| 集合       | 增删复杂度 | 查询复杂度 | 数据结构      | 线程安全 |
| ---------- | ---------- | ---------- | ------------- | -------- |
| ArrayList  | O(n)       | O(1)       | 数组          | 否       |
| LinkedList | O(1)       | O(n)       | 双向链表      | 否       |
| HashSet    | O(1)       | O(1)       | 哈希表+红黑树 | 否       |
| TreeSet    | O(log n)   | O(log n)   | 红黑树        | 否       |
| HashMap    | O(1)       | O(1)       | 哈希表+红黑树 | 否       |
| TreeMap    | O(log n)   | O(log n)   | 红黑树        | 否       |

**小贴士**：
- 查多用`ArrayList`，改多用`LinkedList`。
- 去重选`HashSet`，排序选`TreeSet`。
- 键值对用`HashMap`，排序用`TreeMap`，缓存用`LinkedHashMap`。

## 7. 实战小例子

### 场景1：排行榜（TreeSet）
```java
TreeSet<Integer> scores = new TreeSet<>();
scores.add(85); scores.add(92); scores.add(78);
System.out.println(scores); // [78, 85, 92]
```

### 场景2：LRU缓存（LinkedHashMap）
```java
LinkedHashMap<String, Integer> cache = new LinkedHashMap<>(3, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry eldest) {
        return size() > 3; // 超3个淘汰最老的
    }
};
cache.put("A", 1); cache.put("B", 2); cache.put("C", 3);
cache.get("A"); // 访问A
cache.put("D", 4); // 加D，淘汰B
System.out.println(cache); // {C=3, A=1, D=4}
```

## 8. 线程安全的集合类

JUC（`java.util.concurrent`）包提供了线程安全的集合类，适用于多线程环境。以下是常见的 JUC 集合及其特点：
- **ConcurrentHashMap**: 线程安全的 HashMap，分段锁（Java 7）或 CAS + 同步（Java 8），高并发读写。
- **CopyOnWriteArrayList**: 线程安全的 ArrayList，写时复制，适合读多写少。
- **CopyOnWriteArraySet**: 基于 CopyOnWriteArrayList 的线程安全 Set，无重复元素。
- **ConcurrentLinkedQueue**: 线程安全的无界队列，基于链表，使用 CAS 实现。
- **BlockingQueue 及其实现**（如 ArrayBlockingQueue、LinkedBlockingQueue）：阻塞队列，支持生产者-消费者模式。
- **ConcurrentSkipListMap**: 线程安全的有序 Map，基于跳表，适合高并发排序。
- **ConcurrentSkipListSet**: 基于 ConcurrentSkipListMap 的线程安全有序 Set。

这些集合通过锁、CAS 或复制机制保证线程安全，性能比同步包装类（如 `Collections.synchronizedList`）更高。

## 9. 面试题

### 9.1 hashcode 和 equals 方法只重写一个行不行

**理论可以，但是不推荐！**是因为它们在集合类（如 `HashMap`、`HashSet`）中一起用于判断对象是否相等。如果只重写 `equals()` 而不同步更新 `hashCode()`，会导致集合行为异常，比如：

- `HashMap` 中无法正确找到键。
- `HashSet` 中出现重复元素。

这是因为集合依赖 `hashCode()` 快速定位对象（分桶），再用 `equals()` 确认是否相等，二者必须保持一致性：如果两个对象 `equals()` 为 true，它们的 `hashCode()` 必须相等。

#### 1. equals 和 hashCode 的关系
- **`equals()`**: 定义两个对象是否“逻辑相等”，默认比较内存地址（`==`），可以重写为自定义规则。
- **`hashCode()`**: 返回对象的哈希码，默认基于内存地址，用于哈希表（如 `HashMap`）快速定位。
- **契约（Contract）**: Java 对象类的官方文档规定：
  - 如果 `a.equals(b)` 返回 true，则 `a.hashCode()` 必须等于 `b.hashCode()`。
  - 如果 `a.hashCode() != b.hashCode()`，则 `a.equals(b)` 必须返回 false。
  - 反之不一定：`hashCode()` 相等，`equals()` 可以不相等（哈希碰撞）。

#### 2. 为什么集合需要它们一致？
- **哈希表工作原理**:
  - `HashMap` 用 `hashCode()` 计算键的桶位置（索引）。
  - 在桶内用 `equals()` 判断是否真正相等。
- **不一致的后果**:
  - 如果 `equals()` 认为两个对象相等，但 `hashCode()` 不同，它们可能被放到不同桶，导致查找失败。
  - 如果 `hashCode()` 不重写，默认值可能不符合逻辑相等性，破坏集合的预期行为。

#### 3. 示例：不重写 hashCode 的问题
假设一个 `Person` 类，只重写 `equals()`：
```java
class Person {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person)) return false;
        Person p = (Person) o;
        return age == p.age && name.equals(p.name);
    }
    // 未重写 hashCode，默认用 Object 的实现
}
```
测试：
```java
public static void main(String[] args) {
    Person p1 = new Person("Alice", 25);
    Person p2 = new Person("Alice", 25);

    HashMap<Person, String> map = new HashMap<>();
    map.put(p1, "Person 1");
    System.out.println(map.get(p2)); // null

    HashSet<Person> set = new HashSet<>();
    set.add(p1);
    set.add(p2);
    System.out.println(set.size()); // 2
}
```
- **结果**:
  - `p1.equals(p2)` 为 true，但 `p1.hashCode() != p2.hashCode()`（默认基于内存地址）。
  - `map.get(p2)` 返回 null，因为 `p2` 的哈希码定位到不同桶。
  - `set.size()` 为 2，重复添加，因为 `HashSet` 认为它们不相等。

#### 4. 正确重写 hashCode
加上 `hashCode()`：
```java
@Override
public int hashCode() {
    return 31 * name.hashCode() + age;
}
```
再次测试：
```java
map.put(p1, "Person 1");
System.out.println(map.get(p2)); // "Person 1"
set.add(p1);
set.add(p2);
System.out.println(set.size()); // 1
```
- **结果**: 
  - `p1.hashCode() == p2.hashCode()`，定位到同一桶。
  - `equals()` 确认相等，`HashMap` 和 `HashSet` 行为正确。

#### 5. 为什么不自动重写？
- Java 不强制自动同步 `hashCode()`，因为：
  - `equals()` 的逻辑由开发者定义，`hashCode()` 必须匹配自定义规则。
  - 自动生成可能不高效（比如基于所有字段）。

#### 6. 重写 hashCode 的原则
- **一致性**: `equals()` 相等的对象，`hashCode()` 必须相等。
- **高效性**: 尽量均匀分布，减少碰撞。
- **简单性**: 常用方法：`31 * field1.hashCode() + field2`（31 是质数，减少冲突）。

#### 7. 什么时候不需要重写？
- 不使用哈希集合（`HashMap`、`HashSet`），只用 `equals()` 比较时，可以不重写 `hashCode()`。
- 但为了代码健壮性，建议始终保持一致。



## 10. 尾声：学会挑工具，代码更牛！

集合框架就是你的“武器库”，用得好，代码效率飞起，用不好，可能踩坑无数。记住这几点：
- 搞清楚底层（数组、链表、树），性能心里有数。
- 根据场景挑选手（查、改、排序、去重），别乱来。
- 线程安全要考虑，高并发别用非安全的家伙。

这篇教程带你从“门外汉”到“门清儿”，赶紧动手试试吧！有啥问题，随时来问我，咱们一起“开挂”学Java！

