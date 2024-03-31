# 1 JavaScript 异步编程

## 1.1 背景

在程序执行过程中，有些任务可能会花费很长时间才能完成，比如从服务器获取数据、读取文件等。如果我们按照顺序执行这些任务，那么整个程序就会被阻塞，直到当前任务完成才能执行下一个任务，这会造成用户界面的冻结或者程序的停顿，给用户带来不好的体验。通过使用异步编程，我们可以让程序在执行这些耗时任务的同时继续执行其他任务，保持程序的响应性和流畅性。

## 1.2

在 JavaScript 中，传统的异步编程方式通常使用回调函数。这意味着你会提供一个函数作为参数，当异步操作完成时，这个函数会被调用。虽然这种方式在一定程度上解决了异步编程的问题，但是当任务变得复杂时，会产生回调地狱（callback hell）的问题，导致代码难以理解和维护。回调地狱指的是多个嵌套的回调函数，使得代码变得混乱、难以阅读和调试。这给开发者带来了很大的困扰，因此需要一种更优雅、易于理解和编写的异步编程方式来解决这个问题。

```js
// 第一个异步操作
asyncOperation1(function (result1, error1) {
  if (error1) {
    console.error("第一个操作失败:", error1);
  } else {
    console.log("第一个操作成功:", result1);

    // 第二个异步操作
    asyncOperation2(function (result2, error2) {
      if (error2) {
        console.error("第二个操作失败:", error2);
      } else {
        console.log("第二个操作成功:", result2);

        // 第三个异步操作
        asyncOperation3(function (result3, error3) {
          if (error3) {
            console.error("第三个操作失败:", error3);
          } else {
            console.log("第三个操作成功:", result3);

            // 这里可能还有更多的嵌套...
          }
        });
      }
    });
  }
});
```

# 2. Promise

## 2.1 Promise 是什么

举个例子： 假如你去餐厅吃饭，点了一份菜，服务员告诉你需要等待一段时间。菜未上桌前吃之前，你不会一直傻等着，会玩手机、聊天、打游戏，直到菜端上来你才进行关键的下一步操作--吃。Promise 就像是餐厅对这个菜的承诺，它告诉你“我会为你准备好这份菜，等一会儿”。你可以继续进行其他活动，一旦菜准备好了，你就可以拿到它、吃它。

## 2.2 Promise 介绍

### 2.2.1 Promise A+的规范：

Promise 的规范化由 Promises/A+ 规范所定义，它提供了一组标准的行为，以确保不同实现之间的互操作性和一致性。以下是 Promises/A+ 规范中定义的主要要点：
Promise 是一种用于异步编程的编程模式，它用于处理由于异步操作而产生的结果或错误。Promise 的规范化由 Promises/A+ 规范所定义，它提供了一组标准的行为，以确保不同实现之间的互操作性和一致性。以下是 Promises/A+ 规范中定义的主要要点：

**Promise 状态**：

- 一个 Promise 可以处于三种状态之一：待定（pending）、已完成（fulfilled）、已拒绝（rejected）。
- 待定状态是初始状态，它既不是已完成也不是已拒绝状态。
- 一旦 Promise 转为了已完成或已拒绝状态，则它的状态不会再改变。

**then 方法**：

- Promise 实例必须提供一个 `then` 方法，用于处理它的完成或拒绝情况。
- `then` 方法接收两个参数：`onFulfilled` 和 `onRejected`，分别是处理完成和拒绝情况的回调函数。

3. **onFulfilled 和 onRejected**：

   - 如果 `onFulfilled` 是一个函数，它必须在 Promise 转为已完成状态后调用，且其第一个参数是 Promise 的完成值。
   - 如果 `onRejected` 是一个函数，它必须在 Promise 转为已拒绝状态后调用，且其第一个参数是 Promise 的拒绝原因。
   - `then` 方法可以在同一个 Promise 实例上被调用多次，并且它们的调用顺序与它们被注册的顺序相同。

4. **then 方法返回一个 Promise**：

   - `then` 方法必须返回一个新的 Promise 实例。
   - 如果 `onFulfilled` 或 `onRejected` 返回了一个值 `x`，则执行 Promise 解析过程（Promise Resolution Procedure）。

