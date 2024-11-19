import { useCallback, useState } from "react";
import { produce, Draft, freeze } from "immer";

export type DraftFunction<T> = (draft: Draft<T>) => void;
export type Updater<T> = (args: T | DraftFunction<T>) => void;
export type ImmerHook = any;

export default function useImmer<T = unknown>(
  initialVal: T | (() => T)
): ImmerHook {
  const [val, setVal] = useState(() =>
    freeze(
      typeof initialVal === "function" ? (initialVal as () => T)() : initialVal,
      true
    )
  );
  return [
    val,
    useCallback((updater: Updater<T>) => {
      setVal((prevVal) => {
        if (typeof updater === "function") {
          return produce(prevVal, updater);
        } else {
          return freeze(updater);
        }
      });
    }, []),
  ];
}

// export default useImmer;
// 使用示例
// const [a, setA] = useImmer<{ num: number }>({ num: 1 });
// setA((aDraft) => {
//   aDraft.num = aDraft.num + 1;
// });
