import ScrollPlayer from "@/app/components/common/scrollPlayer";

export default function Play() {
  const str = `场景英语表达分析
A Typical Work Morning and Lunch Break
I arrive at the office and boot up my computer first thing in the morning
I open Notion to check my schedule and todo list
I launch my IDE and start working on the project
I open the design files to work on the UI implementation
When I need API documentation I consult with our Java developers
I debug and test the API integration
Our product manager schedules a Zoom meeting for requirement review
All relevant developers join to discuss the new features
We raise questions about unclear requirements
We also point out design issues that need improvement
At noon I grab my pre ordered lunch
I quickly finish my meal
I take the elevator to the company gym
I do some light exercise spending about 50 minutes walking on the treadmill
While exercising I watch some videos on my phone for entertainment
After working out I am all sweaty
Instead of taking a shower which would be time consuming I decide to freshen up
I go to the restroom to wipe off the sweat
Then I start my lunch break nap
应用 (Application)
基础描述版本
I am starting my workday at the office
我正在办公室开始我的工作日
First I need to boot up my computer and check my tasks
首先我需要启动电脑查看任务
I spend the morning coding and attending meetings
我整个上午都在编程和参加会议
At lunch I exercise in the gym before taking a break
午餐时我在健身房运动后休息
场合变体
对同事
Hey I will be in the requirement review meeting after I finish this API integration
嘿 我完成这个接口对接后就去参加需求评审会议
对朋友
Got a busy morning with coding and meetings but managed to squeeze in some exercise during lunch
上午很忙要写代码开会 不过午休时间还是抽空运动了下
对长辈
I have a good work life balance at this company they even provide a gym for employees
这家公司的工作生活平衡很好 甚至还为员工提供健身房
分析 (Analysis)
关键表达解析
boot up vs turn on
启动电脑的表达
boot up
更专业正式 常用于计算机场景
turn on
更口语化 使用范围更广
launch vs open
打开软件的表达
launch
正式用语 暗示启动较大的程序
open
通用说法 适用于所有类型文件和程序
evaluation (Evaluation)
表达效果比较
描述工作进度
I am working on the API integration
正在进行中 比较中性的表达
I am in the middle of the API integration
强调正处于关键阶段
I am about to finish the API integration
即将完成 带有时间紧迫感
描述运动强度
I do some light exercise
温和的表达 表示运动强度适中
I take a quick workout
简短有力 强调时间紧凑
I squeeze in some exercise
暗示时间有限 但仍然重视运动
Creation (Creation)
个性化表达
忙碌工作场景变体
I am juggling between coding and meetings this morning
我今天上午在编程和会议之间周旋
The morning flew by with back to back tasks
上午在一个接一个的任务中飞快过去
运动场景变体
I am sneaking in some exercise during lunch
我午餐时间偷偷做运动
I am treating myself to some me time at the gym
我在健身房享受属于自己的时光
实践建议
情境扩展
匆忙版
No time for shower just a quick freshen up before afternoon work
没时间洗澡 下午工作前快速整理一下
悠闲版
Taking my time to properly cool down after the workout
运动后悠闲地让身体冷却下来
疲惫版
The morning meetings drained me I really need this lunch break
上午的会议让我很疲惫 我真的需要这个午休时间
心情变化版
疲惫时
These meetings are wearing me out need some exercise to recharge
这些会议让我疲惫不堪 需要运动来充电
精神好
Feeling energized after the workout ready to tackle afternoon tasks
运动后感觉精力充沛 准备应对下午的任务`;
  return (
    <div className="">
      <ScrollPlayer
        audioUrl="https://nuo-english.s3.us-east-2.amazonaws.com/workstart.wav"
        text={str}
      />
    </div>
  );
}
