import ScrollPlayer from "@/app/components/common/scrollPlayer";

export default function Play() {
  const str = `场景英语表达分析
Morning Routine from Waking Up to Heading Out
I was woken up by my alarm at 8:10
I hit the snooze button for another 10 minutes of sleep
At 8:20, I had to get up
I went to the bathroom, brushed my teeth, washed my face, and applied face cream
I styled my hair with pomade for a classic slicked-back look
I grabbed my phone, work ID, and keys
I closed the door and double-checked if it was properly locked
Then I headed out for the day
应用 (Application)
基础描述版本
我被闹钟在8点10分叫醒
我按了贪睡按钮想再睡10分钟
8点20分我不得不起床了
我去洗手间刷牙洗脸擦护肤品
我用发蜡做了个复古油头造型
我拿上手机工卡和钥匙
我关上门并检查是否锁好
然后我出门了
场合变体
对同事
I overslept a bit this morning
早上我睡过头了一会
对朋友
Man I barely made it out of bed this morning
老兄我今天早上好不容易才爬起来
对长辈
I started my day a little later than usual today
今天我比平时晚起了一点
分析 (Analysis)
关键表达解析
wake up vs be woken up
自然醒来的表达
wake up
主动醒来的行为表达
be woken up
被动醒来的表达
hit the snooze button vs turn off alarm
贪睡按钮操作表达
hit the snooze button
更生动形象的表达方式
turn off alarm
直接关闭的表达方式
评估 (Evaluation)
表达效果比较
描述起床过程
I dragged myself out of bed
体现起床困难的状态
I jumped out of bed
形容精神饱满的起床状态
I slowly got up
描述慢慢起床的过程
描述整理过程
I rushed through my morning routine
匆忙进行晨间护理的表达
I took my time getting ready
从容准备的表达
I went about my usual morning routine
按平常节奏进行的表达
创造 (Creation)
个性化表达
赶时间场景
Time to dash through my morning prep
该快速完成晨间准备了
Running way behind schedule here
这里已经严重落后于计划了
悠闲场景
Taking it slow this lovely morning
在这个美好的早晨慢慢来
No rush just a peaceful start
不着急享受平静的开始
实践建议
情境扩展
匆忙版
Gotta sprint through this morning routine
必须快速完成这个早晨流程
悠闲版
Enjoying a relaxed morning start
享受轻松的早晨时光
糟糕版
Everything is going wrong this morning
今早所有事情都不顺心
心情变化版
疲惫时
Another morning another struggle
又一个早晨又一次挣扎
精神好
Ready to tackle the day ahead
准备迎接新的一天`;
  return (
    <div className="">
      <ScrollPlayer
        audioUrl="https://nuo-english.s3.us-east-2.amazonaws.com/getup.wav"
        text={str}
      />
    </div>
  );
}
