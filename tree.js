function buildTree(dataList) {
  // 将 dataList 转换为 Map 对象，方便通过 id 进行快速查找
  const map = new Map();
  dataList.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, { ...item, children: [] });
    }
  });

  // 构建树结构
  const tree = [];
  map.forEach((node, id) => {
    const parentId = node.parent;
    if (parentId !== null && map.has(parentId)) {
      map.get(parentId).children.push(node);
    } else {
      tree.push(node);
    }
  });

  // 对每个节点的子节点按照 id 进行升序排序
  const sortChildren = (node) => {
    node.children.sort((a, b) => a.id - b.id);
    node.children.forEach(sortChildren);
  };
  tree.forEach(sortChildren);

  // 对根节点按照 id 进行升序排序
  tree.sort((a, b) => a.id - b.id);

  return tree;
}

const dataList = [
  { id: 1, parent: null },
  { id: 2, parent: 3 },
  { id: 7, parent: 1 },
  { id: 4, parent: 1 },
  { id: 3, parent: null },
  { id: 0, parent: null },
];

const tree = buildTree(dataList);
console.log(tree);
for (const t of tree) {
  console.log(t.children);
}
