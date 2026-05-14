export type Resource = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  code: string;
  category: string;
  date: string;
  instagram_url: string;
  pdf_url?: string;
};

export const resources: Resource[] = [
  {
    id: '1',
    title: 'SQL Joins Cheat Sheet',
    excerpt: 'Master Inner, Left, Right, and Full joins with visual diagrams and code snippets.',
    content: `
# SQL Joins Cheat Sheet

SQL joins are used to combine rows from two or more tables, based on a related column between them.

## 1. INNER JOIN
Returns records that have matching values in both tables.
\`\`\`sql
SELECT orders.OrderID, customers.CustomerName
FROM orders
INNER JOIN customers ON orders.CustomerID = customers.CustomerID;
\`\`\`

## 2. LEFT JOIN
Returns all records from the left table, and the matched records from the right table.
\`\`\`sql
SELECT customers.CustomerName, orders.OrderID
FROM customers
LEFT JOIN orders ON customers.CustomerID = orders.CustomerID;
\`\`\`

## 3. RIGHT JOIN
Returns all records from the right table, and the matched records from the left table.

## 4. FULL JOIN
Returns all records when there is a match in either left or right table.
    `,
    code: 'Dslogs-001',
    category: 'SQL',
    date: '2024-05-10',
    instagram_url: 'https://instagram.com/p/12345',
    pdf_url: '/files/sql-joins.pdf'
  },
  {
    id: '2',
    title: 'Pandas Data Cleaning Guide',
    excerpt: 'Learn how to handle missing values, duplicates, and data types in Python Pandas.',
    content: '# Pandas Data Cleaning Guide...',
    code: 'Dslogs-002',
    category: 'Python',
    date: '2024-05-08',
    instagram_url: 'https://instagram.com/p/23456'
  },
  {
    id: '3',
    title: 'Data Science Interview Prep',
    excerpt: 'Top 20 questions asked in data science interviews at top tech companies.',
    content: '# Data Science Interview Prep...',
    code: 'Dslogs-003',
    category: 'Career',
    date: '2024-05-05',
    instagram_url: 'https://instagram.com/p/34567'
  }
];

export const categories = ['All', 'Python', 'SQL', 'Career', 'ML', 'Stats'];