5. **Promise 解析过程**：
   - 如果 `x` 是一个 Promise，那么新的 Promise 将采用 `x` 的状态。
   - 如果 `x` 是一个普通值，则新的 Promise 将转为已完成状态，并且完成值是 `x`。
   - 如果 `onFulfilled` 或 `onRejected` 抛出了一个异常 `e`，则新的 Promise 将转为已拒绝状态，并且拒绝原因是 `e`。

以上是 Promises/A+ 规范的主要内容，它确保了在不同实现之间的一致性，使得 Promise 在 JavaScript 中成为了一种通用的异步编程模式。

### 2.2.2 自己实现简单的 Promise

```js
// 判断有没有then
function isThenable(arg) {
  return !!(arg && arg.then);
}
//
function runThenable(func, arg) {
  if (!isThenable(arg)) {
    return func(arg);
  } else {
    return arg.then(func);
  }
}

class MyPromise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined; // 失败原因
    this.status = "pending"; // 是否结束
    this.successQue = []; // 保存成功执行函数队列
    this.failQue = []; // 保存失败执行函数对垒
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
  resolve(val) {
    if (this.status !== "pending") return;
    this.value = val;
    this.status = "fulfilled";

    // 当 executor 是一个同步函数的时候，如果遍历执行成功/失败队列会导致 then 函数来不及执行就结束了
    // 所以需要再次异步，让then注册的操作被放入队列后才能执行
    setTimeout(() => {
      this.successQue.forEach((cb) => cb(val));
    }, 0);
  }
  reject(reason) {
    if (this.status !== "pending") return;
    this.reason = reason;
    this.status = "rejected";

    setTimeout(() => {
      this.failQue.forEach((cb) => cb(reason));
    }, 0);
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  // 无论成功还是失败都要执行
  finally(cb) {
    // 给自己注册一个then回调
    return this.then(cb, cb);
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((nextFulfilled, nextRejected) => {
      const handleFulfilled = (value) => {
        try {
          // 执行当前 Resolve操作函数，并将结果传递给下一个 Resolve 函数
          runThenable(nextFulfilled, onFulfilled ? onFulfilled(value) : value);
        } catch (e) {
          nextRejected(e); // 把错误丢给下一个then的Reject
        }
      };

      const handleRejected = (reason) => {
        try {
          if (onRejected) {
            // 把失败结果传递给下一个Resolve
            runThenable(nextFulfilled, onRejected(reason));
          } else {
            // 如果当前没有注册Reject， 将参数传递给下一个Reject
            nextRejected(reason);
          }
        } catch (e) {
          nextRejected(e);
        }
      };
      // executor 或 当前调用then 的 Promise对象 是否执行完毕
      if (this.status !== "pending") {
        // 如果执行完毕，依次异步触发then调用链
        setTimeout(() => {
          this.reason !== undefined
            ? handleRejected(this.reason)
            : handleFulfilled(this.value);
        }, 0);
      } else {
        // 没有执行完毕，把Resolve 和 Reject 放入队列等待执行
        this.successQue.push(handleFulfilled);
        this.failQue.push(handleRejected);
      }
    });
  }
}

MyPromise.resolve = (x) => new MyPromise((r) => r(x));
MyPromise.reject = (x) => new MyPromise((r, j) => j(x));
```

测试一下：

```js
MyPromise.resolve(1)
  .then((v) => v + 1)
  .catch((e) => console.log(`won't happen error: ${e}`))
  .then((v) => {
    console.log(`continued: ${v}`);
    throw new Error("throw");
  })
  .then((v) => {
    console.log("won't happen then");
  })
  .catch((e) => {
    console.log(`catched: ${e}`);
    return 100;
  })
  .then((v) => {
    console.log(`continue after catch: ${v}`);
    return v;
  })
  .then((v) => new MyPromise((r) => setTimeout(() => r(v + 500), 3000)))
  .then((v) => console.log(`last: ${v}`))
  .finally(() => {
    console.log("finally exec");
  });
console.log("===========");

Promise.resolve(1)
  .then((v) => v + 1)
  .catch((e) => console.log(`1 won't happen error: ${e}`))
  .then((v) => {
    console.log(`1 continued: ${v}`);
    throw new Error("throw");
  })
  .then((v) => {
    console.log("won't happen then");
  })
  .catch((e) => {
    console.log(`1 catched: ${e}`);
    return 100;
  })
  .then((v) => {
    console.log(`1 continue after catch: ${v}`);
    return v;
  })
  .then((v) => new Promise((r) => setTimeout(() => r(v + 500), 3000)))
  .then((v) => console.log(`1 last: ${v}`))
  .finally(() => {
    console.log("1 finally exec");
  });
