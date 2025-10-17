---
title: mysql 知识点
catalog: true
date: 2025-10-17 14:41:00
subtitle:
header-img:
tags: 数据库
---

# 条件分支

## CASE WHEN

```sql
SELECT
  name,
  CASE WHEN (name = '鸡哥') THEN '会' ELSE '不会' END AS can_rap
FROM
  student;
```

# 聚合

## Group by
分组聚合，针对特定字段聚合

## HAVING

where 子句在分组之前过滤，HAVING 子句用于分组之后过滤

```sql
// 统计学生表中班级的总成绩超过 150 分的班级编号（class_id）和总成绩（total_score）。

SELECT
  class_id,
  SUM(score) AS total_score
FROM
  student
GROUP BY
  class_id
HAVING
  SUM(score) > 150;
```


# 关联查询

## cross join

CROSS JOIN 是一种简单的关联查询，不需要任何条件来匹配行，它直接将左表的 每一行 与右表的 每一行 进行组合，返回的结果是两个表的笛卡尔积。

> 笛卡尔积: 指的是两个集合中所有可能的有序对的组合，没有任何条件限制

```sql
SELECT e.emp_name, e.salary, d.department, d.manager
FROM employees e
CROSS JOIN departments d;
```

可简写为

```sql
SELECT e.emp_name, e.salary, d.department, d.manager
FROM employees e, departments d;
```

##  inner join

它根据两个表之间的关联条件，将满足条件的行组合在一起。

注意：只返回两个表中满足关联条件的交集部分，即在两个表中都存在的匹配行。

```sql
SELECT e.emp_name, e.salary, e.department, d.manager
FROM employees e
JOIN departments d ON e.department = d.department;
```

## outer join

OUTER JOIN 是一种关联查询方式，它根据指定的关联条件，将两个表中满足条件的行组合在一起，并 包含没有匹配的行 。

在 OUTER JOIN 中，包括 LEFT OUTER JOIN 和 RIGHT OUTER JOIN 两种类型，它们分别表示查询左表和右表的所有行（即使没有被匹配），再加上满足条件的交集部分。

```sql
SELECT e.emp_name, e.salary, e.department, d.manager
FROM employees e
LEFT JOIN departments d ON e.department = d.department;
```


# 子查询

在一个查询语句内部 嵌套 另一个完整的查询语句，内层查询被称为子查询

```sql
-- 主查询
SELECT name, city
FROM customers
WHERE customer_id IN (
    -- 子查询
    SELECT DISTINCT customer_id
    FROM orders
    WHERE total_amount > 200
);
```

## exists

用于检查主查询的结果集是否存在满足条件的记录，它返回布尔值（True 或 False），而不返回实际的数据。

```sql
-- 主查询
SELECT name, total_amount
FROM customers
WHERE EXISTS (
    -- 子查询
    SELECT 1
    FROM orders
    WHERE orders.customer_id = customers.customer_id
);
```

# 组合查询

## UNION

它用于将两个或多个查询的结果集合并， 并去除重复的行 。即如果两个查询的结果有相同的行，则只保留一行。

```sql
SELECT name, age, department
FROM table1
UNION
SELECT name, age, department
FROM table2;
```

## UNION ALL

用于将两个或多个查询的结果集合并， 但不去除重复的行 。即如果两个查询的结果有相同的行，则全部保留。

```sql
-- UNION ALL操作，保留了重复的行
SELECT name, age, department
FROM table1
UNION ALL
SELECT name, age, department
FROM table2;
```

# 开窗函数

## SUM OVER

```sql
// 计算每个客户的订单总金额，并显示每个订单的详细信息，同时保留原始行的详细信息 
SELECT 
    order_id, 
    customer_id, 
    order_date, 
    total_amount,
    SUM(total_amount) OVER (PARTITION BY customer_id) AS customer_total_amount
FROM
    orders;
```

## SUM OVER ORDER BY

