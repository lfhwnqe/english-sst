import ScrollPlayer from "@/app/components/common/scrollPlayer";

export default function Play() {
  const str = `早晨例行场景英语表达分析
基础描述版本
I was woken up by my alarm at 8:10. I hit snooze for another 10 minutes. At 8:20, I had to get up. I went to the bathroom, brushed my teeth, washed my face, applied moisturizer, and styled my hair with hair pomade to create a classic vintage pompadour. I grabbed my phone, work ID, and keys, closed the door, double-checked if it was locked properly, and headed out.
场合变体
1 对同事
Got up around 8:20 after hitting snooze once. Did my usual morning routine - you know, freshening up and styling my pompadour. Made sure I had everything before heading out.
2 对朋友
Man, struggled with the alarm this morning! Hit snooze at 8:10, finally dragged myself out of bed at 8:20. Did the whole morning thing - bathroom, grooming, and got my hair just right. Almost forgot my work ID but caught it during my final door check!
3 对长辈
I woke up at my usual time this morning, around 8:10. After getting ready - taking care of personal hygiene and grooming - I made sure to have all my belongings before leaving home.
关键表达解析
起床相关表达:
hit snooze 更口语化，日常用语
postpone the alarm 更正式，书面语言
离开相关表达:
headed out 口语化，暗示开始行程
left home 正式，简单陈述
表达效果比较
描述起床过程:
1 dragged myself out of bed 强调困难和不情愿，适用于疲惫时的描述
2 got up 中性表达，适用于正式场合
3 jumped out of bed 表示精力充沛，适用于描述积极状态
描述检查动作:
1 double-checked the door 强调谨慎，常用于日常对话
2 checked if the door was locked 基础描述，适用于一般叙述
3 made sure everything was secure 全面的表达，适用于正式场合
情境扩展
匆忙版本
Barely made it through my morning routine! Snoozed once at 8:10, rushed through everything - quick bathroom visit, speed-brushing, splash of water on my face, quick pomade job, grabbed my stuff and dashed out after a hasty door check.
悠闲版本
Had a nice, relaxed morning start. Let myself snooze for exactly 10 minutes after the 8:10 alarm. Took my time with the bathroom routine, carefully styled my vintage pompadour, and methodically checked everything before leaving.
糟糕版本
Ugh, worst morning ever! Alarm didn't go off properly, ended up starting my day at 8:20. Rushed through everything, my hair wouldn't cooperate, and had to run back twice to check if I locked the door.
心情变化版本
1 疲惫时
Barely functioning this morning. The alarm at 8:10 felt like torture, desperately needed that extra 10-minute snooze.
2 精神好时
Up and at 'em at 8:10! Even though I took a quick snooze, felt refreshed and ready to tackle my morning routine. My pompadour turned out perfect today!
实用词汇与短语
Morning routine 晨间例行程序
Freshen up 整理仪容
Style one's hair 打理头发
Pomade 发蜡
Vintage pompadour 复古油头
Double-check 重复检查
Head out 出发
Grab 匆忙拿取
Rush through 匆忙完成
注意事项
1 场合用语要适当
2 时间表达可以根据场合灵活处理
3 情绪词汇的使用要符合说话对象
4 专业术语（如发型相关）可根据对话对象调整使用程度`;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ScrollPlayer audioUrl="/audio/getup.wav" text={str} />
    </div>
  );
}
