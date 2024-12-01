import AudioPlayer from "./h5AudioPlayer";
// import AudioPlayer from "./audioPlayer";
// import ScrollPagedContent from "./scrollPagedContent";

interface Props {
  audioUrl: string;
  text: string;
  name: string;
}

export default function PagePlayer({ audioUrl }: Props) {
  return (
    //  // 使用绝对定位避免body滚动
    <div className="fixed inset-0 flex flex-col  overscroll-none">
      {/* 内容区域 - 可滚动，但限制在容器内 */}
      {/* <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4">
          <h1 className="text-lg mb-2 font-bold">{name}</h1>
          {lines.map((i, index) => {
            return (
              <p key={index} className="mb-2 text-lg">
                {i}
              </p>
            );
          })}
        </div>
      </main> */}
      {/* <ScrollPagedContent text={text} name={name} /> */}

      <div className="w-full  pb-safe">
        <AudioPlayer src={audioUrl} />
      </div>
    </div>
  );
}
