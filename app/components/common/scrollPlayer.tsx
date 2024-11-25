import AudioPlayer from "./audioPlayer";

interface Props {
  audioUrl: string;
  text: string;
  name: string;
}

export default function PagePlayer({ audioUrl, text, name }: Props) {
  const lines = text.split("\n") || [];
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-lg mb-2 font-bold">{name}</h1>
        {lines.map((i, index) => {
          return (
            <p key={index} className="mb-2">
              {i}
            </p>
          );
        })}
      </div>
      <div className=" ">
        <AudioPlayer src={audioUrl} />
      </div>
    </div>
  );
}