console.log("===========");
```

通过自定义实现，我们发现了 Promise 的一些特点：

- Promise 对象在定义时，会立即执行传入的函数
- Promise 对象的 then 链式调用为微任务，总是在宏任务(setTimeout setInterval)前执行 (前置知识：[宏任务与微任务](https://juejin.cn/post/6873424205791100942))
- Promise 的 then 调用在传入函数执行完毕后会自己逐级链式调用，如果传入函数没有执行完则放入执行队列等待函数执行结束后统一执行

### 2.2.3 Promise 自实现某些操作

**Resolve**
用于将 Promise 对象的状态从未决定（pending）转变为已完成（fulfilled），并指定成功的返回值

```js
MyPromise.resolve = (x) => new MyPromise((r) => r(x));
```

**Reject**
用于将 Promise 对象的状态从未决定（pending）转变为已拒绝（rejected），并指定失败的原因

```js
MyPromise.reject = (x) => new MyPromise((r, j) => j(x));
```

**All（全部）**
方法接收一个包含多个 Promise 对象的数组作为参数，并返回一个新的 Promise 对象
当传入的所有 Promise 对象都成功完成时，新的 Promise 对象将变为已完成状态，并将所有 Promise 对象的结果按顺序组成的数组作为成功的返回值。
如果传入的任何一个 Promise 对象失败，则新的 Promise 对象将立即变为已拒绝状态

```js
// 依次执行Promise队列
MyPromise.All = (promises) =>
  new MyPromise((onFulfilled, onRejected) => {
    let count = promises.length;
    const results = [];
    promises.forEach((p, i) => {
      // 记录Promise的执行情况，当都执行完毕后，把多个Promise的结果或错误传递给Promise.All 注册的Resolve 和 Reject 中
      return p.then(
        (value) => {
          results.push(value);
          count--;
          if (count == 0) {
            onFulfilled(results);
          }
        },
        (error) => {
          onRejected(error);
        }
      );
    });
  });
```

**Any（任意）**
接收一个包含多个 Promise 对象的数组作为参数，并返回一个新的 Promise 对象。
新的 Promise 对象将取决于数组中第一个成功完成的 Promise 对象的状态。
如果数组中没有一个 Promise 对象成功完成（即所有的 Promise 对象都失败），则新的 Promise 对象将立即变为已拒绝状态，并将所有失败的原因组成的数组作为拒绝的原因。

```js
// 有一个执行成功就全部成功，只有全部失败时才全部失败
MyPromise.Any = (promises) =>
  new MyPromise((onFulfilled, onRejected) => {
    let count = promises.length;
    promises.forEach((p, i) =>
      p.then(
        (value) => {
          onFulfilled(value);
        },
        (error) => {
          count--;
          if (count == 0) {
            onRejected(error);
          }
        }
      )
    );
  });
```

**Race（竞争）**
接收一个包含多个 Promise 对象的数组作为参数，并返回一个新的 Promise 对象。
新的 Promise 对象将取决于数组中第一个完成（无论是成功还是失败）的 Promise 对象的状态。
如果第一个完成的 Promise 对象成功，则新的 Promise 对象将变为已完成状态，并以成功的返回值解决。
如果第一个完成的 Promise 对象失败，则新的 Promise 对象将变为已拒绝状态，并以失败的原因拒绝

```js
MyPromise.race = (promises) =>
  new MyPromise((onFulfilled, onRejected) => {
    promises.forEach((p) =>
      p.then(
        (value) => onFulfilled(value),
        (error) => onRejected(error)
      )
    );
  });
```

### 2.2.4 all 、race、any 和 allSettled 的区别

```js
const fetchData1 = () => {
  // 模拟异步请求1
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Error in fetchData1");
    }, 2000);
  });
};

const fetchData2 = () => {
  // 模拟异步请求2
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data from fetchData2");
    }, 1500);
  });
};

const fetchData3 = () => {
  // 模拟异步请求3
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data from fetchData3");
    }, 1000);
  });
};

Promise.any([fetchData1(), fetchData2(), fetchData3()])
  .then((data) => {
    console.log("Any request completed:", data);
  })
  .catch((error) => {
    console.error("All requests failed:", error);
  });
Promise.race([fetchData1(), fetchData2(), fetchData3()])
  .then((data) => {
    console.log("Race request completed:", data);
  })
  .catch((error) => {
    console.error("Race request failed:", error);
  });
