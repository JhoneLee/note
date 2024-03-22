module.exports = {
  dataList: [
    { id: 4, name: "jack" },
    { id: 1, name: "mack" },
    { id: 3, name: "marry" },
    { id: 5, name: "tom" },
    { id: 2, name: "jerry" },
    { id: 7, name: "kate" },
    { id: 8, name: "jet" },
  ],
  orderList: [
    { id: 3, nextId: 2 },
    { id: 2, nextId: 5 },
    { id: 4, nextId: 8 },
    { id: 8, nextId: 1 },
  ],
};

const result = [
  [
    { id: 3, name: "marry" },
    { id: 2, name: "jerry" },
    { id: 5, name: "tom" },
  ],
  [
    { id: 4, name: "jack" },
    { id: 8, name: "jet" },
    { id: 1, name: "mack" },
  ],
  [{ id: 7, name: "kate" }],
];

const dataList = [
  { id: 1, parent: null },
  { id: 2, parent: 3 },
  { id: 7, parent: 1 },
  { id: 4, parent: 1 },
  { id: 3, parent: null },
  { id: 0, parent: null },
];

sortResult = [
  { id: 0, children: [] },
  {
    id: 1,
    children: [
      { id: 4, children: [] },
      { id: 7, children: [] },
    ],
  },
  { id: 3, children: [{ id: 2, children: [] }] },
];
