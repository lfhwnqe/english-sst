import AudioPlayer from "./audioPlayer";

interface Props {
  audioUrl: string;
  text: string;
}

export default function PagePlayer({ audioUrl, text }: Props) {
  const lines = text.split("\n") || [];

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        {lines.map((i, index) => {
          return <p key={index} className="mb-2">{i}</p>;
        })}
      </div>
      <div className=" ">
        <AudioPlayer src={audioUrl} />
      </div>
    </div>
  );
}