```sql
// 计算每个客户的历史订单累计金额，按照 customer_id 进行分组，并按照 order_date 进行排序
SELECT 
    order_id, 
    customer_id, 
    order_date, 
    total_amount,
    SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS cumulative_total_amount
FROM
    orders;
```

## RANK

对查询结果集中的行进行 排名 的开窗函数，它可以根据指定的列或表达式对结果集中的行进行排序，并为每一行分配一个排名。

Rank 开窗函数的常见用法是在查询结果中查找前几名（Top N）或排名最高的行。

```sql
// 为每个客户的订单按照订单金额降序排名
SELECT 
    order_id, 
    customer_id, 
    order_date, 
    total_amount,
    RANK() OVER (PARTITION BY customer_id ORDER BY total_amount DESC) AS customer_rank
FROM
    orders;
```

## row_number

用于为查询结果集中的每一行 分配唯一连续排名 的开窗函数。

```sql
// 为每个客户的订单按照订单金额降序排列，并且分配一个 row_number 编号

SELECT 
    order_id, 
    customer_id, 
    order_date, 
    total_amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total_amount DESC) AS row_number
FROM
    orders;
```

## LAG / LEAD

开窗函数 Lag 和 Lead 的作用是获取在当前行之前或之后的行的值，这两个函数通常在需要比较相邻行数据或进行时间序列分析时非常有用。

```sql

LAG(column_name, offset, default_value) OVER (PARTITION BY partition_column ORDER BY sort_column)

```

参数解释：

- column_name：要获取值的列名。
- offset：表示要向上偏移的行数。例如，offset为1表示获取上一行的值，offset为2表示获取上两行的值，以此类推。
- default_value：可选参数，用于指定当没有前一行时的默认值。
- PARTITION BY和ORDER BY子句可选，用于分组和排序数据。


```sql
// 查询每个学生的考试日期和上一次考试的成绩，以及下一次考试的成绩
SELECT 
    student_id,
    exam_date,
    score,
    LAG(score, 1, NULL) OVER (PARTITION BY student_id ORDER BY exam_date) AS previous_score,
    LEAD(score, 1, NULL) OVER (PARTITION BY student_id ORDER BY exam_date) AS next_score
FROM
    scores;
```


# 聚合函数

- COUNT：计算指定列的行数或非空值的数量。
- SUM：计算指定列的数值之和。
- AVG：计算指定列的数值平均值。
- MAX：找出指定列的最大值。
- MIN：找出指定列的最小值。

# 时间函数

- DATE：获取当前日期
- DATETIME：获取当前日期时间
- TIME：获取当前时间

```sql
-- 获取当前日期
SELECT DATE() AS current_date;

-- 获取当前日期时间
SELECT DATETIME() AS current_datetime;

-- 获取当前时间
SELECT TIME() AS current_time;
```

#

字符拼接 ||



保留几位小数 ROUND(name, 2)



```sql
/**
*统计每个英雄定位的胜率（胜利场次/总场次*100）
计算每个英雄定位的平均KDA（(击杀+助攻)/死亡）
统计每个英雄定位的总对局数
只显示对局数大于等于5场的英雄定位
按胜率降序排列
返回字段：英雄定位（hero_role）、胜率（win_rate，保留1位小数，加%符号）、平均KDA（avg_kda，保留2位小数）、总对局数（total_matches）
 */


select
  hero_role,
  ROUND((
    SUM(CASE WHEN (game_result = '胜利') THEN 1 ELSE 0 END) * 100.0 / COUNT(game_result)
  ), 1) || '%' as win_rate,
  ROUND(AVG((kills + assists) * 1.0 / CASE WHEN deaths = 0 THEN 1 ELSE deaths END ), 2) as avg_kda,
  COUNT(match_id) as total_matches
from
  game_matches
group by
  hero_role
HAVING
  COUNT(match_id) >= 5
ORDER BY
  win_rate DESC

```