Promise.all([fetchData1(), fetchData2(), fetchData3()])
  .then((data) => {
    console.log("All requests completed:", data);
  })
  .catch((error) => {
    console.error("All requests failed:", error);
  });

Promise.allSettled([fetchData1(), fetchData2(), fetchData3()]).then(
  (results) => {
    console.log("All requests settled:", results);
  }
);
```

# 3 async/await

## 3.3 背景

虽然 Promise 在处理异步操作时已经极大地改善了 JavaScript 中的回调地狱问题，但它仍然具有一些局限性：

- 可读性差： 使用 Promise 时，我们需要通过 .then() 和 .catch() 来处理异步操作的结果和错误，这使得代码看起来有些冗长，尤其是当有多个异步操作需要串联时，代码结构可能会变得混乱。

- 错误处理困难： 使用 Promise 时，错误处理比较繁琐，需要通过 .catch() 来捕获错误。如果有多个异步操作，每个操作都需要进行错误处理，代码就会变得复杂。

ES2017 新定义的 async/await 关键字的出现能够让开发者像写同步代码那样处理异步问题。

## 3.2 概念介绍

async 关键字： 用于声明一个函数是异步函数。当我们在函数前面加上 async 关键字时，这个函数就成为了一个异步函数。异步函数会返回一个 Promise 对象，我们可以使用 await 来等待 Promise 对象的解决（resolved）

await 关键字： 只能在异步函数内部使用，它用于等待一个 Promise 对象的解决。当遇到 await 关键字时，代码会暂停执行，直到 Promise 对象解决为止。

```js
// 定义一个异步函数
async function fetchData() {
  // 模拟从网络获取数据，返回一个 Promise 对象
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched successfully!");
    }, 2000); // 模拟延迟2秒钟
  });
}

// 使用 async/await 来处理异步操作
async function fetchDataAndLog() {
  console.log("Start fetching data...");

  try {
    // 使用 await 来等待 fetchData 函数完成
    const result = await fetchData();

    // 当 fetchData 函数返回结果后，继续执行下面的代码
    console.log("Data:", result);
  } catch (error) {
    // 如果 fetchData 函数抛出错误，则会被捕获到这里
    console.error("Error fetching data:", error);
  }

  console.log("Fetching data completed.");
}

// 调用 fetchDataAndLog 函数
fetchDataAndLog();
```

## 3.3 理解 async/await

有以下做菜的例子：

```js
// 准备食材
function prepareIngredients() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("食材准备完成");
      resolve();
    }, 1000);
  });
}

// 切菜
function chopVegetables() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("菜切好了");
      resolve();
    }, 1000);
  });
}

// 烹饪
function cook() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("烹饪完成");
      resolve("美味的菜肴");
    }, 1000);
  });
}

// 如果使用 async/await 进行操做
// 整个做菜过程
async function makeDish() {
  console.log("开始做菜");
  await prepareIngredients();
  await chopVegetables();
  const dish = await cook();
  console.log("菜做好了:", dish);
  console.log("做菜完成");
}

makeDish();
```

在没有 async/await 之前：

```js
// 准备食材
function prepareIngredients() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("食材准备完成");
      resolve();
    }, 1000);
  });
}

// 切菜
function chopVegetables() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("菜切好了");
      resolve();
    }, 1000);
  });
}

// 烹饪
function cook() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("烹饪完成");
      resolve("美味的菜肴");
    }, 1000);
  });
}

// Generator 函数来模拟异步操作
function* makeDish() {
  console.log("开始做菜");
  yield prepareIngredients();
  yield chopVegetables();
  const dish = yield cook();
  console.log("菜做好了:", dish);
  console.log("做菜完成");
}

// 执行 Generator 函数
function execute(generator) {
  const iterator = generator();

  function iterate({ value, done }) {
    if (done) {
      return;
    }

    if (value instanceof Promise) {
      value
        .then((result) => {
          iterate(iterator.next(result));
        })
        .catch((error) => {
          iterator.throw(error);
        });
    } else {
      iterate(iterator.next(value));
    }
  }

  iterate(iterator.next());
}

execute(makeDish);
```

总结：async 和 await 其实就是 Generator 和 Promise 的语法糖。

## 3.4 编码常见问题

TODO 找一些日常检视代码中出现的 async await 错误问题
