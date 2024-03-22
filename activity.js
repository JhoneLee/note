function array2Map(array = [], key) {
  const map = new Map();
  array.forEach((item) => {
    map.set(item[key], item);
  });
  return map;
}

const orderList = [
  { id: 3, nextId: 2 },
  { id: 2, nextId: 5 },
  { id: 4, nextId: 8 },
  { id: 8, nextId: 1 },
  { id: 6, nextId: 10 },
  { id: 10, nextId: 9 },
];

const dataList = [
  { id: 4, name: "jack", parent: 2 },
  { id: 1, name: "mack", parent: 2 },
  { id: 3, name: "marry", parent: null },
  { id: 5, name: "tom", parent: null },
  { id: 2, name: "jerry", parent: null },
  { id: 7, name: "kate", parent: 5 },
  { id: 8, name: "jet", parent: 2 },
  { id: 10, name: "wuhuan", parent: 4 },
  { id: 6, name: "wuji", parent: 4 },
  { id: 9, name: "fff", parent: 4 },
  { id: 12, name: "aaa", parent: 4 },
  { id: 11, name: "bbb", parent: 4 },
  { id: 13, name: "ccc", parent: 7 },
  { id: 14, name: "eee", parent: 7 },
  { id: 15, name: "ddd", parent: 7 },
];

const resultMap = new Map();

// 根据 orderList 构建映射表
orderList.forEach(({ id, nextId }) => {
  if (!resultMap.has(id)) {
    resultMap.set(id, []);
  }
  if (!resultMap.has(nextId)) {
    resultMap.set(nextId, []);
  }
  resultMap.get(id).push(nextId);
});

function sortDataList(orderList, dataList) {
  console.log("sortDatalist dataList", dataList, resultMap);
  // 按照 orderList 的顺序对 dataList 进行排序
  const sortedDataList = [];
  const usedIdMap = new Map();
  const dataListMap = array2Map(dataList, "id");
  for (const { id } of orderList) {
    if (usedIdMap.has(id)) {
      // noSortDataList.push()
      continue;
    }
    const subList = [id];
    let nextId = id;
    while (resultMap.has(nextId) && resultMap.get(nextId).length > 0) {
      usedIdMap.set(nextId, true);
      nextId = resultMap.get(nextId)[0];
      subList.push(nextId);
    }

    const filterResult = subList
      .map((id) => {
        const item = dataListMap.get(id);
        dataListMap.delete(id);
        return item;
      })
      .filter((item) => !!item);
    sortedDataList.push(...filterResult);
  }
  // 处理未排序的元素
  console.log("yyyyyy", dataListMap);
  const otherArray = Array.from(dataListMap).map(([id, item]) => item);
  if (otherArray.length) {
    sortedDataList.push(...otherArray);
  }

  return sortedDataList;
}

function buildTree(dataList, orderList) {
  // 将 dataList 转换为 Map 对象，方便通过 id 进行快速查找
  const map = new Map();
  dataList.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, { ...item, children: [] });
    }
  });

  // 构建树结构
  const tree = [];
  map.forEach((node) => {
    const parentId = node.parent;
    if (parentId !== null && map.has(parentId)) {
      map.get(parentId).children.push(node);
    } else {
      tree.push(node);
    }
  });

  // 对每个节点的子节点按照 id 进行升序排序
  const sortChildren = (node) => {
    if (Array.isArray(node?.children) && node.children.length > 0) {
      const result = sortDataList(orderList, node.children);
      console.log("xxxx", result);
      node.children = result;
      node.children.forEach(sortChildren);
    }
    // node.children.sort((a, b) => a.id - b.id);
  };
  tree.forEach(sortChildren);

  // 对根节点按照 id 进行升序排序
  tree.sort((a, b) => a.id - b.id);

  return tree;
}

// const sortedDataList = sortDataList(orderList, dataList);
const sortedDataList = buildTree(dataList, orderList);

console.log(JSON.stringify(sortedDataList));
